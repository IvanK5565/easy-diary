/* eslint-disable @typescript-eslint/no-explicit-any */
import { IIdentity } from "@/acl/types";
import { UserRole } from "@/constants";

declare module "next-auth" {
	interface User {
		id: number;
		email: string;
		password: string;
    firstname?: string;
    lastname?: string;
    role: UserRole;
	}
}
declare module "next-auth" {
	interface Session {
		accessToken:any;
		identity:IIdentity;
	}
}
declare module "next-auth/jwt" {
	interface JWT {
		user: User;
	}
}
