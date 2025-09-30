import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { supabase, Chat, ChatAgent, ChatMessage } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

interface ChatContextType {
  chats: Chat[]
  activeChatId: string | null
  activeChat: Chat | null
  loading: boolean
  startNewChat: (agent: ChatAgent, firstUserMessageContent: string) => Promise<Chat | null>
  appendMessageToActive: (message: Omit<ChatMessage, 'timestamp'>) => Promise<void>
  setActiveChat: (chatId: string) => void
  fetchChats: () => Promise<void>
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

const isPlaceholderSupabase = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
  return supabaseUrl.includes('placeholder')
}

function generateTitleFromContent(content: string): string {
  const words = content.trim().split(/\s+/)
  const titleWords = words.slice(0, 6)
  const suffix = words.length > 6 ? '…' : ''
  return (titleWords.join(' ') + suffix) || 'New Chat'
}

function getRouteForAgent(agent: ChatAgent): string {
  switch (agent) {
    case 'Vira':
      return '/vira'
    case 'Bizzy':
      return '/bizzy'
    case 'Artie':
      return '/artie'
    case 'Mak':
      return '/mak'
    default:
      return '/'
  }
}

function useLocalStorageChats(userId: string | null) {
  const storageKey = userId ? `productica_chats_${userId}` : null

  const read = useCallback((): Chat[] => {
    if (!storageKey) return []
    try {
      const raw = localStorage.getItem(storageKey)
      if (!raw) return []
      const parsed = JSON.parse(raw) as Chat[]
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }, [storageKey])

  const write = useCallback((chats: Chat[]) => {
    if (!storageKey) return
    try {
      localStorage.setItem(storageKey, JSON.stringify(chats))
    } catch {
      // ignore
    }
  }, [storageKey])

  const clear = useCallback(() => {
    if (!storageKey) return
    try {
      localStorage.removeItem(storageKey)
    } catch {
      // ignore
    }
  }, [storageKey])

  return { read, write, clear }
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [chats, setChats] = useState<Chat[]>([])
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const { read, write, clear } = useLocalStorageChats(user?.id ?? null)

  const activeChat = useMemo(() => chats.find(c => c.id === activeChatId) || null, [chats, activeChatId])

  const fetchChats = useCallback(async () => {
    if (!user) {
      setChats([])
      setActiveChatId(null)
      return
    }

    setLoading(true)
    try {
      if (isPlaceholderSupabase()) {
        const local = read()
        setChats(local)
        if (local.length > 0 && !activeChatId) {
          setActiveChatId(local[0].id)
        }
        return
      }

      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })

      if (error) throw error
      setChats((data as unknown as Chat[]) || [])
      if (data && data.length > 0 && !activeChatId) {
        setActiveChatId((data[0] as any).id)
      }
    } catch (err) {
      console.error('Failed to fetch chats', err)
    } finally {
      setLoading(false)
    }
  }, [user, read, activeChatId])

  // Load chats when user changes
  useEffect(() => {
    fetchChats()
  }, [fetchChats])

  // Persist to localStorage when chats change in demo mode
  useEffect(() => {
    if (isPlaceholderSupabase()) {
      write(chats)
    }
  }, [chats, write])

  // Clear on sign-out
  useEffect(() => {
    if (!user) {
      setChats([])
      setActiveChatId(null)
      if (isPlaceholderSupabase()) clear()
    }
  }, [user, clear])

  const setActiveChat = useCallback((chatId: string) => {
    setActiveChatId(chatId)
  }, [])

  const startNewChat = useCallback(async (agent: ChatAgent, firstUserMessageContent: string) => {
    if (!user) return null

    const nowIso = new Date().toISOString()
    const newChat: Chat = {
      id: isPlaceholderSupabase() ? `local_${Date.now()}` : crypto.randomUUID(),
      user_id: user.id,
      agent,
      title: generateTitleFromContent(firstUserMessageContent),
      messages: [
        {
          role: 'user',
          content: firstUserMessageContent,
          timestamp: nowIso,
        },
      ],
      created_at: nowIso,
      updated_at: nowIso,
    }

    try {
      if (isPlaceholderSupabase()) {
        setChats(prev => [newChat, ...prev])
        setActiveChatId(newChat.id)
        return newChat
      }

      const { data, error } = await supabase
        .from('chats')
        .insert([
          {
            user_id: newChat.user_id,
            agent: newChat.agent,
            title: newChat.title,
            messages: newChat.messages,
          },
        ])
        .select('*')
        .single()

      if (error) throw error
      const created = data as unknown as Chat
      setChats(prev => [created, ...prev])
      setActiveChatId(created.id)
      return created
    } catch (err) {
      console.error('Failed to start chat', err)
      return null
    }
  }, [user])

  const appendMessageToActive = useCallback(async (message: Omit<ChatMessage, 'timestamp'>) => {
    if (!activeChat) return
    const nowIso = new Date().toISOString()
    const updatedMessages: ChatMessage[] = [...activeChat.messages, { ...message, timestamp: nowIso }]

    try {
      if (isPlaceholderSupabase()) {
        setChats(prev => prev.map(c => c.id === activeChat.id ? { ...c, messages: updatedMessages, updated_at: nowIso } : c))
        return
      }

      const { data, error } = await supabase
        .from('chats')
        .update({ messages: updatedMessages })
        .eq('id', activeChat.id)
        .select('*')
        .single()

      if (error) throw error
      const updated = data as unknown as Chat
      setChats(prev => prev.map(c => c.id === updated.id ? updated : c))
    } catch (err) {
      console.error('Failed to append message', err)
    }
  }, [activeChat])

  const value: ChatContextType = {
    chats,
    activeChatId,
    activeChat,
    loading,
    startNewChat,
    appendMessageToActive,
    setActiveChat,
    fetchChats,
  }

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

export function useChat() {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('useChat must be used within a ChatProvider')
  return ctx
}

export { getRouteForAgent, generateTitleFromContent }

