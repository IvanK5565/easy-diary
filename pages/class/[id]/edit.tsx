import { AppState } from "@/client/store/ReduxStore";
import ClassForm from "@/components/classEdit/ClassForm";
import DiaryCalendar from "@/components/classEdit/DiaryCalendar";
import StudentsTable from "@/components/classEdit/StudentsTable";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import container from "@/server/di/container";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

// function Provider({ children }: PropsWithChildren) {
//   const { open } = useSidebar();
//   return (
//     <div
//       className={cn("flex flex-col gap-2 w-min h-min xl:m-10 xl:flex-row", {
//         "lg:flex-row": !open,
//         "lg:flex-col": open,
//       })}
//     >
//       {children}
//     </div>
//   );
// }

export default function ProfilePage() {
  const { query } = useRouter();
  const id = Number(query.id);
  const classId = query.id as string;
  const cls = useSelector(
    (state: AppState) => state.entities.classes[Number(classId)],
  );
  const { t } = useTranslation("common");

  return (
    <Layout breadcrumb={["Edit Class"]}>
      <div className="flex w-full justify-center">
        <div className="flex flex-col w-max items-center gap-2 pt-2">
          <div className="flex w-min gap-2">
            <Card className="w-full ">
              <CardHeader className="-mb-4">{t("edit-class")}</CardHeader>
              <CardContent className="flex justify-center h-full border-t-1">
                <ClassForm initialValues={cls} />
              </CardContent>
            </Card>
            <Card className="w-full ">
              <CardHeader className="-mb-4">{t("edit-schedule")}</CardHeader>
              <CardContent className="flex justify-center border-t-1">
                <DiaryCalendar id={id} />
              </CardContent>
            </Card>
          </div>
          <Card className="w-full">
            <CardHeader className="-mb-4">{t("add-students ")}</CardHeader>
            <CardContent className="flex flex-wrap justify-center border-t-1">
              <StudentsTable cls={cls} />
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps = container.resolve("getServerSideProps")([
  "ClassesController",
  "UsersController",
]);
