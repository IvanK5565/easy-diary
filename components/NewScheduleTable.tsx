import { ISubject } from "@/client/store/types";
import { useState, useCallback } from "react";
import SubjectSelect from "./SubjectSelect";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { TableBody, TableRow, TableCell, Table } from "./ui/table";
import "react-day-picker/dist/style.css";
import { dayNames } from "@/client/constants";

type NewScheduleTableProps = {
  onChange?: (sch: ISubject[][]) => void;
};
export default function NewScheduleTable({ onChange }: NewScheduleTableProps) {
  const [schedule, setSch] = useState<ISubject[][]>([]);

  const set = useCallback(
    (x: number, y: number, value: ISubject) => {
      if (!schedule[x]) {
        schedule[x] = [];
      }
      schedule[x][y] = value;
      setSch([...schedule]);
      onChange?.(schedule);
    },
    [schedule, onChange],
  );

  const unset = useCallback(
    (x: number, y: number) => {
      if (schedule[x] && schedule[x][y]) {
        delete schedule[x][y];
      }
      for (let i = 0; i < schedule.length; i += 1) {
        if (schedule[i] && schedule[i].every((s) => !Boolean(s))) {
          delete schedule[i];
        }
      }
      if (schedule.every((s) => !Boolean(s))) {
        setSch([]);
        onChange?.(schedule);
        return;
      }
      setSch([...schedule]);
      onChange?.(schedule);
    },
    [onChange, schedule],
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, day) => {
          return (
            <Card key={day}>
              <CardHeader>
                <CardTitle>{dayNames[day]}</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    {Array.from({ length: 8 }).map((_, queue) => {
                      return (
                        <TableRow
                          key={"Queue:" + queue}
                          className="flex justify-between"
                        >
                          <TableCell className="w-4">{queue + 1}</TableCell>
                          <TableCell className="w-full flex items-center justify-end">
                            <SubjectSelect
                              OnSelect={(sub) => {
                                if (sub) {
                                  set(day, queue, sub);
                                } else {
                                  unset(day, queue);
                                }
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          );
        })}
        {(schedule.length > 0 &&
          schedule.map((s, i) => (
            <pre key={i}>{JSON.stringify(s, null, 2)}</pre>
          ))) ||
          "[]"}
      </div>
    </div>
  );
}
