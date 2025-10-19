import { mergeQueryKeys } from "@lukemorales/query-key-factory"
import { userQueries } from "./userQueries.ts"
import { janeQueries } from "./janeQueries.ts";

const queries = mergeQueryKeys(userQueries, janeQueries);

export default queries;
