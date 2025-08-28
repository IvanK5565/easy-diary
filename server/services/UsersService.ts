/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserRole } from "@/constants";
import BaseContext from "../di/BaseContext";
import IServerContainer from "../di/IServerContainer";
import type { IUser } from "../models/types";
import { setOpFields } from "../serviceHelpers";
import { IEntitiesDto } from "../types";
import {
  DestroyModelError,
  ModelNotFoundError,
  ModelValidationError,
} from "./exceptions";

const DEFAULT_PER_PAGE = 10;
type IUserFilter = Partial<Omit<IUser, "id" | "password">>;
interface Pagination {
  page?: number;
  perPage?: number;
  filter?: Record<string, string>;
  sort?: [string, 1 | 0 | -1];
}

type ISaveUserDto = IUser | Omit<IUser, "id">;

export default class UsersService extends BaseContext {
  constructor(ctx: IServerContainer) {
    super(ctx);
    ctx.UsersModel.findOne({
      where: {
        email: "admin@email.com",
      },
    })
      .then((user) => {
        if (!user) {
          return ctx.UsersModel.build({
            email: "admin@email.com",
            password: "admin",
            role: UserRole.Admin,
          }).save();
        }
        return null;
      })
      .catch(console.error);
  }
  private prepareFilter(filter?: IUserFilter) {
    if (!filter) return undefined;
    const res = setOpFields(
      filter,
      ["firstName", "lastName", "role"],
      "substring",
    );
    return res;
  }

  public async authorize(credentials?: { email: string; password: string }) {
    if (credentials) {
      const { email, password } = credentials;
      const user = await this.ctx.UsersModel.findOne({
        where: {
          email,
        },
      });
      if (user && (await user.verifyPassword(password))) {
        return user.get?.({ plain: true });
      }
    }
    return null;
  }

  public async getUsers(pagination?: Pagination): Promise<IEntitiesDto<IUser>> {
    const Model = this.ctx.UsersModel;

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

  public async saveStudentInClass(newUser: ISaveUserDto, cls: { id: number }) {
    const Model = this.ctx.UsersModel;
    const existedClass = await Model.findByPk(cls.id);
    if (!existedClass) {
      throw new ModelNotFoundError("Class not found");
    }
    if ("id" in newUser) {
      if (
        await this.ctx.StudentClassModel.findOne({
          where: {
            classId: cls.id,
            studentId: newUser.id,
          },
        })
      ) {
        throw new Error("standaerError: user exists in class");
      }
    }
    const student = await this.saveUser(newUser);
    const studentClass = this.ctx.StudentClassModel.build();

    studentClass.set({
      classId: cls.id,
      studentId: student.id,
    });

    try {
      await studentClass.validate();
      const updated = await studentClass.save();
      return updated.get({ plain: true });
    } catch (e) {
      throw new ModelValidationError(
        e instanceof Error ? e.message : JSON.stringify(e),
      );
    }
  }

  public async saveUser(newUser: ISaveUserDto) {
    const Model = this.ctx.UsersModel;
    const oldUser =
      "id" in newUser ? await Model.findByPk(newUser.id) : Model.build();
    if (!oldUser) {
      throw new ModelNotFoundError("User not found");
    }

    oldUser.set(newUser);

    try {
      await oldUser.validate();
      const updated = await oldUser.save();
      return updated.get({ plain: true });
    } catch (e) {
      throw new ModelValidationError(
        e instanceof Error ? e.message : JSON.stringify(e),
      );
    }
  }

  public async deleteUser(id: number) {
    const user = await this.ctx.UsersModel.findByPk(id);
    if (!user) {
      throw new ModelNotFoundError("User not found");
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
    return this.ctx.UsersModel.findByPk(id);
  }

  public async findByEmail(email: string) {
    return this.ctx.UsersModel.findOne({ where: { email } });
  }
}
