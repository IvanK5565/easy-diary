import { PropsWithChildren } from "react";
import { SidebarProvider } from "../ui/sidebar";
import TopBar from "./TopBar";
import AppSidebar from "./AppSidebar";
import { ThemeProvider } from "../theme-provider";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider defaultOpen={false}>
        <AppSidebar />
        <div className="w-screen h-screen relative">
          <TopBar />
          {children}
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}
