import { useState } from "react";
import { MessageSquare, History, ChevronRight, ChevronDown, Building2 } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, useSidebar } from "@/components/ui/sidebar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/ThemeProvider";
import { StartupFormModal } from "@/components/StartupFormModal";
import { useStartupContext } from "@/hooks/useStartupContext";

// Import agent profile images
const ViraAvatar = "https://i.ibb.co/TB072BQ1/Vira.png";
const BizzyAvatar = "https://i.ibb.co/xq7CpvL7/Bizzy.png";
const ArtieAvatar = "https://i.ibb.co/C5Z5b9Mb/Artie.png";
const MakAvatar = "https://i.ibb.co/W4xQfq9D/Mak.jpg";
const modules = [{
  title: "Vira",
  url: "/vira",
  avatar: ViraAvatar,
  description: "Virtual Co-Founder, helps in making business decisions",
  isDefault: true
}, {
  title: "Bizzy",
  url: "/bizzy",
  avatar: BizzyAvatar,
  description: "Business strategist, guides in growth and market expansion"
}, {
  title: "Artie",
  url: "/artie",
  avatar: ArtieAvatar,
  description: "Creative designer, assists with visuals and branding"
}, {
  title: "Mak",
  url: "/mak",
  avatar: MakAvatar,
  description: "Social media handler, automates posts and generates captions"
}];
const chatHistory = [{
  id: 1,
  title: "SaaS Platform for Remote Teams",
  timestamp: "2 hours ago"
}, {
  id: 2,
  title: "AI-Powered Content Generator",
  timestamp: "1 day ago"
}, {
  id: 3,
  title: "Sustainable Fashion Marketplace",
  timestamp: "3 days ago"
}];
export function AppSidebar() {
  const {
    state,
    isMobile
  } = useSidebar();
  const { theme } = useTheme();
  const { hasStartupData } = useStartupContext();
  const location = useLocation();
  const isCollapsed = state === "collapsed" && !isMobile; // Never collapse on mobile
  const [isModulesExpanded, setIsModulesExpanded] = useState(true);
  const [showStartupModal, setShowStartupModal] = useState(false);
  const isActive = (path: string) => location.pathname === path;
  
  // Determine which logo to show based on theme
  const logoSrc = theme === "light" 
    ? "/lovable-uploads/3661269c-226c-4091-834a-d29b93d8d54f.png"
    : "/lovable-uploads/60c9d900-181b-42b8-88fc-44cc13f5c207.png";
  
  return <Sidebar className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <NavLink to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-surface border border-border rounded-lg flex items-center justify-center shadow-sm">
            <img src={logoSrc} alt="Logo" className="w-4 h-4" />
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="text-lg font-semibold text-sidebar-foreground">Productica</h2>
              <p className="text-xs text-text-muted">AI Business Validation</p>
            </div>
          )}
        </NavLink>
      </SidebarHeader>

      <SidebarContent className="p-2">
        {/* My Startup Button - Coming Soon */}
        <div className="mb-4">
          <Button 
            variant="secondary" 
            disabled
            className="w-full justify-start gap-3 border-border transition-colors opacity-50 cursor-not-allowed bg-surface"
          >
            <Building2 className="w-4 h-4" />
            {!isCollapsed && "My Startup - Coming Soon"}
          </Button>
        </div>

        {/* AI Modules */}
        <SidebarGroup>
          <SidebarGroupLabel className={cn(
            "text-sidebar-foreground text-xs font-medium mb-2 flex items-center gap-2 cursor-pointer hover:text-sidebar-foreground transition-colors", 
            !isCollapsed && "px-2 py-1 rounded-md hover:bg-sidebar-hover"
          )} onClick={() => setIsModulesExpanded(!isModulesExpanded)}>
            {!isCollapsed && (
              <>
                {isModulesExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                AI Agents
              </>
            )}
            {isCollapsed && "Agents"}
          </SidebarGroupLabel>
          
          {(isModulesExpanded || isCollapsed) && (
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {modules.map((module) => (
                  <SidebarMenuItem key={module.title}>
                    <NavLink 
                      to={module.url} 
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group w-full",
                        "hover:bg-sidebar-hover text-sidebar-foreground border border-transparent",
                        !isCollapsed && "ml-4", // Indentation when expanded
                        isActive(module.url) && "bg-surface/50 border-border shadow-sm"
                      )}
                    >
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarImage src={module.avatar} alt={`${module.title} avatar`} />
                        <AvatarFallback className="text-xs">{module.title[0]}</AvatarFallback>
                      </Avatar>
                      {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">
                            {module.title}
                          </div>
                        </div>
                      )}
                      {!isCollapsed && <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />}
                    </NavLink>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          )}
        </SidebarGroup>

        {/* Chat History */}
        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="text-sidebar-foreground text-xs font-medium mb-2 flex items-center gap-2">
            <History className="w-3 h-3" />
            {!isCollapsed ? "Recent Chats" : "History"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {chatHistory.map(chat => <SidebarMenuItem key={chat.id}>
                  <SidebarMenuButton className="h-auto p-0">
                    <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-hover transition-colors w-full text-left">
                      <MessageSquare className="w-3 h-3 flex-shrink-0 text-sidebar-foreground" />
                      {!isCollapsed && <div className="flex-1 min-w-0">
                          <div className="text-sm text-sidebar-foreground truncate">
                            {chat.title}
                          </div>
                          <div className="text-xs text-sidebar-foreground opacity-70">
                            {chat.timestamp}
                          </div>
                        </div>}
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <StartupFormModal 
        open={showStartupModal} 
        onOpenChange={setShowStartupModal} 
      />
    </Sidebar>;
}