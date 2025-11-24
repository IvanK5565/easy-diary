/* eslint-disable @typescript-eslint/no-explicit-any */
import BaseEntity, { EntityAction } from "./BaseEntity";
import { schema } from "normalizr";
import { sagaAction, reducer } from "./decorators";
import type { IClientContainer } from "../di/container";
import { put } from "redux-saga/effects";
import Router from "next/router";
import { toast } from "react-toastify";
import { Entities } from "../store/types";
import { UserRole } from "@/constants";

export type ClassAction = EntityAction<ClassEntity>;

@reducer("classes")
export default class ClassEntity extends BaseEntity {
  protected schema;
  protected name: keyof Entities;

  constructor(di: IClientContainer) {
    super(di);
    const user = new schema.Entity("users");
    this.schema = new schema.Entity(
      "classes",
      {
        teacher: user,
        studentsInClass: [user],
      },
      { idAttribute: "id" },
    );
    this.name = "classes";
  }

  @sagaAction
  public *redirect(payload: string) {
    toast("redirect: " + payload);
    yield Router.replace(payload);
  }

  @sagaAction
  public *getAllClasses() {
    yield this.xRead("/classes");
  }

  @sagaAction
  public *saveClass(payload: any) {
    const id = payload.id;
    yield this.xSave(id ? `/classes/${id}` : "/classes", payload);
  }

  @sagaAction
  public *getClassById(payload: any) {
    const id = payload.id;
    if (!id) throw new Error("Id required");
    yield this.xRead(`/classes/${id}`);
  }
  @sagaAction
  public *deleteClass(payload: any) {
    if (!payload.id) throw new Error("Id required");
    const normalized = this.normalize(payload);
    yield put({ type: "DELETE", payload: normalized.entities });
  }
  @sagaAction
  public *getError() {
    console.log("in saga action");
    yield this.xRead("/classes/error");
  }

  @sagaAction
  public *addStudent(body: {
    class: { id: number };
    student: { id: number; role: UserRole };
  }) {
    yield this.xSave("/classes/addStudent", body);
  }

  @sagaAction
  public *removeStudent(body: {
    class: { id: number };
    student: { id: number };
  }) {
    yield this.xSave("/classes/removeStudent", body);
  }
}
