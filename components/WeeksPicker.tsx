import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  isSameDay,
  isSameWeek,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { useCallback, useState } from "react";
import { Calendar } from "./ui/calendar";
import { concat, differenceWith, sortBy } from "lodash";
import { Button } from "./ui/button";

type DaysPickerProps = {
  selectedDays: Date[];
  onChange?: (days: Date[]) => void;
  className?: string;
  select?: "single" | "multiple";
  mode?: "day" | "week";
};

function eachDayOfWeek(day: Date) {
  return eachDayOfInterval({
    start: startOfWeek(day, { weekStartsOn: 1 }),
    end: endOfWeek(day, { weekStartsOn: 1 }),
  });
}

export default function DaysPicker({
  selectedDays,
  onChange,
  className,
  select = "multiple",
  mode = "day",
}: DaysPickerProps) {
  const [hoveredDay, setHoveredDay] = useState<Date>();
  const [currMonth, setMonth] = useState<Date>(new Date());

  const isSame = (d1: Date, d2: Date) =>
    mode === "day"
      ? isSameDay(d1, d2)
      : isSameWeek(d1, d2, { weekStartsOn: 1 });

  const handleDayClick = (date: Date) => {
    const alreadySelected = selectedDays.some((d) => isSame(date, d));
    const range: Date[] =
      mode === "week" && !alreadySelected ? eachDayOfWeek(date) : [date];

    if (select === "single" && !alreadySelected) {
      onChange?.(range);
    } else if (select === "single") {
      onChange?.([]);
    } else if (select === "multiple" && alreadySelected) {
      onChange?.(selectedDays.filter((d) => !isSame(date, d)));
    } else if (select === "multiple") {
      onChange?.(sortBy([...selectedDays, ...range], (d) => d.getTime()));
    }
  };

  const onMonthClick = useCallback(() => {
    const days = eachDayOfInterval({
      start: startOfMonth(currMonth),
      end: endOfMonth(currMonth),
    });
    const nonSelected = differenceWith(days, selectedDays, isSameDay);
    if (nonSelected.length > 0) {
      onChange?.(concat(selectedDays, nonSelected));
    } else {
      onChange?.(differenceWith(selectedDays, days, isSameDay));
    }
  }, [currMonth, onChange, selectedDays]);

  const modifiers = {
    selected: (date: Date) => selectedDays.some((d) => isSame(date, d)),
    hovered: (date: Date) => Boolean(hoveredDay && isSame(date, hoveredDay)),
  };

  return (
    <div>
      <Button onClick={onMonthClick}>All in month</Button>
      <Calendar
        className={className}
        mode="single"
        showOutsideDays
        onDayClick={handleDayClick}
        onDayMouseEnter={setHoveredDay}
        modifiers={modifiers}
        modifiersClassNames={{
          selected: "bg-primary text-white rounded-full",
          hovered: "bg-muted",
        }}
        weekStartsOn={1}
        classNames={{
          chevron: "fill-primary",
          today: "text-primary",
        }}
        onMonthChange={setMonth}
      />
    </div>
  );
}
