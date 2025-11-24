// import bcrypt from "bcrypt"
import { IAllowDeny, IRoles, IRules, AclRole } from "@/acl/types";

// export async function saltAndHashPassword(plainPassword: string) {
//   const salt = await bcrypt.genSalt(SALT_ROUNDS)
//   const hash = await bcrypt.hash(plainPassword, salt)
//   return hash
// }

export const guestRules = (rules: IRules): IRules =>
  Object.fromEntries(
    Object.entries(rules)
      .filter(
        (entry) =>
          Object.hasOwn(entry[1].allow, AclRole.GUEST) &&
          (entry[1].deny ? Object.hasOwn(entry[1].deny, AclRole.GUEST) : true),
      )
      .map(([res, grants]) => {
        const resRules: IAllowDeny = {
          allow: { [AclRole.GUEST]: grants.allow[AclRole.GUEST] },
        };
        if (grants.deny)
          resRules.deny = { [AclRole.GUEST]: grants.deny[AclRole.GUEST] };
        return [res, resRules];
      }),
  );

export const guestRulesNRoles = (
  rules: IRules,
  roles: IRoles,
): { rules: IRules; roles: IRoles } => ({
  roles: { [AclRole.GUEST]: roles[AclRole.GUEST] },
  rules: guestRules(rules),
});
