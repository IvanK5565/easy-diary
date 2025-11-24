import { useEntitySelector } from "@/client/hooks/useEntitySelector";
import { AppState } from "@/client/store/ReduxStore";
import DiaryDayTable from "@/components/diary/DiaryDayTable";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WeekPickerPopover from "@/components/WeekPickerPopover";
import container from "@/server/di/container";
import { addDays, addWeeks, format, startOfWeek } from "date-fns";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { useSelector } from "react-redux";

export default function DiaryPage() {
  const [week, setWeek] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  );
  const router = useRouter();
  const id = Number(router.query.id);

  const users = Object.values(useEntitySelector("users") ?? {});
  const student = users.find((u) => u.id === id);
  const classes = Object.values(useEntitySelector("classes") ?? {});
  const auth = useSelector((state: AppState) => state.auth?.identity);

  if (!auth) return <Layout>no access</Layout>;
  if (!student) return <Layout>no student</Layout>;
  const cls = classes.find((c) => c.studentsInClass?.includes(student.id));

  const arrowClick = useCallback(
    (diff: -1 | 1) => () => setWeek(addWeeks(week, diff)),
    [week],
  );

  return (
    <Layout breadcrumb={["Diary"]}>
      <div className="p-4 flex flex-1 flex-col gap-2">
        <h2 className="text-xl font-semibold text-center">
          {cls?.title ?? "class"} - {student.firstname ?? "student"}
        </h2>
        <div className="flex gap-1 items-center w-full justify-center">
          <Button onClick={arrowClick(-1)}>{"<"}</Button>
          <WeekPickerPopover
            selectedWeek={week}
            onChange={(week) => setWeek(week)}
          />
          <Button onClick={arrowClick(1)}>{">"}</Button>
        </div>
        <div className="flex flex-col gap-4 xl:grid xl:grid-rows-3 xl:grid-flow-col pb-4">
          {student &&
            Array.from({ length: 6 }).map((_, day) => (
              <Card key={"dayCard:" + day}>
                <CardHeader>
                  <CardTitle>{format(addDays(week, day), "EEEE dd")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <DiaryDayTable student={student} day={addDays(week, day)} />
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps = container.resolve("getServerSideProps")([]);
