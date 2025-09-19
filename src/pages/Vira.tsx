import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { TopBar } from "@/components/TopBar";
import { ChatInterface } from "@/components/ChatInterface";
import { HelpButton } from "@/components/HelpButton";
import { QuickActionButton } from "@/components/QuickActionButton";

const Vira = () => {
  return (
    <SidebarProvider defaultOpen={true} className="min-h-screen">
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <TopBar />
          <main className="flex-1 overflow-hidden border-l border-border">
            <ChatInterface />
          </main>
        </div>
        
        <HelpButton />
        <QuickActionButton />
      </div>
    </SidebarProvider>
  );
};

export default Vira;