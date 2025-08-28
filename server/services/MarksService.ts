/* eslint-disable @typescript-eslint/no-explicit-any */
import BaseContext from "../di/BaseContext";
import type { IUser } from "../models/users";
import { setManyOpFields } from "../serviceHelpers";
import { IEntitiesDto } from "../types";
import {
  DestroyModelError,
  ModelNotFoundError,
  ModelValidationError,
} from "./exceptions";
import { IClass, IHomework } from "../models/types";
import { UserRole } from "@/constants";
import { Op } from "sequelize";
import { weekRangeByDay } from "@/lib/utils";

const DEFAULT_PER_PAGE = 10;
interface Pagination {
  page?: number;
  perPage?: number;
  filter?: Record<string, string>;
  sort?: [string, 1 | 0 | -1];
}

type ISaveHomeworkDto = IHomework | Omit<IHomework, "id">;

export default class MarksService extends BaseContext {
  public async save(body: ISaveHomeworkDto) {
    const Model = this.ctx.HomeworksModel;
    const existed =
      "id" in body ? await Model.findByPk(body.id) : Model.build();
    if (!existed) {
      throw new ModelNotFoundError("Homework not found");
    }

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

  public async getMarksForClassAndWeek(classId: number, studentId: number, weekDay?: number) {
    let whereFilter: any = {
      classId,
    };
    if (weekDay) {
      const { start, end } = weekRangeByDay(new Date(weekDay));
      whereFilter.day = { [Op.between]: [start.getTime(), end.getTime()] };
    }
    const marks = await this.ctx.MarksModel.findAll({
      where:{
        studentId,
      },
      include: [
        {
          model: this.ctx.ScheduleModel,
          as: 'scheduleByMark',
          where: whereFilter,
        },
      ],
    });
    return marks.map((m) => m.get({ plain: true }));
  }
}
