import { formatWeekRangeByDay } from "@/lib/utils";
import { startOfWeek, isSameWeek } from "date-fns";
import { useState } from "react";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export default function WeekPickerPopover({
  label = "Select Date",
  selectedWeek,
  onChange,
}: {
  label?: string;
  selectedWeek?: Date;
  onChange?: (week: Date) => void;
}) {
  const [open, setOpen] = useState(false);
  const [hoveredDay, setHoveredDay] = useState<Date>();

  const handleDayClick = (date: Date) => {
    const weekStart = startOfWeek(date, { weekStartsOn: 1 }); // понеділок
    const alreadySelected =
      selectedWeek && isSameWeek(selectedWeek, weekStart, { weekStartsOn: 1 });
    if (!alreadySelected) {
      onChange?.(weekStart);
      setOpen(false);
    }
  };

  const modifiers = {
    selected: (date: Date) =>
      Boolean(
        selectedWeek && isSameWeek(selectedWeek, date, { weekStartsOn: 1 }),
      ),
    hovered: (date: Date) =>
      Boolean(hoveredDay && isSameWeek(date, hoveredDay, { weekStartsOn: 1 })),
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">
          {selectedWeek
            ? formatWeekRangeByDay(selectedWeek, "dd.MM.yy")
            : label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-full">
        <Calendar
          className="w-full"
          mode="single"
          showOutsideDays
          onDayClick={handleDayClick}
          onDayMouseEnter={setHoveredDay}
          modifiers={modifiers}
          modifiersClassNames={{
            selected: "bg-primary text-white rounded-lg m-1",
            hovered: "bg-muted",
          }}
          weekStartsOn={1}
          classNames={{
            chevron: "fill-primary",
            today: "text-primary",
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
