import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import container from "@/server/di/container";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import Image from "next/image";

function Loading() {
  return <h2>🌀 Loading...</h2>;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const user = session?.identity;
  const { t } = useTranslation("common");
  if (status === "loading") {
    return <Loading />;
  }
  return (
    <Layout breadcrumb={["Profile"]}>
      <Card className="m-20">
        <CardHeader className="-mb-4">{t("Profile")}</CardHeader>
        <CardContent className="flex flex-wrap justify-center border-t-1">
          <div className="p-5">
            <Image
              alt="avatar"
              src="https://github.com/shadcn.png"
              width={350}
              height={350}
              className="rounded-full"
            />
          </div>
          <div className="flex flex-1 flex-wrap h-min w-full min-w-100 p-5">
            <div className="w-1/2 p-1">
              <Label className="ml-4">{t("First Name")}</Label>
              <Input
                readOnly
                className="my-1"
                type="text"
                value={user?.firstname}
                placeholder="-"
              />
            </div>

            <div className="w-1/2 p-1">
              <Label className="ml-4">{t("Last Name")}</Label>
              <Input
                readOnly
                className="my-1"
                type="text"
                value={user?.lastname}
                placeholder="-"
              />
            </div>

            <div className="w-1/2 p-1">
              <Label className="ml-4">{t("Email")}</Label>
              <Input
                readOnly
                className="my-1"
                type="text"
                value={user?.email}
                placeholder="-"
              />
            </div>

            <div className="w-1/2 p-1">
              <Label className="ml-4">{t("Role")}</Label>
              <Input
                readOnly
                className="my-1"
                type="text"
                value={user?.role}
                placeholder="guest"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
}

export const getServerSideProps = container.resolve("getServerSideProps")([]);
