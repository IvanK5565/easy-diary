import { useEntitySelector } from "@/client/hooks/useEntitySelector";
import { IUser } from "@/client/store/types";
import { isSameDay } from "date-fns";
import { Table, TableBody } from "../ui/table";
import DiaryRow from "./DiaryRow";

export default function DiaryDayTable({
  day,
  student,
}: {
  day: Date;
  student: IUser;
}) {
  const schedule = Object.values(useEntitySelector("schedule"));
  const daySchedule = schedule
    .filter((sch) => isSameDay(Number(sch.day), day))
    .sort((a, b) => b.queue - a.queue);
  return (
    <Table>
      <TableBody>
        {Array.from({ length: 8 }).map((_, i) => {
          const sch = daySchedule.find((s) => s.queue === i);
          return (
            <DiaryRow
              student={student}
              key={"dayRow:" + i}
              sch={sch}
              number={i}
            />
          );
        })}
      </TableBody>
    </Table>
  );
}
