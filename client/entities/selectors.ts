import { useSelector } from "react-redux";
import type { AppState } from "../store/ReduxStore";
import { find } from "lodash";
import { isSameDay, isSameWeek } from "date-fns";
import type { ISchedule } from "../store/types";

export function useUserById(id: number) {
  return useSelector((state: AppState) => state.entities.users[id]);
}

export function useScheduleByWeek(weekDay: number | Date) {
  return useSelector((state: AppState) =>
    find(state.entities.schedule, (sch) =>
      isSameWeek(sch.day, weekDay, { weekStartsOn: 1 }),
    ),
  );
}

export function useScheduleByDay(day: number | Date) {
  return useSelector((state: AppState) =>
    find(state.entities.schedule, (sch) => isSameDay(sch.day, day)),
  );
}

export function useHomeworkByTeacher(userId: number) {
  return useSelector((state: AppState) =>
    find(state.entities.homeworks, (hw) => hw.teacherId === userId),
  );
}

export function useHomeworkBySchedule(sch: ISchedule) {
  return useSelector((state: AppState) =>
    find(state.entities.homeworks, (hw) => hw.scheduleId === sch.id),
  );
}
