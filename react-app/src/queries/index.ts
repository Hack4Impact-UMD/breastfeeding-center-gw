import { mergeQueryKeys } from "@lukemorales/query-key-factory";
import { userQueries } from "./userQueries.ts";
import { janeQueries } from "./janeQueries.ts";
import { inviteQueries } from "./inviteQueries.ts";

const queries = mergeQueryKeys(userQueries, janeQueries, inviteQueries);

export default queries;
