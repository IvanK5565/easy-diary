import BaseEntity, { EntityAction } from "./BaseEntity";
import { schema } from "normalizr";
import { sagaAction, reducer } from "./decorators";
import type { IClientContainer } from "../di/container";
import { Entities } from "../store/types";
import { IMessage } from "@/server/models/types";

export type UserAction = EntityAction<MessageEntity>;

@reducer("messages")
export default class MessageEntity extends BaseEntity {
  protected schema;
  protected name: keyof Entities;

  constructor(di: IClientContainer) {
    super(di);
    const user = new schema.Entity("users");
    this.schema = new schema.Entity("messages", {
      sender: user,
      receiver: user,
    });
    this.name = "messages";
  }

  @sagaAction
  public *getChat(users: { userA: number; userB: number }) {
    yield this.xRead("/messages", "GET", users);
  }

  @sagaAction
  public *send(msg: Omit<IMessage, "id">) {
    yield this.xRead("/messages", "POST", msg);
  }
}
