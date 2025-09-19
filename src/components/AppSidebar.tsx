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
const ViraAvatar = "https://cdn.discordapp.com/attachments/1376501731860680724/1418165664937676810/Vira_DP.png?ex=68ce72b2&is=68cd2132&hm=ef8fca36e342d9dd9476d05425a17fcfe1af1b6b7bb71913bb0b526a31ad288a&";
const BizzyAvatar = "https://cdn.discordapp.com/attachments/1376501731860680724/1418165664492949624/Chanak_DP.png?ex=68ce72b2&is=68cd2132&hm=feda67e5f70734afff73202bf65d8ab40708c2d3dd04db2682caa1a8765c15da&";
const ArtieAvatar = "https://cdn.discordapp.com/attachments/1376501731860680724/1418165663834312755/Chitra_DP.png?ex=68ce72b2&is=68cd2132&hm=88b5c136d98cb88441080206c7ef27b67311e91c3e2ce0e8a1e6b73743e586d0&";
const MakAvatar = "https://cdn.discordapp.com/attachments/1376501731860680724/1418672918648328223/suzzy2.png?ex=68cef99d&is=68cda81d&hm=8e3811e6c2449022c39928610702bc4f04bb258ccf932d27d9d56b8aea490b48";
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
        {/* My Startup Button */}
        <div className="mb-4">
          <Button 
            variant="secondary" 
            onClick={() => setShowStartupModal(true)}
            className={cn(
              "w-full justify-start gap-3 border-border transition-colors",
              hasStartupData() 
                ? "bg-primary/10 hover:bg-primary/20 border-primary/30 text-primary" 
                : "bg-surface hover:bg-surface-hover"
            )}
          >
            <Building2 className="w-4 h-4" />
            {!isCollapsed && (hasStartupData() ? "My Startup ✓" : "My Startup")}
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