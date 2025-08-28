import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogClose } from "./ui/dialog";
import { isAfter, eachWeekOfInterval } from "date-fns";
import { PropsWithChildren, useState, useEffect } from "react";
import { DialogHeader, DialogFooter } from "./ui/dialog";
import WeekPickerPopover from "./WeekPickerPopover";
import { WeeksPicker } from "./WeeksPicker";
import { Button } from "./ui/button";

type SelectWeeksDialogProps = PropsWithChildren<{
  weeks?: Date[];
  onSelect?: (weeks: Date[]) => void;
  asChild?: boolean;
}>;

export default function SelectWeeksDialog({
  weeks = [],
  onSelect,
  children,
  asChild,
}: SelectWeeksDialogProps) {
  const [buffer, setWeeks] = useState<Date[]>(weeks);
  const [start, setStart] = useState<Date>();
  const [end, setEnd] = useState<Date>();

  useEffect(() => {
    if (start && end && isAfter(start, end)) {
      const temp = start;
      setStart(end);
      setEnd(temp);
    }
  }, [start, end]);

  const handleRangeSelect = () => {
    if (start && end) {
      setWeeks(eachWeekOfInterval({ start, end }, { weekStartsOn: 1 }));
      setStart(undefined);
      setEnd(undefined);
    }
  };
  const handleClear = () => {
    setWeeks([]);
    setStart(undefined);
    setEnd(undefined);
  };
  return (
    <Dialog>
      <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select weeks by clicking days</DialogTitle>
          <WeekPickerPopover selectedWeek={start} onChange={setStart} />
          <WeekPickerPopover selectedWeek={end} onChange={setEnd} />
          <Button onClick={handleRangeSelect}>Select</Button>
          <Button onClick={handleClear}>Clear</Button>
        </DialogHeader>

        <WeeksPicker selectedWeeks={buffer} onChange={setWeeks} />

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={() => onSelect?.(buffer)}>Save</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}