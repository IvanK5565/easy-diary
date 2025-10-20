/* eslint-disable @typescript-eslint/no-explicit-any */
import BaseContext from "../di/BaseContext";
import { ModelValidationError } from "./exceptions";
import { IMessage } from "../models/types";
import { Op } from "sequelize";

export default class MessagesService extends BaseContext {
  public async save(body: Omit<IMessage, "id">) {
    const Model = this.ctx.MessagesModel;
    const existed = Model.build();

    existed.set(body);

    try {
      await existed.validate();
      const updated = await existed.save();
      return updated.get({ plain: true });
    } catch (e) {
      throw new ModelValidationError(
        e instanceof Error ? e.message : JSON.stringify(e),
      );
    }
  }

  public async getChat(userA: number, userB: number) {
    const messages = await this.ctx.MessagesModel.findAll({
      where: {
        [Op.or]: [
          { senderId: userA, receiverId: userB },
          { senderId: userB, receiverId: userA },
        ],
      },
    });
    return messages.map((m) => m.get({ plain: true }));
  }
}
