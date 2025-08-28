import BaseEntity, { EntityAction } from "./BaseEntity";
import { schema } from "normalizr";
import { sagaAction, reducer } from "./decorators";
import type { IClientContainer } from "../di/container";
import { Entities, ISubject } from "../store/types";
import { ISchedule } from "../store/types";

export type ScheduleAction = EntityAction<ScheduleEntity>;

type SaveScheduleDto = {
  days: Date[];
  title: string;
  sch: ISubject[][];
  classId: number;
};
type SaveScheduleDayDto = {
  day: number;
  queue: number;
  subjectId: number | null;
};

@reducer("schedule")
export default class ScheduleEntity extends BaseEntity {
  protected schema;
  protected name: keyof Entities;

  constructor(di: IClientContainer) {
    super(di);
    const mark = new schema.Entity("marks");
    const homework = new schema.Entity("homeworks");
    this.schema = new schema.Entity("schedule", {
      marks: mark,
      homework: homework,
    });
    this.name = "schedule";
  }

  @sagaAction
  public *save(body: {
    subjectId: number | null;
    classId: number;
    day: number;
    queue: number;
    title: string;
  }) {
    yield this.xSave("/schedule", body);
  }

  @sagaAction
  public *generate({ days, title, sch, classId }: SaveScheduleDto) {
    const preparedDays: SaveScheduleDayDto[] = [];

    for (let i = 0; i < days.length; i += 1) {
      const day = days[i];
      const dayOfWeek = day.getDay();
      if (dayOfWeek === 0) continue;

      const lessons = sch[dayOfWeek - 1] || [];
      for (let queue = 0; queue < 8; queue++) {
        const subject = lessons[queue];
        if (!subject) continue;

        preparedDays.push({
          day: day.getTime(),
          queue,
          subjectId: subject.id,
        });
      }
    }

    yield this.xSave("/schedule/generate", {
      classId,
      title,
      days: preparedDays,
    });
  }

  @sagaAction
  public *fetchByRange({ range }: { range: Date[] }) {
    yield this.xRead(
      "/schedule/byRange",
      "POST",
      range.map((d) => d.getTime()),
    );
  }

  @sagaAction
  public *fetchScheduleByClass(body: { classId: number; title: string }) {
    yield this.xRead("/schedule", "GET", body);
  }
}
