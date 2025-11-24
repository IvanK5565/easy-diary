import { useEntitySelector } from "@/client/hooks/useEntitySelector";
import { format, isSameDay } from "date-fns";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "./ui/card";
import { Table, TableBody, TableRow, TableCell } from "./ui/table";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useTranslation } from "next-i18next";
import SubjectSelect from "./SubjectSelect";
import { useActions } from "@/client/hooks";
import AddHomeworkDialog from "./addHomeworkDialog";
import BadgeWithPopover from "./ui/BadgeWithPopover";

export default function ScheduleDayView({
  date,
  classId,
}: {
  date: Date;
  classId: number;
}) {
  const [isEdit, setEdit] = useState(false);
  const { t } = useTranslation("common");
  const schedule = Object.values(useEntitySelector("schedule")).filter((s) =>
    isSameDay(date, new Date(Number(s.day))),
  );
  const subjetcs = useEntitySelector("subjects");
  const homeworks = Object.values(useEntitySelector("homeworks"));
  const { save } = useActions("ScheduleEntity");
  useEffect(() => {
    console.log(date);
  }, [date]);
  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle>{format(date, "dd.MM")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            {Array.from({ length: 8 }).map((_, queue) => {
              const sch = schedule.find((s) => s.queue === queue);
              const hw = homeworks.filter((h) => h.scheduleId === sch?.id);
              return (
                <TableRow
                  key={"Queue:" + queue}
                  className="flex justify-between"
                >
                  <TableCell className="w-max px-2 flex items-center border-r-1">
                    {queue + 1}
                  </TableCell>
                  <TableCell className="w-full flex items-center">
                    {isEdit ? (
                      <SubjectSelect
                        valueId={sch?.subjectId}
                        OnSelect={(sub) => {
                          save({
                            ...(sch || {
                              classId,
                              day: date.getTime(),
                              queue,
                              title: "",
                            }),
                            subjectId: sub?.id || null,
                          });
                        }}
                      />
                    ) : sch ? (
                      subjetcs[sch.subjectId]?.title
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell className="w-max px-2 flex items-center border-r-1">
                    <BadgeWithPopover
                      data={hw.map((h) => h.title)}
                      placeholder={"-"}
                    />
                  </TableCell>
                  <TableCell>
                    {(sch && (
                      <AddHomeworkDialog sch={sch}>
                        <Button>{t("addHomework")}</Button>
                      </AddHomeworkDialog>
                    )) || <Button disabled>{t("addHomework")}</Button>}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <Button onClick={() => setEdit(!isEdit)}>{t("edit")}</Button>
      </CardFooter>
    </Card>
  );
}
