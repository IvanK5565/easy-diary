import { PropsWithChildren } from "react";
import { Button } from "./ui/button";
import Link from "next/link";

export default function CustomLinkButton({
  href,
  className,
  children,
  disabled,
}: PropsWithChildren<{
  className?: string;
  disabled?: boolean;
  href: string;
}>) {
  return (
    <Button
      className={className}
      asChild
      variant={disabled ? "outline" : "default"}
    >
      <Link href={href} className={disabled ? "pointer-events-none" : ""}>
        {children}
      </Link>
    </Button>
  );
}
