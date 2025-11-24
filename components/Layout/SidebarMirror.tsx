import { PropsWithChildren } from "react";
import LayoutBreadcrumb from "./LayoutBreadcrumb";

type LayoutMainProps = {
  breadcrumb?: string[];
};

export function Main({
  children,
  breadcrumb,
}: PropsWithChildren<LayoutMainProps>) {
  // const { open } = useSidebar();
  const open = true;
  return (
    <div className="flex flex-row justify-between w-full h-full">
      <div
        className="hidden lg:flex transition-[width] duration-200 ease-linear"
        style={{ width: open ? "16rem" : "0rem" }}
      />
      <div className="w-full flex flex-col">
        <LayoutBreadcrumb items={breadcrumb} />
        <div className="w-full flex">{children}</div>
      </div>
      <div
        className="hidden lg:flex transition-[width] duration-200 ease-linear"
        style={{ width: open ? "16rem" : "0rem" }}
      />
    </div>
  );
}
