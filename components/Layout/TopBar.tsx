import { SidebarTrigger } from "../ui/sidebar";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";

function TopBar() {
  const {data} = useSession();
  return (
    <div className="w-full bg-card flex">
      <SidebarTrigger />
      <div className="flex w-full justify-between">
        <Button>Some</Button>
      </div>
      <div className="flex gap-2 items-center">
        <Link href={'/api/auth/signout'}>exit</Link>
        {data ? data.identity?.id ?? 'no id' : <Link href={'/api/auth/signin'}>no user</Link>}
      </div>
    </div>
  );
}

export default TopBar;
