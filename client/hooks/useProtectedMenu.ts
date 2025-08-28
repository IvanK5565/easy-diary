import { IMenu } from "../store/types";
import { useAcl } from "./useAcl";

export function useProtectedMenu(menu: IMenu): IMenu {
  const { allow } = useAcl();
  return Object.fromEntries(
    Object.entries(menu)
      .filter(([key, value]) => (value.grant ? allow(value.grant, key) : true))
  );
}