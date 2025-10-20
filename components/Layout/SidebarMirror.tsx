import { PropsWithChildren } from "react";
import { useSidebar } from "../ui/sidebar";

export function SidebarMirror({ children }: PropsWithChildren) {
  const { open } = useSidebar();
  return (
    <div className="flex flex-row justify-between flex-1 w-full h-full">
      <div className="flex-1 flex">{children}</div>
      <div
        className="hidden lg:flex transition-[width] duration-200 ease-linear bg-accent"
        style={{ width: open ? "16rem" : "0rem" }}
      />
    </div>
  );
}
