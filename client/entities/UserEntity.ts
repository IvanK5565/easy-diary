/* eslint-disable @typescript-eslint/no-explicit-any */
import BaseEntity, { EntityAction } from "./BaseEntity";
import { schema } from "normalizr";
import { sagaAction, reducer } from "./decorators";
import type { IClientContainer } from "../di/container";
import type { IPagerParams } from "../store/types";
import { Entities } from "../store/types";
import { signIn, signOut } from "next-auth/react";

export type UserAction = EntityAction<UserEntity>;

@reducer('users')
export default class UserEntity extends BaseEntity {
	protected schema;
	protected name: keyof Entities;

	constructor(di: IClientContainer) {
		super(di);
		this.schema = new schema.Entity("users");
		this.name = 'users';
	}

	@sagaAction
	public *fetchAllUsers() {
		yield this.xRead("/users");
	}

	@sagaAction
	public *saveUser(payload: any) {
		const id = payload.id;
		yield this.xSave(`/users${id ? '/'+id : ''}`, payload);
	}

	@sagaAction
	public *fetchUserById(payload: {id:number|string}) {
		const id = payload.id;
		if (!id) throw new Error("Id required");
		yield this.xRead(`/users/${id}`);
	}

	@sagaAction
	public *register(payload: any) {
		console.log('register', payload)
		yield this.xSave(`/register`, payload)
	}

	@sagaAction
	public *fetchUsersPage(data: IPagerParams) {
		yield this.pageEntity('/users/page', data);
	}

	@sagaAction
	public *signOut(redirect?:boolean){
		yield signOut({callbackUrl:'/signIn', redirect});
		yield this.di.persistor?.purge();
	}

	@sagaAction
	public *signIn(args:Parameters<typeof signIn>){
		yield signIn(...args);
		yield this.di.persistor?.purge();
	}
}