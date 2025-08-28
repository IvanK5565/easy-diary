import Layout from "@/components/Layout";
import { useTranslation } from "next-i18next";

export default function NotFoundPage() {
  const { t } = useTranslation("common");
  return (
    <Layout>
      <div className="h-screen bg-background flex justify-center items-center">
        {t("notFoundPage")}
      </div>
    </Layout>
  );
}
