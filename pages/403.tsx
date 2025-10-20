import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Page() {
  const { status } = useSession();
  const { push } = useRouter();
  useEffect(() => {
    if (status === "authenticated") {
      push("/");
    }
  }, [status, push]);
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-background">
      <Button disabled={status === "loading"} onClick={() => signIn()}>
        SignIn
      </Button>
    </div>
  );
}
