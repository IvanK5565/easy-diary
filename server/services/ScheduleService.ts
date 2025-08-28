/* eslint-disable @typescript-eslint/no-explicit-any */
import { Op } from "sequelize";
import BaseContext from "../di/BaseContext";
import { setManyOpFields } from "../serviceHelpers";
import { IEntitiesDto } from "../types";
import { ISchedule } from "../models/types";
import { ModelNotFoundError, ModelValidationError } from "./exceptions";

const DEFAULT_PER_PAGE = 10;
type IScheduleFilter = Partial<Omit<ISchedule, "id">>;
interface Pagination {
  page?: number;
  perPage?: number;
  filter?: Record<string, string>;
  sort?: [string, 1 | 0 | -1];
}

type GenerateScheduleDto = {
  classId: number;
  title: string;
  days: {
    day: number;
    queue: number;
    subjectId: number | null;
  }[];
};

type SaveScheduleDto = {
  id?: number;
  classId: number;
  title: string;
  day: number;
  queue: number;
  subjectId: number | null;
};

export default class ScheduleService extends BaseContext {
  private prepareFilter(filter?: IScheduleFilter) {
    if (!filter) return undefined;
    const res = setManyOpFields(
      filter,
      ["title", "substring"],
      [["year", "classId", "subjectId", "week", "queue"], "eq"],
    );
    return res;
  }

  public async getSchedule(
    pagination?: Pagination,
  ): Promise<IEntitiesDto<ISchedule>> {
    const Model = this.ctx.ScheduleModel;

    const where: Record<string, any> | undefined = this.prepareFilter(
      pagination?.filter,
    );
    const order: [[string, "ASC" | "DESC"]] | undefined = pagination?.sort
      ? [[pagination.sort[0], pagination.sort[1] === -1 ? "DESC" : "ASC"]]
      : undefined;
    const limit: number = pagination?.perPage ?? DEFAULT_PER_PAGE;
    const offset: number = pagination?.page ? (pagination.page - 1) * limit : 0;

    const options = {
      where,
      limit,
      offset,
      order,
      include: {
        model: this.ctx.HomeworksModel,
        as: "homeworksBySchedule",
      },
    };

    let count: number | undefined = undefined;
    const rows = await (pagination
      ? Model.findAndCountAll(options).then(({ rows, count: _count }) => {
          count = _count;
          return rows;
        })
      : Model.findAll(options));

    console.log(
      "getschedule: ",
      rows.map((u) => u.get({ plain: true })),
    );

    return {
      items: rows.map((u) => u.get({ plain: true })),
      count,
    };
  }

  public async saveScheduleDay(newDay: SaveScheduleDto) {
    const Model = this.ctx.ScheduleModel;
    const oldDay =
      "id" in newDay ? await Model.findByPk(newDay.id) : Model.build();
    if (!oldDay) {
      throw new ModelNotFoundError("Schedule not found");
    }

    oldDay.set(newDay);

    try {
      await oldDay.validate();
      const updated = await oldDay.save();
      return updated.get({ plain: true });
    } catch (e) {
      throw new ModelValidationError(
        e instanceof Error ? e.message : JSON.stringify(e),
      );
    }
  }

  public async generateSchedule({ days, classId, title }: GenerateScheduleDto) {
    const Model = this.ctx.ScheduleModel;
    await Model.destroy({
      where: { classId, title },
    });

    const toCreate: Omit<ISchedule, "id">[] = [];

    days.forEach(({ day, queue, subjectId }) => {
      if (subjectId) {
        toCreate.push({
          classId,
          day,
          queue,
          title,
          subjectId,
        });
      }
    });
    console.log("toCreate", toCreate);

    // create
    const created = await Model.bulkCreate(toCreate);

    const res = created.map((u) => u.get({ plain: true }));

    console.log("created", res);

    return res;
  }

  public byDayRange(range: number[]) {
    return this.ctx.ScheduleModel.findAll({
      where: {
        day: {
          [Op.in]: range,
        },
      },
      include: [
        {
          model: this.ctx.SubjectsModel,
          as: "subjectsBySchedule",
        },
        {
          model: this.ctx.MarksModel,
          as: "marksBySchedule",
        },
      ],
    });
  }
}
