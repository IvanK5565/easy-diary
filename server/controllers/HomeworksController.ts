import { AclRole, GRANT } from "@/acl/types";
import BaseController from "./BaseController";
import { Body, Entity, GET, POST, Query, USE } from "./decorators";
import type { ActionProps } from "@/types";
import { AccessDeniedError } from "./exceptions";
import { decimalPattern } from "@/constants";
import { authMiddleware } from "../lib/authMiddleware";

@Entity("HomeworkEntity")
export default class HomeworksController extends BaseController {
  @Body({
    type: "object",
    properties: {
      scheduleId: { type: "integer" },
      teacherId: { type: "integer" },
      title: { type: "string" },
      describe: { type: "string" },
    },
    required: ["scheduleId", "teacherId", "title", "describe"],
  })
  @POST("/api/homeworks", { allow: { [AclRole.TEACHER]: [GRANT.WRITE] } })
  public saveHomework({ body, guard }: ActionProps) {
    if (!guard.allow(GRANT.WRITE)) {
      throw new AccessDeniedError();
    }
    return this.ctx.HomeworksService.save(body);
  }

  @Query({
    type: "object",
    properties: {
      classId: { type: "string", pattern: decimalPattern },
      weekDay: { type: "string", pattern: decimalPattern },
    },
    required: ['classId'],
  })
  @GET("/api/homeworks", {
    allow: {
      [AclRole.STUDENT]: [GRANT.READ],
    },
  })
  @USE(authMiddleware)
  public getHomeworks({ query, guard }: ActionProps) {
    const { classId, weekDay } = query!;
    if (!guard.allow(GRANT.READ)) {
      throw new AccessDeniedError();
    }

    return this.ctx.HomeworksService.getByClassAndWeek(Number(classId), Number(weekDay));
  }
}
