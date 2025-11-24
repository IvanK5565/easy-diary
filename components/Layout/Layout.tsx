import { PropsWithChildren } from "react";
import { SidebarProvider } from "../ui/sidebar";
import TopBar from "./TopBar";
import { ThemeProvider } from "../theme-provider";
import { Main } from "./SidebarMirror";
import { useIsMobile } from "@/hooks/use-mobile";

type LayoutProps = {
  breadcrumb?: string[];
};

export default function Layout({
  children,
  breadcrumb,
}: PropsWithChildren<LayoutProps>) {
  const isMobile = useIsMobile();
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider defaultOpen={!isMobile}>
        {/* <AppSidebar /> */}
        <div className="w-screen h-screen flex flex-col">
          <TopBar />
          <Main breadcrumb={breadcrumb}>{children}</Main>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}
