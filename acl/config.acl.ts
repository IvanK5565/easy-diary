if (typeof document !== "undefined") {
  throw new Error(
    "Do not import `config.js` from inside the client-side code.",
  );
}

import { AclResourses } from "@/constants";
import { AclRole, GRANT, IIdentity, IRoles, IRules } from "./types";

export const SUPER = [AclRole.ADMIN];

export const guestRole: IRoles = {
  [AclRole.GUEST]: {
    display: "guest",
    url: "",
  },
};

export const roles: IRoles = {
  ...guestRole,

  [AclRole.STUDENT]: {
    display: "student",
    parent: [AclRole.GUEST],
    url: "/",
  },

  [AclRole.TEACHER]: {
    display: "teacher",
    parent: [AclRole.STUDENT],
    url: "/",
  },

  [AclRole.ADMIN]: {
    display: "admin",
    parent: [AclRole.TEACHER],
    url: "/",
    private: true,
  },
};

export const guestRules: IRules = {
  "/signIn": {
    allow: {
      [AclRole.GUEST]: [GRANT.READ, GRANT.WRITE],
    },
  },
};

export const rules: IRules = {
  ...guestRules,

  [AclResourses.CAN_ADD_CLASS]: {
    allow: {
      [AclRole.TEACHER]: [GRANT.WRITE, GRANT.READ],
    },
  },
  [AclResourses.CAN_EDIT_CLASS]: {
    allow: {
      [AclRole.TEACHER]: [GRANT.WRITE, GRANT.READ],
    },
  },
  [AclResourses.CAN_ADD_STUDENT]: {
    allow: {
      [AclRole.TEACHER]: [GRANT.WRITE, GRANT.READ],
    },
  },
  [AclResourses.CAN_EDIT_STUDENT]: {
    allow: {
      [AclRole.TEACHER]: [GRANT.WRITE, GRANT.READ],
    },
  },
  [AclResourses.CAN_SELECT_CLASS]: {
    allow: {
      [AclRole.TEACHER]: [GRANT.WRITE, GRANT.READ],
    },
  },
  [AclResourses.CAN_SELECT_STUDENT]: {
    allow: {
      [AclRole.TEACHER]: [GRANT.WRITE, GRANT.READ],
    },
  },
  [AclResourses.CAN_ADD_HOMEWORK]: {
    allow: {
      [AclRole.TEACHER]: [GRANT.WRITE, GRANT.READ],
    },
  },
  [AclResourses.CAN_ADD_MARK]: {
    allow: {
      [AclRole.TEACHER]: [GRANT.WRITE, GRANT.READ],
    },
  },
  /*****************************************************************************************
   ************************************* Other Resources ********************************
   ******************************************************************************************/

  /*****************************************************************************************
   ************************************* MENU and navigation ********************************
   ******************************************************************************************/

  // "NavigationMenu/*/*/*": {
  //     allow: {
  //         [AclRole.ADMIN]: [GRANT.READ]
  //     }
  // },
  "Navigation/contacts": {
    allow: {
      [AclRole.STUDENT]: [GRANT.READ],
    },
  },
  "Navigation/addSubject": {
    allow: {
      [AclRole.TEACHER]: [GRANT.READ],
    },
  },
  "Navigation/classes": {
    allow: {
      [AclRole.TEACHER]: [GRANT.READ],
    },
  },

  /*****************************************************************************************
   ************************************* ROUTES / URLs resources ****************************
   ******************************************************************************************/
};

export const GUEST_IDENTITY: IIdentity = {
  email: "guest",
  id: 0,
  role: AclRole.GUEST,
  roles: guestRole,
  rules: guestRules,
};
