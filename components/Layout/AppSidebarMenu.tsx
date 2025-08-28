import { IMenu } from "@/client/store/types";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { useTranslation } from "next-i18next";
import Link from "next/link";

export default function AppSidebarMenu({ menu }: { menu: IMenu }) {
  const { t } = useTranslation('common');
  return (
    <SidebarMenu>
      {Object.entries(menu).map(([key, item]) => (
        <SidebarMenuItem key={key}>
          {(item.url && (
            <SidebarMenuButton asChild>
              <Link href={item.url ?? ""}>{t(item.label)}</Link>
            </SidebarMenuButton>
          )) || (
            <SidebarMenuButton onClick={item.onClick}>
              {t(item.label)}
            </SidebarMenuButton>
          )}
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
