import { useEntitySelector } from "@/client/hooks/useEntitySelector";
import { Calendar } from "@/components/ui/calendar";
import { format, isSameDay } from "date-fns";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { Button } from "../ui/button";
import Link from "next/link";

export default function DiaryCalendar({ id }: { id: number }) {
  const router = useRouter();

  const cls = useEntitySelector("classes")[id];
  const schedule = Object.values(useEntitySelector("schedule")).filter(
    (s) => s.classId === id,
  );

  return (
    <div className="flex flex-col gap-2 w-full items-center">
      <div className="w-min overflow-auto">
        <Calendar
          mode="single"
          onSelect={(date) => {
            if (date) {
              router.push(`/class/${cls.id}/${String(date.getTime())}`);
            }
          }}
          className="rounded-md shadow-sm min-w-80 bg-background"
          captionLayout="dropdown"
          onMonthChange={(date) => toast(format(date, "dd.MM.yy - HH:mm:ss"))}
          modifiers={{
            studyDay: (date) =>
              Boolean(
                schedule.find((s) => isSameDay(date, new Date(Number(s.day)))),
              ),
          }}
          modifiersClassNames={{
            studyDay: "text-primary",
          }}
          classNames={{
            day_button: "cursor-pointer",
          }}
          weekStartsOn={1}
        />
      </div>
      <Button asChild>
        <Link className="mb-5" href={`/class/${id}/generateSchedule`}>
          Generate
        </Link>
      </Button>
    </div>
  );
}
