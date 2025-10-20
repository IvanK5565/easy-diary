import BaseController from "./BaseController";
import { type ActionProps } from "@/types";
import { Body, Entity, GET, POST, Query, USE } from "./decorators";
import { authMiddleware } from "../lib/authMiddleware";
import { GRANT, AclRole } from "@/acl/types";
import { AccessDeniedError } from "./exceptions";
import { decimalPattern } from "@/constants";

@Entity("MarkEntity")
export default class MarksController extends BaseController {
    @Body({
    type: "object",
    properties: {
      id: {type: "integer" },
      scheduleId: { type: "integer" },
      studentId: { type: "integer" },
      type: { type: "string" },
      value: { type: "integer" },
    },
    required: ["scheduleId", "studentId", "type", "value"],
  })
  @POST("/api/marks", { allow: { [AclRole.TEACHER]: [GRANT.WRITE] } })
  public saveMark({ body, guard }: ActionProps) {
    if (!guard.allow(GRANT.WRITE)) {
      throw new AccessDeniedError();
    }
    return this.ctx.MarksService.save(body);
  }

  @Query({
    type: "object",
    properties: {
      classId: { type: "string", pattern: decimalPattern },
      studentId: { type: "string", pattern: decimalPattern },
      weekDay: { type: "string", pattern: decimalPattern, nullable: true },
    },
    required: ['classId', 'studentId'],
  })
  @GET("/api/marks", {
    allow: {
      [AclRole.STUDENT]: [GRANT.READ],
    },
  })
  @USE(authMiddleware)
  public getMarks({ query, guard }: ActionProps) {
    const { classId, studentId, weekDay } = query!;
    if (!guard.allow(GRANT.READ)) {
      throw new AccessDeniedError();
    }

    return this.ctx.MarksService.getMarksForClassAndWeek(Number(classId), Number(studentId), Number(weekDay)).then((r) => {
      console.log('res: ', r);
      return r;
    });
  }
}
