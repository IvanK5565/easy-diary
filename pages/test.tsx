import Layout from "@/components/Layout";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { useCallback, useEffect, useState } from "react";
import {
  classesTest,
  homeworksTest,
  marksTest,
  scheduleTest,
  subjectsTest,
  usersTest,
} from "@/client/testData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  IClass,
  ISchedule,
  ISubject,
} from "@/components/types";
import QuickCard from "@/components/ui/quickCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { uniq } from "lodash";

export default function TestPage() {
  const classes = classesTest;
  return (
    <Layout>
      <div className="flex flex-col gap-2">
        <Card>
          <CardHeader>
            <CardTitle>DiaryViewer</CardTitle>
          </CardHeader>
          <CardContent>
            <DiaryViewer id={4} />
          </CardContent>
        </Card>
        <QuickCard title={"DiaryCreator"}>
          <DiaryCreator id={4} week={1} cls={classes[0]} />
        </QuickCard>
      </div>
    </Layout>
  );
}

function DiaryRow({
  sch,
  number,
}: {
  sch: ISchedule | undefined;
  number: number;
}) {
  const subjects = subjectsTest;
  const marks = marksTest;
  const homeworks = homeworksTest;

  const subject = sch
    ? (subjects.find((s) => s.id === sch.subjectId)?.title ?? "not-found")
    : "-";
  const homework = sch ? homeworks.filter((h) => h.scheduleId === sch.id) : [];
  const mark = marks.find((m) => m.scheduleId === sch?.id)?.value;
  return (
    <TableRow>
      <TableCell className="w-1/8">{number + 1}</TableCell>
      <TableCell className="w-1/4">{subject}</TableCell>
      <TableCell>
        <BadgeWithPopover data={homework.map((h) => h.title)} />
      </TableCell>
      <TableCell className="w-1/8">{mark}</TableCell>
    </TableRow>
  );
}

function DiaryViewer({ id }: { id: number }) {
  const [week, setWeek] = useState(1);
  const student = usersTest.find((u) => u.id === id && u.role === "student");

  const cls = classesTest.find((c) => c.id === student?.id);
  const days = [1, 2, 3, 4, 5, 6];
  const schedule = scheduleTest;
  const weekSchedule = schedule.filter((sch) => sch.week === week);
  const lastWeek = Math.max(...schedule.map((sch) => sch.week));
  const arrowClick = useCallback(
    (diff: -1 | 1) => () => setWeek(week + diff),
    [week],
  );

  return (
    <div className="p-4 flex flex-col gap-2">
      <h2>
        {cls?.name ?? "class"} - {student?.firstName ?? "student"}
      </h2>
      <div className="flex gap-1 items-center w-full justify-center">
        <Button disabled={week <= 1} onClick={arrowClick(-1)}>
          {"<"}
        </Button>
        {`Week - ${week}`}
        <Button disabled={week >= lastWeek} onClick={arrowClick(1)}>
          {">"}
        </Button>
      </div>
      {student && days && days.length > 0 && (
        <div className="flex flex-col gap-2 lg:grid lg:grid-cols-3">
          {days.map((day) => {
            const daySchedule = weekSchedule
              .filter((sch) => sch.day === day)
              .sort((a, b) => b.queue - a.queue);
            return (
              <Card key={"dayCard:" + day}>
                <CardHeader>
                  <CardTitle>Day: {day}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableBody>
                      {Array.from({ length: 8 }).map((_, i) => {
                        const sch = daySchedule.find((s) => s.queue === i + 1);
                        return (
                          <DiaryRow key={"dayRow:" + i} sch={sch} number={i} />
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function BadgeWithPopover({ data }: { data: string | string[] }) {
  if (!data || data.length === 0) {
    return "-";
  }
  if (!Array.isArray(data) || data.length < 2) {
    return (
      <Badge>
        <Label>{data}</Label>
      </Badge>
    );
  }
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Badge>
          <Label>{data[0]}</Label>
        </Badge>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-1">
        {data.map((d, i) => (
          <Badge key={`Badge:${i}`}>
            <Label>{d}</Label>
          </Badge>
        ))}
      </PopoverContent>
    </Popover>
  );
}

function DiaryCreatorRow({
  index,
  value,
}: {
  index: number;
  value?: ISubject;
}) {
  const [val, setValue] = useState<ISubject | null>(null);
  const subjects = subjectsTest;

  useEffect(() => {
    if (value) setValue(value);
  }, [value]);

  const onSelect = useCallback(
    (id: string) => {
      const sub = subjects.find((s) => s.id === Number(id));
      setValue(sub ?? null);
    },
    [subjects],
  );

  return (
    <TableRow>
      <TableCell className="w-1/8">{index + 1}</TableCell>
      <TableCell className="w-1/4">
        <Select onValueChange={onSelect}>
          <SelectTrigger>{val ? val.title : "Select the value"}</SelectTrigger>
          <SelectContent>
            {subjects.map((subject) => (
              <SelectItem
                key={subject.id.toString()}
                value={subject.id.toString()}
              >
                {subject.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell className="w-1/8">
        <Button onClick={() => setValue(null)}>Reset</Button>
      </TableCell>
    </TableRow>
  );
}

function QuickSelect({
  value = null,
  values = [],
  onSelect,
}: {
  value: string | null;
  values: string[];
  onSelect?: (val: string) => void;
}) {
  const onSelectCallback = useCallback(
    (val: string) => {
      onSelect?.(val);
    },
    [onSelect],
  );
  return (
    <Select onValueChange={onSelectCallback}>
      <SelectTrigger>{value ?? "Select the value"}</SelectTrigger>
      <SelectContent>
        {values.map((val) => (
          <SelectItem key={val} value={val}>
            {val}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// function SelectTemplate({
//   onValueChange,
// }: {
//   onValueChange?: (val: IScheduleTemplate[]) => void;
// }) {
//   const [value, setValue] = useState<string | null>(null);

//   const templates = templatesTest;

//   const values = uniq(templates.map((t) => t.name));

//   const onSelect = useCallback(
//     (val: string) => {
//       setValue(val);
//       onValueChange?.(templates.filter((t) => t.name === val));
//     },
//     [onValueChange, templates],
//   );
//   return <QuickSelect {...{ value, values, onSelect }} />;
// }

// function DiaryCreator({
//   id,
//   week,
//   cls,
// }: {
//   id: number;
//   week: number;
//   cls: IClass;
// }) {
//   const [templates, setTemplates] = useState<IScheduleTemplate[]>([]);
//   const student = usersTest.find((u) => u.id === id && u.role === "student");

//   const days = [1, 2, 3, 4, 5, 6];
//   const subjects = subjectsTest;

//   const onSelectTemplate = useCallback((tsses: IScheduleTemplate[]) => {
//     setTemplates(tsses);
//   }, []);

//   return (
//     <div className="p-4 flex flex-col gap-2">
//       <h2>{cls?.name ?? "class"}</h2>
//       <div className="grid grid-cols-3 w-full">
//         <div className="flex">
//           <Button>reset</Button>
//         </div>
//         <div className="flex gap-1 items-center w-full justify-center">
//           {`Week - ${week}`}
//         </div>
//         <div className="flex flex-row-reverse">
//           <SelectTemplate onValueChange={onSelectTemplate} />
//         </div>
//       </div>
//       {student && days && days.length > 0 && (
//         <div className="flex flex-col gap-2 lg:grid lg:grid-cols-3">
//           {days.map((day) => {
//             return (
//               <Card key={"dayCard:" + day}>
//                 <CardHeader>
//                   <CardTitle>Day: {day}</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <Table>
//                     <TableBody>
//                       {Array.from({ length: 8 }).map((_, i) => {
//                         const template = templates.find(
//                           (t) => t.day === day && t.queue === i + 1,
//                         );
//                         const value =
//                           template &&
//                           subjects.find((s) => s.id === template.subjectId);
//                         return (
//                           <DiaryCreatorRow
//                             key={"dayRow:" + i}
//                             index={i}
//                             value={value}
//                           />
//                         );
//                       })}
//                     </TableBody>
//                   </Table>
//                 </CardContent>
//               </Card>
//             );
//           })}
//         </div>
//       )}
//       <Button>Save</Button>
//     </div>
//   );
// }
