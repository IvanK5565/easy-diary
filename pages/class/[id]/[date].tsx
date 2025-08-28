import Layout from "@/components/Layout";
import ScheduleDayView from "@/components/ScheduleDayView";
import container from "@/server/di/container";
import { useRouter } from "next/router";

export default function DaySchedule() {
  const router = useRouter();
  const classId = Number(router.query.id);
  const nDate = Number(router.query.date);

  const date = new Date(nDate);
  if (!nDate || isNaN(nDate) || isNaN(date.getTime()) || isNaN(classId)) {
    router.push("/404");
  }

  return (
    <Layout>
      <ScheduleDayView date={date} classId={classId} />
    </Layout>
  );
}

export const getServerSideProps = container.resolve("getServerSideProps")([
  "ScheduleController",
  "SubjectsController",
]);
