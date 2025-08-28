import { useActions } from "@/client/hooks";
import { useEntitySelector } from "@/client/hooks/useEntitySelector";
import { AppState } from "@/client/store/ReduxStore";
import { IMark, ISchedule, IUser } from "@/client/store/types";
import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import BadgeWithPopover from "@/components/ui/BadgeWithPopover";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import WeekPickerPopover from "@/components/WeekPickerPopover";
import { MarkType } from "@/constants";
import { formatWeekRangeByDay } from "@/lib/utils";
import container from "@/server/di/container";
import {
  addDays,
  addWeeks,
  format,
  isSameDay,
  isSameWeek,
  startOfWeek,
} from "date-fns";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { SquarePlus } from "lucide-react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import * as Yup from 'yup';

function DiaryRow({
  sch,
  number,
  student,
}: {
  sch: ISchedule | undefined;
  student: IUser;
  number: number;
}) {
  const subjects = Object.values(useEntitySelector("subjects") ?? {});
  const marks = Object.values(useEntitySelector("marks") ?? {});
  const homeworks = Object.values(useEntitySelector("homeworks") ?? {});
  const { t } = useTranslation("common");
  const {saveMark} = useActions('MarkEntity');

  const renderMark = (mark: IMark) => {
    const label = t(mark.type);

    return (
      <Badge variant="secondary" className="text-xs mr-1">
        {label}: {mark.value}
      </Badge>
    );
  };

  const subject = sch
    ? (subjects.find((s) => s.id === sch.subjectId)?.title ?? "not-found")
    : "-";
  const homework = sch ? homeworks.filter((h) => h.scheduleId === sch.id) : [];
  const mark = marks.find((m) => m.scheduleId === sch?.id);
  return (
    <TableRow>
      <TableCell className="w-1/8">{number + 1}</TableCell>
      <TableCell className="w-1/4">{subject}</TableCell>
      <TableCell>
        <BadgeWithPopover data={homework.map((h) => h.title)} placeholder="-" />
      </TableCell>
      <TableCell className="w-1/8">
        {mark && renderMark(mark)}
        <Dialog>
          <DialogTrigger asChild>
            <button disabled={!Boolean(sch)} className="hover:bg-input rounded-sm -m-2 p-2">
              <SquarePlus className={!Boolean(sch) ? `text-accent` : undefined} />
            </button>
          </DialogTrigger>
          <DialogContent>
            <Formik<Pick<IMark, 'type'|'value'>>
              initialValues={{
                type: MarkType.IN_CLASS,
                value: 0,
              }}
              onSubmit={(values) => {
                if(sch) {
                  saveMark({
                    ...values,
                    scheduleId: sch.id,
                    studentId: student.id,
                  })
                }
              }}
              validationSchema={Yup.object().shape({
                type: Yup.string().oneOf(Object.values(MarkType)).required('Required'),
                value: Yup.number().max(100).min(0).required('Required'),
              })}
            >
              <Form className="flex flex-col gap-2 p-4">
                <Field name="markValue" />
                <ErrorMessage name="markValue"/>

                <Button type="submit">Save</Button>
              </Form>
            </Formik>
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
}

function DiaryDayTable({ day, student }: { day: Date
  student: IUser; }) {
  const schedule = Object.values(useEntitySelector("schedule"));
  const daySchedule = schedule
    .filter((sch) => isSameDay(Number(sch.day), day))
    .sort((a, b) => b.queue - a.queue);
  return (
    <Table>
      <TableBody>
        {Array.from({ length: 8 }).map((_, i) => {
          const sch = daySchedule.find((s) => s.queue === i);
          return <DiaryRow student={student} key={"dayRow:" + i} sch={sch} number={i} />;
        })}
      </TableBody>
    </Table>
  );
}

export default function DiaryPage() {
  const [week, setWeek] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  );
  const router = useRouter();
  const id = Number(router.query.id);

  const weekSchedule = Object.values(useEntitySelector("schedule")).filter(
    (s) => isSameWeek(week, Number(s.day), { weekStartsOn: 1 }),
  );

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
      <div className="p-4 flex flex-col gap-2">
        <WeekPickerPopover onChange={(week) => setWeek(week)} />
        <h2>
          {cls?.title ?? "class"} - {student.firstname ?? "student"}
        </h2>
        <div className="flex gap-1 items-center w-full justify-center">
          <Button onClick={arrowClick(-1)}>{"<"}</Button>
          {formatWeekRangeByDay(week)}
          <Button onClick={arrowClick(1)}>{">"}</Button>
        </div>
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
    </Layout>
  );
}

export const getServerSideProps = container.resolve("getServerSideProps")([]);
