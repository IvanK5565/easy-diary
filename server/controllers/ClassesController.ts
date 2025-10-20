/* eslint-disable no-empty-pattern */
import BaseController from "./BaseController";
import { AnswerType, type ActionProps } from "@/types";
import { Body, Entity, GET, POST, Query, USE } from "./decorators";
import { authMiddleware } from "../lib/authMiddleware";
import { GRANT, AclRole } from "@/acl/types";
import { AccessDeniedError, ApiError } from "./exceptions";
import { StatusCodes } from "http-status-codes";
import { decimalPattern } from "@/constants";

@Entity("ClassEntity")
export default class ClassesController extends BaseController {
  @Query({
    type: "object",
    properties: {
      id: { type: "string", pattern: decimalPattern },
    },
  })
  @GET("/classes/[id]/edit", {
    allow: {
      [AclRole.ADMIN]: [GRANT.READ],
    },
  })
  @USE(authMiddleware)
  public getEditClassDataSSR({ query, guard }: ActionProps) {
    const { id } = query!;
    if (!guard.allow(GRANT.READ)) {
      throw new AccessDeniedError();
    }

    return this.ctx.ClassesService.findById(Number(id));
  }

  @GET("/admin/classes", {
    allow: {
      [AclRole.ADMIN]: [GRANT.READ],
    },
  })
  @GET("/admin/users", {
    allow: {
      [AclRole.ADMIN]: [GRANT.READ],
    },
  })
  public getClassesAdminSsr({}: ActionProps) {
    return this.ctx.ClassesService.getClasses();
  }

  @GET("/", {
    allow: {
      [AclRole.STUDENT]: [GRANT.READ],
    },
  })
  public getClassesByTeacher({}: ActionProps) {
    return this.ctx.ClassesService.getClasses();
  }

  @POST("/api/classes", {
    allow: {
      [AclRole.ADMIN]: [GRANT.WRITE],
    },
  })
  @POST("/api/classes/[id]", {
    allow: {
      [AclRole.ADMIN]: [GRANT.WRITE],
    },
  })
  @Body({
    type: "object",
    properties: {
      id: { type: "integer", nullable: true },
      title: { type: "string" },
      year: { type: "integer" },
    },
    required: ["title", "year"],
  })
  public save({ guard, body }: ActionProps) {
    if (!guard.allow(GRANT.WRITE)) {
      console.log("RULES", this.ctx.rules);
      throw new AccessDeniedError();
    }
    return this.ctx.ClassesService.saveClass(body);
  }

  // @USE(
  // 	validate({
  // 		query: {
  // 			type: "object",
  // 			properties: {
  // 				id: { type: "string", pattern: decimalPattern },
  // 			},
  // 			required: ["id"],
  // 		},
  // 	})
  // )
  /////
  @Query({
    type: "object",
    properties: {
      id: { type: "string", pattern: decimalPattern },
    },
  })
  @GET("/api/classes/[id]")
  public findById({ query }: ActionProps) {
    const id = Number(query!.id);
    return this.ctx.ClassesService.findById(id);
  }

  @POST("/api/classes/addStudent", {
    allow: {
      [AclRole.TEACHER]: [GRANT.WRITE],
    },
  })
  @Body({
    type: "object",
    properties: {
      student: {
        type: "object",
        properties: {
          id: { type: "integer" },
          role: { type: "string" },
        },
        required: ["id"],
      },
      class: {
        type: "object",
        properties: {
          id: { type: "integer" },
        },
        required: ["id"],
      },
    },
    required: ["class", "student"],
  })
  public addStudent({ body, guard }: ActionProps) {
    if (!guard.allow(GRANT.WRITE)) {
      throw new AccessDeniedError();
    }
    return this.ctx.ClassesService.addStudent(body.class, body.student);
  }

  @POST("/api/classes/removeStudent", {
    allow: {
      [AclRole.TEACHER]: [GRANT.WRITE],
    },
  })
  @Body({
    type: "object",
    properties: {
      student: {
        type: "object",
        properties: {
          id: { type: "integer" },
        },
        required: ["id"],
      },
      class: {
        type: "object",
        properties: {
          id: { type: "integer" },
        },
        required: ["id"],
      },
    },
    required: ["class", "student"],
  })
  public removeStudent({ body, guard }: ActionProps) {
    if (!guard.allow(GRANT.WRITE)) {
      throw new AccessDeniedError();
    }
    return this.ctx.ClassesService.removeStudent(body.class, body.student);
  }

  // @DELETE("/api/classes/[i]")
  // public deleteById({ query }: ActionProps) {
  // 	const id = Number(query!.id);

  // 	return this.ctx.ClassesService.delete(id);
  // }

  @GET("/api/classes/error")
  public error() {
    throw new ApiError(
      "Expected error",
      StatusCodes.INTERNAL_SERVER_ERROR,
      AnswerType.Toast,
    );
  }

  @GET("/class/[id]/generateSchedule")
  @Query({
    type: "object",
    properties: {
      id: { type: "string", pattern: decimalPattern },
    },
    required: ["id"],
  })
  public getClassById({ query }: ActionProps) {
    if (query?.id) {
      return this.ctx.ClassesService.findById(parseInt(query.id as string));
    }
  }
}
