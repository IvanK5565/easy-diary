import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useTranslation } from "next-i18next";

function TopBar() {
  const { data } = useSession();
  const { t } = useTranslation("common");
  return (
    <div className="w-full bg-card flex py-2 lg:px-60 px-20 items-center">
      {/* <SidebarTrigger /> */}
      <div className="flex flex-1 justify-between">
        <Link href="/" className="text-shadow-primary-foreground text-lg">
          <span className="text-lg">Easy</span>
          <span className="text-primary text-lg">Diary</span>
        </Link>
      </div>
      <div className="flex gap-2 items-center">
        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>
              My Account No: {data?.identity.id || "null"}
            </DropdownMenuLabel>
            <DropdownMenuLabel>
              My Role: {data?.identity.role || "null"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link className="cursor-pointer" href="/profile">
                {t("Profile")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link className="cursor-pointer" href="/chat">
                {t("Contacts")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link className="cursor-pointer" href={"/api/auth/signout"}>
                {t("Exit")}
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default TopBar;
