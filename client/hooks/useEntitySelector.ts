import { useSelector } from "react-redux";
import { entitySelector } from "../store/selectors";
import { Entities } from "../store/types";

// TODO
export function useEntitySelector<K extends keyof Entities>(name: K) {
  return useSelector(entitySelector(name)) as Entities[K];
}
