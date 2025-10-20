export enum AclRole{
    GUEST = 'guest',
    STUDENT = 'student',
    TEACHER = 'teacher',
    ADMIN = 'admin',
  };

export enum GRANT {
    // for business logic
    READ = 'read',
    WRITE = 'write',
    EXECUTE = 'execute',

    // for http requests
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
}

export enum AuthType {
    GitHub = 'git-hub',
    Default = 'email/password',
}

export interface IIdentity  {
    id: number;
    firstname?: string;
    lastname?: string;
    role: AclRole;
    email: string;
    roles:IRoles;
    rules:IRules;
}

export interface IRoleData {
    display: string;
    url: string;
    parent?: AclRole[];
    private?: boolean;
}

export interface IRoles {
    [role: string]: IRoleData;
}

export interface IGrants {
    [role: string]: string[];
}

export interface IAllowDeny {
    allow: IGrants;
    deny?: IGrants;
}

export interface IRules {
    [resource: string]: IAllowDeny;
}


