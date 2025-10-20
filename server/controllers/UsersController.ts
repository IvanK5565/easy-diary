import BaseController from "./BaseController";
import { Body, DELETE, Entity, GET, Pager, POST, Query } from "./decorators";
import type { ActionProps } from "@/types";
import { GRANT, AclRole } from "@/acl/types";
import { AccessDeniedError } from "./exceptions";
import { registerBodySchema } from "../lib/schemas";
import { decimalPattern } from "@/constants";

@Entity("UserEntity")
export default class UsersController extends BaseController {
  @GET("/classes/new", {
    allow: {
      [AclRole.TEACHER]: [GRANT.READ],
    },
  })
  public getAuth({ guard }: ActionProps) {
    if (!guard.allow(GRANT.READ)) throw new AccessDeniedError();
    return {};
  }

  @Body(registerBodySchema)
  @POST("/api/register", { allow: { [AclRole.GUEST]: [GRANT.WRITE] } })
  public async signUp({ body }: ActionProps) {
    console.log("register body: ", body);
    return this.ctx.UsersService.saveUser(body);
  }

  @POST("/api/users", { allow: { [AclRole.TEACHER]: [GRANT.WRITE] } })
  @POST("/api/users/[id]")
  public save({ guard, body }: ActionProps) {
    if (!guard.allow(GRANT.WRITE)) throw new AccessDeniedError();
    return this.ctx.UsersService.saveUser(body);
  }

  @GET("/api/users/[id]")
  public findById({ query }: ActionProps) {
    const { id } = query!;
    const numId = Number(id);
    return this.ctx.UsersService.findById(numId);
  }

  @GET("/classes/[id]/edit", {
    allow: {
      [AclRole.TEACHER]: [GRANT.WRITE],
    },
  })
  @Query({
    type: "object",
    properties: {
      id: { type: "string", pattern: decimalPattern },
    },
    required: ["id"],
  })
  public getUsersSsr({ guard, pager }: ActionProps) {
    if (!guard.allow(GRANT.WRITE)) {
      throw new AccessDeniedError();
    }
    return this.ctx.UsersService.getUsers(pager);
  }

  // @Auth
  // @GET("/profile")
  // public profile({ session }: ActionProps) {
  // 	if (!session) {
  // 		throw new ApiError(
  // 			"Session is null in secured action",
  // 			500,
  // 			AnswerType.Log
  // 		);
  // 	}
  // 	return this.ctx.UsersService.findByEmail(session.identity.email);
  // }

  // @GET("/api/users", {
  // 	allow: {
  // 		[AclRole.ADMIN]: [GRANT.READ],
  // 	},
  // })
  // public findByFilter({ query, guard }: ActionProps) {
  // 	const { limit, page, ...filters } = query as Record<string, string>;
  // 	let parsedLimit = Number(limit);
  // 	let parsedPage = Number(page);
  // 	if (isNaN(parsedLimit)) parsedLimit = DEFAULT_LIMIT;
  // 	if (isNaN(parsedPage)) parsedPage = DEFAULT_PAGE;

  // 	if (!guard.allow(GRANT.READ)) throw new AccessDeniedError();

  // 	return this.ctx.UsersService.findByFilter(
  // 		parsedLimit,
  // 		Math.max(1, parsedPage),
  // 		filters
  // 	);
  // }

  @DELETE("/api/users", { allow: { [AclRole.ADMIN]: [GRANT.EXECUTE] } })
  public deleteById({ query, guard }: ActionProps) {
    if (!guard.allow(GRANT.EXECUTE)) throw new AccessDeniedError();
    const id = Number(query!.id);
    return this.ctx.UsersService.deleteUser(id);
  }

  // @GET('/api/users/teachers', { allow: { [AclRole.TEACHER]: [GRANT.READ] } })
  // public getTeachers({ guard }: ActionProps) {
  // 	if (!guard.allow(GRANT.READ)) throw new AccessDeniedError();
  // 	return this.ctx.UsersService.findByRole(UserRole.TEACHER)
  // }

  // @GET('/api/users/students', { allow: { [AclRole.TEACHER]: [GRANT.READ] } })
  // public getStudents({ guard }: ActionProps) {
  // 	if (!guard.allow(GRANT.READ)) throw new AccessDeniedError();
  // 	return this.ctx.UsersService.findByRole(UserRole.STUDENT)
  // }

  // export interface IPagerParams {
  // 	pageName?: string; // paginator name
  // 	// sort?: object;      // object with sorting key/values
  // 	sort?: ISortParams;
  // 	filter?: object; //object;    // object with filtering key/values
  // 	page?: number; // page number
  // 	perPage: number; // count items on one page
  // 	force?: boolean; // reload data in the redux and pager
  // 	count?: number; // count by filter, if 0 need to recalculate, if > 0 count doesn't need to calculate
  // 	entityName?: string;
  // }
  @Body({
    type: "object",
    properties: {
      sort: { type: "object" },
      pageName: { type: "string" },
      perPage: { type: "string" },
      page: { type: "integer" },
      count: { type: "integer" },
      entityName: { type: "string" },
      filter: { type: "object" },
    },
    required: ["perPage"],
  })
  @POST("/api/users/page", { allow: { [AclRole.GUEST]: [GRANT.EXECUTE] } })
  @Pager
  public pageUsers({ pager }: ActionProps) {
    return this.ctx.UsersService.getUsers(pager);
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
  public getUsersAdminSsr({ guard }: ActionProps) {
    if (!guard.allow(GRANT.READ)) {
      throw new AccessDeniedError();
    }
    return this.ctx.UsersService.getUsers();
  }
}
