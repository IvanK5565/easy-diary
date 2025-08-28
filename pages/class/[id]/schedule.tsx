import { AppState } from "@/client/store/ReduxStore";
import { Entities } from "@/client/store/types";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import container from "@/server/di/container";
import { format, isSameDay } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

function useEntitySelector<K extends keyof Entities>(name: K) {
  return useSelector((state: AppState) => state.entities[name] as Entities[K]);
}

export default function DiaryPage() {
  const router = useRouter();
  const id = Number(router.query.id);

  const cls = useEntitySelector("classes")[id];
  const schedule = Object.values(useEntitySelector("schedule")).filter(
    (s) => s.classId === id,
  );

  return (
    <Layout>
      <div className="p-4 flex flex-col gap-2">
        <h2>{cls?.title ?? "class"}</h2>
        {format(new Date(1753650000000), "dd.MM.yy")}
        <Calendar
          mode="single"
          onSelect={(date) => {
            if (date) router.push(`/class/${cls.id}/${String(date.getTime())}`);
          }}
          className="rounded-md border shadow-sm w-full"
          captionLayout="dropdown"
          onMonthChange={(date) => toast(format(date, "dd.MM.yy - HH:mm:ss"))}
          modifiers={{
            studyDay: (date) =>
              Boolean(
                schedule.find((s) => {
                  // console.log(`${typeof s.day} - ${date}`);
                  return isSameDay(date, new Date(Number(s.day)));
                }),
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
        <Button asChild>
          <Link href={`/class/${id}/generateSchedule`}>Generate</Link>
        </Button>
      </div>
    </Layout>
  );
}

export const getServerSideProps = container.resolve("getServerSideProps")([
  "ScheduleController",
]);
