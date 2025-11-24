import { useMemo, useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import NewScheduleTable from "@/components/NewScheduleTable";
import { useRouter } from "next/router";
import container from "@/server/di/container";
import { ISubject } from "@/client/store/types";
import { useActions } from "@/client/hooks";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useTranslation } from "next-i18next";
import { SelectWeeksDialog } from "@/components/SelectWeeksDialog";

export default function AddSchedule() {
  const [days, setWeeks] = useState<Date[]>([]);
  const [sch, setSch] = useState<ISubject[][]>([]);
  const [title, setTitle] = useState<string>("");
  const classId = useRouter().query.id as string;

  const isReady = useMemo(() => {
    return days.length > 0 && Boolean(classId) && title.length > 0;
  }, [classId, title, days.length]);
  const { generate: save } = useActions("ScheduleEntity");
  const { t } = useTranslation("common");
  return (
    <Layout breadcrumb={["Generate Schedule"]}>
      <div className="flex flex-col w-full items-center">
        <div className="flex flex-col items-center">
          <h2 className="text-lg mb-4">{t("Select weeks by clicking days")}</h2>
          <div className="flex justify-between w-full">
            <Label className="text-md">
              {t("class")}: {classId}
            </Label>
            <SelectWeeksDialog days={days} onSelect={setWeeks} />
          </div>
          <div className="w-full">
            <Label className="text-md" htmlFor="scheduleTitle">
              {t("Title")}:
            </Label>
          </div>
          <Input
            type="text"
            name="scheduleTitle"
            id="scheduleTitle"
            onChange={(e) => setTitle(e.target.value)}
            className="mb-2"
          />
          <NewScheduleTable disabled={days.length <= 0} onChange={setSch} />
          <Button
            disabled={!isReady}
            className="flex w-full"
            onClick={() =>
              save({ days, sch, classId: parseInt(classId), title })
            }
          >
            Save
          </Button>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps = container.resolve("getServerSideProps")([
  "ClassesController",
  "SubjectsController",
]);
