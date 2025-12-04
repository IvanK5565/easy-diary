import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Popover } from "@radix-ui/react-popover";
import { PopoverContent, PopoverTrigger } from "../ui/popover";
import { useEntitySelector } from "@/client/hooks/useEntitySelector";
import { IHomework, ISchedule, ISubject } from "@/client/store/types";
import { addDays, isSameDay, isSameWeek, startOfWeek } from "date-fns";
import { useCallback } from "react";
import { useTranslation } from "next-i18next";
import { DAYS } from "@/constants";

type Props = {
  week: number;
  className?: string;
  classId?: number;
};

const MAX_QUEUES = 6;

export default function ClassDiary({ week, className }: Props) {
  const { t } = useTranslation("common");

  const weekSchedule = Object.values(useEntitySelector("schedule")).filter(
    (s) => isSameWeek(week, Number(s.day), { weekStartsOn: 1 }),
  );
  const weekStart = startOfWeek(week, { weekStartsOn: 1 });
  const subjects = Object.values(useEntitySelector("subjects"));
  const homeworks = Object.values(useEntitySelector("homeworks"));

  const getSchedule = useCallback(
    (day: number | Date, queue: number): ISchedule | null => {
      const item = weekSchedule.find(
        (s) => isSameDay(Number(s.day), Number(day)) && s.queue === queue,
      );
      return item || null;
    },
    [],
  );

  const getSubject = useCallback((sch: ISchedule): ISubject | null => {
    return (sch && subjects.find((subj) => subj.id === sch.subjectId)) || null;
  }, []);

  const getHomeworks = useCallback((sch: ISchedule): IHomework[] => {
    return sch && homeworks.filter((h) => h.scheduleId === sch.id);
  }, []);

  return (
    <div className={className}>
      <Card className="p-4 rounded-2xl shadow-md overflow-x-auto">
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {Array.from({ length: 6 }, (_, day) => {
            return (
              <div key={day} className="w-full p-5 shadow rounded-lg">
                <Table>
                  <TableHeader>
                    <h2 className="text-xl font-semibold mb-4">
                      {DAYS[day + 1]}
                    </h2>
                    <TableRow>
                      <TableHead className="w-12 text-center">#</TableHead>
                      <TableHead className="w-20">
                        {t("subjectLabel")}
                      </TableHead>
                      <TableHead className="">{t("homeworkLabel")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: MAX_QUEUES }, (_, queue) => {
                      const schedule = getSchedule(
                        addDays(weekStart, day),
                        queue,
                      );
                      const subject = schedule && getSubject(schedule);
                      const homeworksBySchedule =
                        schedule && getHomeworks(schedule);
                      return (
                        <TableRow key={queue}>
                          <TableCell className="w-12 text-center font-semibold">
                            {queue + 1}
                          </TableCell>
                          <TableCell className="w-20">
                            {subject?.title || "-"}
                          </TableCell>
                          <TableCell className="">
                            {(homeworksBySchedule &&
                              homeworksBySchedule.length > 0 && (
                                <Popover>
                                  <PopoverTrigger>
                                    <Badge>
                                      {homeworksBySchedule[0].title}
                                    </Badge>
                                  </PopoverTrigger>
                                  <PopoverContent>
                                    {homeworksBySchedule.map((h) => (
                                      <Badge key={"homework:" + h.id}>
                                        {h.title}
                                      </Badge>
                                    ))}
                                  </PopoverContent>
                                </Popover>
                              )) ||
                              "-"}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
