/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import BaseEntity, { EntitiesName, EntityAction } from "./BaseEntity";
import { schema } from "normalizr";
import { sagaAction, reducer } from "./decorators";
import type { IClientContainer } from "../di/container";
import { addEntities } from "../store/actions";
import { put } from "redux-saga/effects";
import { Entities, ISubject } from "../store/types";

export type SubjectAction = EntityAction<SubjectEntity>;

@reducer("subjects")
export default class SubjectEntity extends BaseEntity {
  protected schema;
  protected name: keyof Entities;

  constructor(di: IClientContainer) {
    super(di);
    this.schema = new schema.Entity("subjects");
    this.name = "subjects";
  }

  @sagaAction
  public *getAllSubjects() {
    yield this.xRead("/subjects");
  }

  @sagaAction
  public *saveSubject(
    payload: Omit<ISubject, "id"> & Partial<Pick<ISubject, "id">>,
  ) {
    const id = payload.id;
    yield this.xSave(id ? `/subjects/${id}` : "/subjects", payload);
  }

  @sagaAction
  public *getSubjectById(payload: { id: string }) {
    const id = payload.id;
    if (!id) throw new Error("Id required");
    yield this.xRead(`/subjects/${id}`);
  }

  @sagaAction
  public *deleteSubject(payload: any) {
    if (!payload.id) throw new Error("Id required");
    const normalized = this.normalize(payload);
    yield put({ type: "DELETE", payload: normalized.entities });
  }
}
