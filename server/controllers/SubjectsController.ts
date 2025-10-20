import { decimalPattern } from "@/constants";
import BaseController from "./BaseController";
import { Body, Entity, GET, POST } from "./decorators";
import type { ActionProps } from "@/types";

@Entity("SubjectEntity")
export default class SubjectsController extends BaseController {
  @POST("/api/subjects")
  @POST("/api/subjects/[id]")
  @Body({
    type: "object",
    properties: {
      id: { type: "string", pattern: decimalPattern },
      title: { type: "string" },
      describe: { type: "string" },
      group: { type: "string" },
    },
    required: ["title", "describe", "group"],
  })
  public save({ body }: ActionProps) {
    return this.ctx.SubjectsService.saveSubject(body);
  }

  @GET("/class/[id]/generateSchedule")
  @GET("/class/[id]/[date]")
  @GET("/admin/subjects")
  public getAll() {
    return this.ctx.SubjectsService.getSubjects();
  }

  // @GET("/api/subjects/[id]")
  // public findById(req: NextApiRequest) {
  // 	const { id } = req.query;
  // 	const numId = Number(id);
  // 	return this.ctx.SubjectsService.findById(numId);
  // }

  // @USE(authMiddleware)
  // @GET("/api/subjects")
  // public findByFilter(req: NextApiRequest) {
  // 	const { limit, page, ...filters } = req.query as Record<string,string>;
  // 	let parsedLimit = Number(limit);
  // 	let parsedPage = Number(page);
  // 	if (isNaN(parsedLimit)) parsedLimit = DEFAULT_LIMIT;
  // 	if (isNaN(parsedPage)) parsedPage = DEFAULT_PAGE;

  // 	return this.ctx.SubjectsService.findByFilter(
  // 		parsedLimit,
  // 		Math.max(1, parsedPage),
  // 		filters
  // 	);
  // }

  // @DELETE("/api/subjects")
  // public deleteById(req: NextApiRequest) {
  // 	const id = Number(req.query.id);
  // 	return this.ctx.SubjectsService.delete(id);
  // }

  // @GET('/api/not/exist')
  // public certain({}:ActionProps) {
  // 	return {certain: 'subjects'}
  // }
}
