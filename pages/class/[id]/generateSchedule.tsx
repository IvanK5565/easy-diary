/* eslint-disable @typescript-eslint/no-unused-vars */
import { PropsWithChildren, useCallback, useMemo, useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
// import SelectWeeksDialog from "@/components/SelectWeeksDialog";
import NewScheduleTable from "@/components/NewScheduleTable";
import { useRouter } from "next/router";
import container from "@/server/di/container";
import { ISubject } from "@/client/store/types";
import { useActions } from "@/client/hooks";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
// import WeekPickerPopover from "@/components/WeekPickerPopover";
import DaysPicker from "@/components/WeeksPicker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";

type SelectWeeksDialogProps = PropsWithChildren<{
  days?: Date[];
  onSelect?: (weeks: Date[]) => void;
  asChild?: boolean;
}>;

export function SelectWeeksDialog({
  days = [],
  onSelect,
}: SelectWeeksDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Select Week</Button>
      </DialogTrigger>
      <DialogContent className="w-min">
        <DialogHeader>Select weeks by clicking days</DialogHeader>
        <DaysPicker
          select="multiple"
          className="h-full"
          selectedDays={days}
          onChange={onSelect}
          mode="week"
        />
      </DialogContent>
    </Dialog>
  );
}

export default function AddSchedule() {
  const [days, setWeeks] = useState<Date[]>([]);
  const [sch, setSch] = useState<ISubject[][]>([]);
  const [title, setTitle] = useState<string>("");
  const classId = useRouter().query.id as string;

  const isReady = useMemo(() => {
    return days.length > 0 && Boolean(classId) && title.length > 0;
  }, [classId, title, days.length]);
  const { generate: save } = useActions("ScheduleEntity");
  return (
    <Layout>
      <div className="p-4">
        <h2 className="text-lg mb-4">Select weeks by clicking days</h2>
        <pre>class: {classId}</pre>
        <SelectWeeksDialog days={days} onSelect={setWeeks} />
        {days.length > 0 && <NewScheduleTable onChange={setSch} />}
        <Label htmlFor="scheduleTitle">Title</Label>
        <Input
          type="text"
          name="scheduleTitle"
          id="scheduleTitle"
          onChange={(e) => setTitle(e.target.value)}
        />
        <Button
          disabled={!isReady}
          onClick={() => save({ days, sch, classId: parseInt(classId), title })}
        >
          Save
        </Button>
        <div className="mt-4 text-muted-foreground">
          Selected days:
          <ul className="list-disc pl-4">
            {days.map((date, i) => (
              <li key={i}>{date.toDateString()}</li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps = container.resolve("getServerSideProps")([
  "ClassesController",
  "SubjectsController",
]);
