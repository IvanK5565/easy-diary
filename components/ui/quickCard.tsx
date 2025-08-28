import { FC, PropsWithChildren } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";

export default function QuickCard({
  children,
  title,
}: PropsWithChildren<{ title: string | FC }>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{typeof title === "string" ? title : <title />}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
