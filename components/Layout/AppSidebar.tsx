import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarSeparator,
  SidebarTrigger,
} from "../ui/sidebar";
import { IMenu, IMenuData } from "@/client/store/types";
import { toast } from "react-toastify";
import { useProtectedMenu } from "@/client/hooks/useProtectedMenu";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Dot, Hash } from "lucide-react";

const sidebarMenu: IMenu = {
  dbSync: {
    label: "Sync DB",
    onClick() {
      fetch("/api/sync")
        .then((res) => toast.success(JSON.stringify(res)))
        .catch((e) => toast.error(JSON.stringify(e)));
    },
  },
  main: {
    label: "main",
    url: "/",
  },
  admin: {
    label: "admin",
    items: {
      "admin/users": {
        label: "users",
        url: "/admin/users",
      },
      "admin/classes": {
        label: "classes",
        url: "/admin/classes",
      },
    },
  },
  newUser: {
    label: "addUser",
    url: "/addUser",
  },
  "users/1": {
    label: "users/1",
    url: "/users/1",
  },
  "diary/1": {
    label: "diary/1",
    url: "/diary/1",
  },
  users: {
    label: "users",
    url: "/users",
  },
  contacts: {
    label: "contacts",
    url: "/contacts",
  },
  classes: {
    label: "classes",
    url: "/classes",
  },
  "class/1/schedule": {
    label: "class/1/schedule",
    url: "/class/1/schedule",
  },
  test: {
    label: "test",
    url: "/test",
  },
  newScheduleTemplate: {
    label: "newScheduleTemplate",
    url: "/newScheduleTemplate",
  },
  addSchedule: {
    label: "addSchedule",
    url: "/addSchedule/1",
  },
  addSubject: {
    label: "addSubject",
    url: "/addSubject",
  },
};

function MultilevelSidebarMenu({ menu }: { menu: IMenu }) {
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
                      <Hash />
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
                                <Dot />
                                <span>{t(subItem.label || subKey)}</span>
                              </Link>
                            ) : (
                              <button>
                                <Dot />
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
                    <Hash />
                    <span>{t(item.label || key)}</span>
                  </Link>
                </SidebarMenuButton>
              ) : (
                <SidebarMenuButton asChild>
                  <button onClick={item.onClick}>
                    <Hash />
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

interface ILayoutSidebarProps {
  menu?: IMenu;
  onMenuItemClick?: (item: IMenuData) => boolean;
}

export default function AppSidebar({
  menu = sidebarMenu,
  ...props
}: ILayoutSidebarProps) {
  const protectedMenu = useProtectedMenu(menu);
  const [grouped, ungrouped]: [{ [group: string]: IMenu }, IMenu] = [{}, {}];
  const { t } = useTranslation("common");

  Object.entries(protectedMenu).forEach(([key, item]) => {
    if (item.group) {
      if (!grouped[item.group]) grouped[item.group] = {};
      grouped[item.group][key] = item;
    } else {
      ungrouped[key] = item;
    }
  });

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu className="flex flex-row">
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="h-10 flex items-center">
              <Link href="/" className="text-shadow-primary-foreground text-lg">
                <span className="text-lg">Easy</span>
                <span className="text-primary text-lg">Diary</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {Object.entries(grouped).map(([key, item], i) => (
          <div key={`group-${key}`}>
            {i !== 0 && (
              <SidebarSeparator className="data-[orientation=horizontal]:w-auto" />
            )}
            <SidebarGroup>
              <SidebarGroupLabel>
                <Dot />
                <span>{t(key)}</span>
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <MultilevelSidebarMenu menu={item} />
              </SidebarGroupContent>
            </SidebarGroup>
          </div>
        ))}
        {Object.keys(ungrouped).length > 0 && (
          <>
            {Object.keys(grouped).length > 0 && (
              <SidebarSeparator className="data-[orientation=horizontal]:w-auto" />
            )}
            <SidebarGroup>
              <SidebarGroupContent>
                <MultilevelSidebarMenu menu={ungrouped} />
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>
      <SidebarFooter className="w-full flex flex-row-reverse">
        <SidebarTrigger />
      </SidebarFooter>
    </Sidebar>
  );
}
