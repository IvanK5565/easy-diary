import BaseController from "./BaseController";
import { type ActionProps } from "@/types";
import { Body, Entity, GET, POST, Query, USE } from "./decorators";
import { authMiddleware } from "../lib/authMiddleware";
import { GRANT, AclRole } from "@/acl/types";
import { AccessDeniedError } from "./exceptions";
import { decimalPattern } from "@/constants";

@Entity("MessageEntity")
export default class MessagesController extends BaseController {
  @Body({
    type: "object",
    properties: {
      senderId: { type: "integer" },
      receiverId: { type: "integer" },
      body: { type: "string" },
    },
    required: ["senderId", "receiverId", "body"],
  })
  @POST("/api/messages", { allow: { [AclRole.STUDENT]: [GRANT.WRITE] } })
  @USE(authMiddleware)
  public saveMessage({ body, guard }: ActionProps) {
    if (!guard.allow(GRANT.WRITE)) {
      throw new AccessDeniedError();
    }
    return this.ctx.MessagesService.save(body);
  }

  @Query({
    type: "object",
    properties: {
      userA: { type: "string", pattern: decimalPattern },
      userB: { type: "string", pattern: decimalPattern },
    },
    required: ['userA', 'userB'],
  })
  @GET("/api/messages", {
    allow: {
      [AclRole.STUDENT]: [GRANT.READ],
    },
  })
  @USE(authMiddleware)
  public getChat({ query, guard }: ActionProps) {
    const { userA, userB } = query!;
    if (!guard.allow(GRANT.READ)) {
      throw new AccessDeniedError();
    }

    return this.ctx.MessagesService.getChat(Number(userA), Number(userB)).then((r) => {
      console.log('res: ', r);
      return r;
    });
  }
}
