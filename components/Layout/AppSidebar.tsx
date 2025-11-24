import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarSeparator,
} from "../ui/sidebar";
import { IMenu, IMenuData } from "@/client/store/types";
import { useProtectedMenu } from "@/client/hooks/useProtectedMenu";
import { useTranslation } from "next-i18next";
import { Dot } from "lucide-react";
import MultilevelSidebarMenu from "./MultilevelSidebarMenu";
import { GRANT } from "@/acl/types";

const sidebarMenu: IMenu = {
  // dbSync: {
  //   label: "Sync DB",
  //   onClick() {
  //     fetch("/api/sync")
  //       .then((res) => toast.success(JSON.stringify(res)))
  //       .catch((e) => toast.error(JSON.stringify(e)));
  //   },
  // },
  // admin: {
  //   label: "admin",
  //   items: {
  //     "admin/users": {
  //       label: "users",
  //       url: "/admin/users",
  //     },
  //     "admin/classes": {
  //       label: "classes",
  //       url: "/admin/classes",
  //     },
  //     "admin/subjects": {
  //       label: "subjects",
  //       url: "/admin/subjects",
  //     },
  //   },
  // },
  // newUser: {
  //   label: "addUser",
  //   url: "/addUser",
  // },
  "Navigation/contacts": {
    label: "Contacts",
    url: "/chat",
    grant: GRANT.READ,
  },
  "Navigation/addSubject": {
    label: "Add Subject",
    url: "/addSubject",
    grant: GRANT.READ,
  },
  // users: {
  //   label: "users",
  //   url: "/users",
  // },
  "Navigation/classes": {
    label: "Classes",
    url: "/classes",
    grant: GRANT.READ,
  },
};

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
    <Sidebar collapsible="offcanvas" {...props}>
      {/* <SidebarHeader>
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
      </SidebarHeader> */}
      <SidebarContent className="py-20">
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
      {/* <SidebarFooter className="w-full flex flex-row-reverse">
      </SidebarFooter> */}
    </Sidebar>
  );
}
