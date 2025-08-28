/* eslint-disable @typescript-eslint/no-explicit-any */
import BaseContext from "../di/BaseContext";
import type { IUser } from "../models/users";
import { setOpFields } from "../serviceHelpers";
import { IEntitiesDto } from "../types";
import {
  ModelNotFoundError,
  ModelValidationError,
} from "./exceptions";
import { ISubject } from "../models/types";

const DEFAULT_PER_PAGE = 10;
type ISubjectFilter = Partial<Omit<ISubject, "id" | "password">>;
interface Pagination {
  page?: number;
  perPage?: number;
  filter?: Record<string, string>;
  sort?: [string, 1 | 0 | -1];
}

type ISaveSubjectDto = ISubject | Omit<ISubject, "id">;

export default class SubjectsService extends BaseContext {
  private prepareFilter(filter?: ISubjectFilter) {
    if (!filter) return undefined;
    const res = setOpFields(filter, ["title", "describe", "group"], "substring");
    return res;
  }

  public async getSubjects(
    pagination?: Pagination,
  ): Promise<IEntitiesDto<IUser>> {
    const Model = this.ctx.SubjectsModel;

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
    };

    let count: number | undefined = undefined;
    const rows = await (pagination
      ? Model.findAndCountAll(options).then(({ rows, count: _count }) => {
          count = _count;
          return rows;
        })
      : Model.findAll(options));

    return {
      items: rows.map((u) => u.get({ plain: true })),
      count,
    };
  }

  public async count(pagination?: Pagination) {
    const where: Record<string, any> | undefined = this.prepareFilter(
      pagination?.filter,
    );
    return {
      count: await this.ctx.UsersModel.count({ where }),
    };
  }

  public async saveSubject(newSub: ISaveSubjectDto) {
    const Model = this.ctx.SubjectsModel;
    const oldSub =
      "id" in newSub ? await Model.findByPk(newSub.id) : Model.build();
    if (!oldSub) {
      throw new ModelNotFoundError("User not found");
    }

    oldSub.set(newSub);

    try {
      await oldSub.validate();
      const updated = await oldSub.save();
      return updated.get({ plain: true });
    } catch (e) {
      throw new ModelValidationError(
        e instanceof Error ? e.message : JSON.stringify(e),
      );
    }
  }

  public async findById(id: number) {
    return this.ctx.SubjectsModel.findByPk(id);
  }
}
