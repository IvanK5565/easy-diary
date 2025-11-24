import { HYDRATE } from "next-redux-wrapper";
import { Entities, EntitiesAction } from "./types";
import { ADD_ENTITIES } from "./actionTypes";

const initialState = {};

function entityReducer<K extends keyof Entities>(collectionName: K) {
  return (
    collection: Entities[K] = initialState,
    action: EntitiesAction,
  ): Entities[K] => {
    switch (action.type) {
      case HYDRATE: {
        // @ts-expect-error HYDRATE is exclusive
        const newEntities = action.payload?.entities?.[collectionName];
        return { ...collection, ...newEntities };
      }
      case ADD_ENTITIES: {
        if (!action?.payload?.[collectionName]) {
          return collection;
        }
        const newEntities = action.payload[collectionName];
        return { ...collection, ...newEntities };
      }
      case "CLEAR": {
        return initialState;
      }
    }

    return collection;
  };
}
export default entityReducer;
