import { Search, Lightbulb, BarChart3, Target, Sparkles, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useCreditSystem } from "@/hooks/useCreditSystem";
import { LoginModal } from "@/components/LoginModal";
import { LoadingState } from "@/components/LoadingState";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useStartupContext } from "@/hooks/useStartupContext";
import { usePDFGenerator } from "@/hooks/usePDFGenerator";
import { useChat } from "@/contexts/ChatContext";
import type { Chat } from "@/lib/supabase";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}
const quickActions = [{
  id: "bizzy",
  title: "Bizzy",
  subtitle: "Business strategist",
  path: "/bizzy"
}, {
  id: "artie",
  title: "Artie", 
  subtitle: "Creative designer",
  path: "/artie"
}, {
  id: "mak",
  title: "Mak",
  subtitle: "Social media handler", 
  path: "/mak"
}, {
  id: "vira",
  title: "Vira",
  subtitle: "Virtual Co-Founder",
  path: "/vira"
}];
export function Homepage() {
  const navigate = useNavigate();
  const { getContextString } = useStartupContext();
  const { generateReportPDF } = usePDFGenerator();
  const {
    credits,
    isLoggedIn,
    isDemoUser,
    enableDemoUser,
    showOutOfCreditsModal,
    deductCredit
  } = useCreditSystem();
  const [showLogin, setShowLogin] = useState(false);
  const { activeChat, activeChatId, startNewChat, appendMessageToActive, setActiveChat } = useChat();
  const [searchQuery, setSearchQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatMode, setIsChatMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Sync UI with active chat (General)
  useEffect(() => {
    if (!activeChat) return;
    if (activeChat && activeChat.agent === 'General') {
      setIsChatMode(true);
      const mapped = activeChat.messages.map(m => ({
        id: `${m.timestamp}`,
        content: m.content,
        role: m.role === 'user' ? 'user' : 'assistant',
        timestamp: new Date(m.timestamp),
      }));
      setMessages(mapped);
    }
  }, [activeChat]);
  const handleQuickAction = async (path: string) => {
    if (!isLoggedIn && !isDemoUser) {
      setShowLogin(true);
      return;
    }
    if (credits <= 0) {
      showOutOfCreditsModal();
      return;
    }

    // Deduct credit for quick action
    const success = await deductCredit("Quick Action", "Homepage");
    if (success) {
      navigate(path);
    }
  };
  const handleSearch = async () => {
    if (!searchQuery.trim() || isLoading) return;
    if (!isLoggedIn && !isDemoUser) {
      setShowLogin(true);
      return;
    }
    if (credits <= 0) {
      showOutOfCreditsModal();
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: searchQuery.trim(),
      role: "user",
      timestamp: new Date(),
    };

    // Trigger chat mode after first submission
    if (!isChatMode) {
      setIsChatMode(true);
    }

    setMessages(prev => [...prev, userMessage]);
    setSearchQuery("");
    setIsLoading(true);

    // Persist chat creation/appending in General context only
    try {
      if (!activeChat || activeChat.agent !== 'General') {
        const created = await startNewChat('General', userMessage.content);
        if (created) {
          setActiveChat(created.id);
        }
      } else {
        await appendMessageToActive({ role: 'user', content: userMessage.content });
      }
    } catch (e) {
      console.error('Chat persistence error (homepage):', e);
    }

    // Move credit deduction to after successful response

    try {
      // Prepare message with startup context if available
      const contextString = getContextString();
      const messageWithContext = contextString 
        ? `${contextString}\n\nUser Message: ${userMessage.content}`
        : userMessage.content;

      // Call Stack-AI API
      const response = await fetch('https://api.stack-ai.com/inference/v0/run/82daafa8-4b94-431b-989d-d482e0c29e95/688b18a8a5b76f214fb2774d', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 24aca533-c147-4a96-a309-b59bf6bb9c77'
        },
        body: JSON.stringify({
          "user_id": `productica_main_${Date.now()}`,
          "in-0": messageWithContext
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.outputs?.["out-0"] || "I apologize, but I couldn't generate a response. Please try again.",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);

      // Deduct credit only after a successful response
      try {
        await deductCredit("AI Analysis", "Homepage");
      } catch {}

      // Persist assistant message
      try {
        await appendMessageToActive({ role: 'agent', content: aiMessage.content });
      } catch (e) {
        console.error('Failed to persist assistant message (homepage):', e);
      }
    } catch (error) {
      console.error('Stack-AI API error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I encountered an error while processing your request. Please try again.",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);

      // Persist assistant error message
      try {
        await appendMessageToActive({ role: 'agent', content: errorMessage.content });
      } catch {}
    } finally {
      setIsLoading(false);
    }
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  return (
    <div className="flex flex-col h-full">
      {!isChatMode ? (
        // Initial Home Interface
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-4xl mx-auto space-y-8 sm:space-y-12">
            {/* Brand Title */}
            <div className="text-center animate-fade-in">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-raleway-dots text-foreground mb-4">productica</h1>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto animate-fade-in">
              <div className="relative flex items-center">
                <Search className="absolute left-3 sm:left-4 w-4 h-4 sm:w-5 sm:h-5 text-text-muted z-10" />
                <Input 
                  type="text" 
                  placeholder="Ask about your startup idea..." 
                  value={searchQuery} 
                  onChange={e => setSearchQuery(e.target.value)} 
                  onKeyPress={handleKeyPress} 
                  disabled={isLoading}
                  className="w-full h-12 sm:h-14 pl-10 sm:pl-12 pr-20 sm:pr-24 text-base sm:text-lg bg-card text-card-foreground border border-border rounded-full 
                            focus:ring-2 focus:ring-ring focus:ring-opacity-50 focus:border-ring
                            transition-all duration-200 hover:border-border-hover placeholder:text-text-muted placeholder:text-sm sm:placeholder:text-base" 
                />
                <Button 
                  onClick={handleSearch} 
                  disabled={!searchQuery.trim() || isLoading}
                  className="absolute right-1 sm:right-2 h-8 sm:h-10 px-3 sm:px-6 bg-primary text-primary-foreground hover:bg-primary-hover rounded-full
                            transition-all duration-200 border-0 text-sm sm:text-base disabled:opacity-50">
                  Submit
                </Button>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-2 sm:gap-3 animate-fade-in px-2">
              {quickActions.map(action => (
                <Button 
                  key={action.id} 
                  onClick={() => handleQuickAction(action.path)} 
                  variant="outline" 
                  className="w-full sm:w-auto h-16 sm:h-14 px-4 sm:px-6 bg-card text-card-foreground border border-border hover:bg-card-hover 
                            rounded-xl transition-all duration-200
                            hover:border-border-hover hover:scale-105 text-sm sm:text-base flex flex-col items-center justify-center gap-1">
                  <span className="font-medium">{action.title}</span>
                  <span className="text-xs text-text-muted">{action.subtitle}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // Chat Mode Interface
        <>
          {/* Top Header with Logo */}
          <div className="flex-shrink-0 px-4 sm:px-6 lg:px-8 py-4 border-b border-border animate-slide-in-right">
            <div className="flex items-center">
              <h1 className="text-2xl sm:text-3xl font-raleway-dots text-foreground">productica</h1>
            </div>
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="w-full max-w-4xl mx-auto space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-4 animate-fade-in",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  )}
                  
                  <div
                    className={cn(
                      "max-w-[70%] rounded-2xl px-4 py-3 shadow-sm",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border text-card-foreground"
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                      {message.role === "assistant" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => generateReportPDF(message.content, "Productica")}
                          className="h-6 px-2 text-xs hover:bg-accent/20"
                        >
                          <Download className="w-3 h-3 mr-1" />
                          PDF
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {message.role === "user" && (
                    <div className="w-8 h-8 bg-secondary border border-border rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-foreground">U</span>
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <LoadingState 
                  variant="typing" 
                  message="Analyzing your idea..." 
                />
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Bottom Chat Bar */}
          <div className="flex-shrink-0 border-t border-border bg-background/95 backdrop-blur animate-slide-in-right">
            <div className="px-4 sm:px-6 lg:px-8 py-4">
              <div className="w-full max-w-4xl mx-auto">
                <div className="relative flex items-center">
                  <Search className="absolute left-3 sm:left-4 w-4 h-4 sm:w-5 sm:h-5 text-text-muted z-10" />
                  <Input 
                    type="text" 
                    placeholder="Continue the conversation..." 
                    value={searchQuery} 
                    onChange={e => setSearchQuery(e.target.value)} 
                    onKeyPress={handleKeyPress} 
                    disabled={isLoading}
                    className="w-full h-12 pl-10 sm:pl-12 pr-20 sm:pr-24 text-base bg-card text-card-foreground border border-border rounded-full 
                              focus:ring-2 focus:ring-ring focus:ring-opacity-50 focus:border-ring
                              transition-all duration-200 hover:border-border-hover placeholder:text-text-muted" 
                  />
                  <Button 
                    onClick={handleSearch} 
                    disabled={!searchQuery.trim() || isLoading}
                    className="absolute right-1 sm:right-2 h-8 px-4 sm:px-6 bg-primary text-primary-foreground hover:bg-primary-hover rounded-full
                              transition-all duration-200 border-0 text-sm disabled:opacity-50">
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <LoginModal open={showLogin} onOpenChange={setShowLogin} onDemoUser={enableDemoUser} />
    </div>
  );
}