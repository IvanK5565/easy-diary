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
import { IClass } from "../models/types";
import { UserRole } from "@/constants";

const DEFAULT_PER_PAGE = 10;
type IClassFilter = Partial<Omit<IClass, "id" | "password">>;
interface Pagination {
  page?: number;
  perPage?: number;
  filter?: Record<string, string>;
  sort?: [string, 1 | 0 | -1];
}

type ISaveClassDto = IClass | Omit<IClass, "id">;

export default class ClassesService extends BaseContext {
  private prepareFilter(filter?: IClassFilter) {
    if (!filter) return undefined;
    const res = setManyOpFields(
      filter,
      ["title", "substring"],
      [["year"], "eq"],
    );
    return res;
  }

  public async getClasses(
    pagination?: Pagination,
  ): Promise<IEntitiesDto<IUser>> {
    const Model = this.ctx.ClassesModel;

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
        model: this.ctx.UsersModel,
        as: "studentsInClass",
      },
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
      count: await this.ctx.ClassesModel.count({ where }),
    };
  }

  public async addStudent(
    cls: { id: number },
    std: { id: number; role: UserRole },
  ) {
    if (std.role !== UserRole.Student) {
      throw new Error("Wrong user role (student only)");
    }
    try {
      if (!(await this.ctx.ClassesModel.findByPk(cls.id))) {
        throw new Error("Class not found");
      }
      if (!(await this.ctx.UsersModel.findByPk(std.id))) {
        throw new Error("User not found");
      }
      if (
        await this.ctx.StudentClassModel.findOne({
          where: {
            classId: cls.id,
            studentId: std.id,
          },
        })
      ) {
        throw new Error("Student in class already");
      }
      const stdCls = this.ctx.StudentClassModel.build();
      stdCls.set({
        classId: cls.id,
        studentId: std.id,
      });
      await stdCls.save();
      return await this.ctx.ClassesModel.findOne({
        where: { id: cls.id },
        include: {
          model: this.ctx.UsersModel,
          as: "studentsInClass",
        },
      });
    } catch (e) {
      console.error(e instanceof Error ? e.message : JSON.stringify(e));
      throw new Error("Error in adding student to class");
    }
  }

  public async saveClass(newClass: ISaveClassDto) {
    const Model = this.ctx.ClassesModel;
    const oldClass =
      "id" in newClass ? await Model.findByPk(newClass.id) : Model.build();
    if (!oldClass) {
      throw new ModelNotFoundError("Class not found");
    }

    oldClass.set(newClass);

    try {
      await oldClass.validate();
      const updated = await oldClass.save();
      return updated.get({ plain: true });
    } catch (e) {
      throw new ModelValidationError(
        e instanceof Error ? e.message : JSON.stringify(e),
      );
    }
  }

  public async deleteClass(id: number) {
    const user = await this.ctx.ClassesModel.findByPk(id);
    if (!user) {
      throw new ModelNotFoundError("Class not found");
    }
    try {
      await user.destroy();
      return null;
    } catch (e) {
      throw new DestroyModelError(
        e instanceof Error ? e.message : JSON.stringify(e),
      );
    }
  }

  public async findById(id: number) {
    const cls = await this.ctx.ClassesModel.findByPk(id, {
      include: { model: this.ctx.UsersModel, as: "studentsInClass" },
    });
    console.log("IDDDDDDD:", cls?.get({ plain: true }));
    return cls?.get({ plain: true }) ?? null;
  }
}
