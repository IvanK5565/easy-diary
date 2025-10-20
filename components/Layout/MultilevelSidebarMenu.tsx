import { IMenu } from "@/client/store/types";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "../ui/collapsible";
import { useTranslation } from "next-i18next";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "../ui/sidebar";
import Link from "next/link";

export default function MultilevelSidebarMenu({ menu }: { menu: IMenu }) {
  const { t } = useTranslation("common");
  return (
    <SidebarMenu>
      {Object.entries(menu).map(([key, item]) => {
        return (
          (item.items && Object.keys(item.items).length > 0 && (
            <Collapsible key={key} defaultOpen className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton asChild>
                    <button>
                      <span>{t(item.label || key)}</span>
                    </button>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {Object.entries(item.items).map(([subKey, subItem]) => {
                      return (
                        <SidebarMenuSubItem key={subKey}>
                          <SidebarMenuButton asChild>
                            {subItem.url ? (
                              <Link href={subItem.url}>
                                <span>{t(subItem.label || subKey)}</span>
                              </Link>
                            ) : (
                              <button>
                                <span>{t(subItem.label || subKey)}</span>
                              </button>
                            )}
                          </SidebarMenuButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          )) || (
            <SidebarMenuItem key={key}>
              {item.url ? (
                <SidebarMenuButton asChild>
                  <Link href={item.url}>
                    <span>{t(item.label || key)}</span>
                  </Link>
                </SidebarMenuButton>
              ) : (
                <SidebarMenuButton asChild>
                  <button onClick={item.onClick}>
                    <span>{t(item.label || key)}</span>
                  </button>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          )
        );
      })}
    </SidebarMenu>
  );
}
