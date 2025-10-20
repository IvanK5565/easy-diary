import { useEntitySelector } from "@/client/hooks/useEntitySelector";
import { AppState } from "@/client/store/ReduxStore";
import DiaryDayTable from "@/components/diary/DiaryDayTable";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WeekPickerPopover from "@/components/WeekPickerPopover";
import { formatWeekRangeByDay } from "@/lib/utils";
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
    <Layout>
      <div className="p-4 flex flex-1 flex-col gap-2">
        <WeekPickerPopover onChange={(week) => setWeek(week)} />
        <h2>
          {cls?.title ?? "class"} - {student.firstname ?? "student"}
        </h2>
        <div className="flex gap-1 items-center w-full justify-center">
          <Button onClick={arrowClick(-1)}>{"<"}</Button>
          {formatWeekRangeByDay(week)}
          <Button onClick={arrowClick(1)}>{">"}</Button>
        </div>
        <div>
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
