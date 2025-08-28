/* eslint-disable @typescript-eslint/no-explicit-any */
import BaseEntity, { EntityAction } from "./BaseEntity";
import { schema } from "normalizr";
import { sagaAction, reducer } from "./decorators";
import type { IClientContainer } from "../di/container";
import { Entities } from "../store/types";
import { IMark } from "@/server/models/types";

export type MarkAction = EntityAction<MarkEntity>;

@reducer("marks")
export default class MarkEntity extends BaseEntity {
  protected schema;
  protected name: keyof Entities;

  constructor(di: IClientContainer) {
    super(di);
    this.schema = new schema.Entity("marks");
    this.name = "marks";
  }

  @sagaAction
  public *fetchMarksByClass({
    classId,
    studentId,
    weekDay,
  }: {
    classId: number;
    studentId: number;
    weekDay?: number;
  }) {
    yield this.xRead("/marks", undefined, { classId, studentId, weekDay: weekDay || null });
  }

    @sagaAction
    public *saveMark(
      body: Omit<IMark, "id"> & Partial<Pick<IMark, "id">>,
    ) {
      yield this.xSave("/marks", body);
    }
}
