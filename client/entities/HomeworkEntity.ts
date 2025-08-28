/* eslint-disable @typescript-eslint/no-explicit-any */
import BaseEntity, { EntityAction } from "./BaseEntity";
import { schema } from "normalizr";
import { sagaAction, reducer } from "./decorators";
import type { IClientContainer } from "../di/container";
import { Entities } from "../store/types";
import type { IHomework } from "../store/types";

export type HomeworkAction = EntityAction<HomeworkEntity>;

@reducer("homeworks")
export default class HomeworkEntity extends BaseEntity {
  protected schema;
  protected name: keyof Entities;

  constructor(di: IClientContainer) {
    super(di);
    this.schema = new schema.Entity("homeworks");
    this.name = "homeworks";
  }

  @sagaAction
  public *saveHomework(
    body: Omit<IHomework, "id"> & Partial<Pick<IHomework, "id">>,
  ) {
    yield this.xSave("/homeworks", body);
  }

  @sagaAction
  public *fetchHomeworksByClass({
    classId,
    weekDay,
  }: {
    classId: number;
    weekDay?: number;
  }) {
    const body: { classId: number } | { classId: number; weekDay: number } =
      weekDay ? { classId } : { classId, weekDay };
    yield this.xRead("/homeworks", "GET", body);
  }
}
