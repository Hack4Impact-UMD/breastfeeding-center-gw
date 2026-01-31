import { mergeQueryKeys } from "@lukemorales/query-key-factory";
import { userQueries } from "./userQueries.ts";
import { janeQueries } from "./janeQueries.ts";
import { inviteQueries } from "./inviteQueries.ts";
import { acuityQueries } from "./acuityQueries.ts";
import { clientQueries } from "./clientQueries.ts";
import { squarespaceQueries } from "./squarespaceQueries.ts";

const queries = mergeQueryKeys(
  userQueries,
  janeQueries,
  inviteQueries,
  acuityQueries,
  clientQueries,
  squarespaceQueries
);

export default queries;
