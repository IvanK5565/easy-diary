import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { IClass, ISubject } from "../client/store/types";
import { addDays, isSameDay, isSameWeek, startOfWeek } from "date-fns";
import { useEntitySelector } from "@/client/hooks/useEntitySelector";
import { useTranslation } from "next-i18next";
import { formatWeekRangeByDay } from "@/lib/utils";

type Props = {
  week: number;
  className?: string;
  cls?: IClass | null;
};

const DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
const MAX_QUEUES = 6;

const ClassDiaryViewer: React.FC<Props> = ({ week, className }) => {
  const weekSchedule = Object.values(useEntitySelector("schedule")).filter(
    (s) => isSameWeek(week, Number(s.day), { weekStartsOn: 1 }),
  );
  const weekStart = startOfWeek(week, { weekStartsOn: 1 });
  const subjects = Object.values(useEntitySelector("subjects"));
  const { t } = useTranslation("common");

  const getSubject = (day: number | Date, queue: number): ISubject | null => {
    const item = weekSchedule.find(
      (s) => isSameDay(Number(s.day), Number(day)) && s.queue === queue,
    );
    return (
      (item && subjects.find((subj) => subj.id === item.subjectId)) || null
    );
  };

  return (
    <div className={className}>
      <Card className="p-4 rounded-2xl shadow-md overflow-x-auto">
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">
            {t("scheduleWeekLabel")}{" "}
            {formatWeekRangeByDay(new Date(week), "dd.MM.yy")}
          </h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 text-center">#</TableHead>
                {DAYS.map((day, idx) => (
                  <TableHead key={idx} className="text-center">
                    {day}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: MAX_QUEUES }, (_, queue) => (
                <TableRow key={queue}>
                  <TableCell className="text-center font-semibold">
                    {queue + 1}
                  </TableCell>
                  {Array.from({ length: 6 }, (_, day) => {
                    const subject = getSubject(addDays(weekStart, day), queue);
                    return (
                      <TableCell key={day} className="text-center">
                        {subject?.title || "-"}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClassDiaryViewer;
