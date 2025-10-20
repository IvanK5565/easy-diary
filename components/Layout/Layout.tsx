import { PropsWithChildren } from "react";
import { SidebarProvider } from "../ui/sidebar";
import TopBar from "./TopBar";
import AppSidebar from "./AppSidebar";
import { ThemeProvider } from "../theme-provider";
import { SidebarMirror } from "./SidebarMirror";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Layout({ children }: PropsWithChildren) {
  const isMobile = useIsMobile();
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider defaultOpen={!isMobile}>
        <AppSidebar />
        <div className="w-screen h-screen flex flex-col">
          <TopBar />
          <SidebarMirror>{children}</SidebarMirror>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}
