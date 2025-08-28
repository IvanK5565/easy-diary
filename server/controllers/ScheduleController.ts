import BaseController from "./BaseController";
import { AnswerType, type ActionProps } from "@/types";
import { Body, Entity, GET, POST, Query } from "./decorators";
import { ApiError, InternalError } from "./exceptions";
import { StatusCodes } from "http-status-codes";
import { decimalPattern } from "@/constants";

@Entity("ScheduleEntity")
export default class ScheduleController extends BaseController {
  @Body({
    type: "object",
    properties: {
      classId: { type: "integer" },
      title: { type: "string" },
      days: {
        type: "array",
        items: {
          type: "object",
          properties: {
            day: { type: "integer" },
            queue: { type: "integer" },
            subjectId: { type: "integer", nullable: true },
          },
          required: ["day", "queue", "subjectId"],
        },
      },
    },
    required: ["days", "classId", "title"],
  })
  @POST("/api/schedule/generate")
  public generate({ body }: ActionProps) {
    if (body) {
      return this.ctx.ScheduleService.generateSchedule(body);
    }
    throw new InternalError("no body");
  }

  @Body({
    type: "object",
    properties: {
      id: { type: "integer" },
      classId: { type: "integer" },
      title: { type: "string" },
      day: { type: "integer" },
      queue: { type: "integer" },
      subjectId: { type: "integer", nullable: true },
    },
    required: ["day", "queue", "subjectId", "classId", "title"],
  })
  @POST("/api/schedule")
  public save({ body }: ActionProps) {
    if (body) {
      return this.ctx.ScheduleService.saveScheduleDay(body);
    }
    throw new InternalError("no body");
  }

  @POST("/api/schedule/byRange")
  @Body({
    type: "array",
    items: {
      type: "integer",
    },
  })
  public findByRange({ body }: ActionProps) {
    return this.ctx.ScheduleService.byDayRange(body);
  }

  @GET("/class/[id]/schedule")
  @Query({
    type: "object",
    properties: {
      id: { type: "string", pattern: decimalPattern },
    },
    required: ["id"],
  })
  public scheduleByClass({ query }: ActionProps) {
    const id = query?.id as string;
    if (id) {
      return this.ctx.ScheduleService.getSchedule({
        filter: { classId: id },
      }).then((r) => {
        console.log("schedule ssr: ", r);
        return r;
      });
    }
    throw new ApiError("Wrong id", StatusCodes.BAD_REQUEST, AnswerType.Toast);
  }
}
