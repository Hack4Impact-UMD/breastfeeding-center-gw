import { Client } from "@/types/ClientType";

export function processRetentionData(clientsByNumVisits: { [key: number]: Client[] }):
{
  visit: number;
  numberVisited: number;
  numberLost: number | "N/A";
  percentTotal: number;
  clientsLost: Client[];
}[] {
  const result: {
    visit: number;
    numberVisited: number;
    numberLost: number | "N/A";
    percentTotal: number;
    clientsLost: Client[];
  }[] = [];

  if (!clientsByNumVisits) {
    return result;
  }

  // Calculate total number of clients
  let totalClients = 0;
  for (let v = 1; v <= 6; v++) {
    totalClients += clientsByNumVisits[v]?.length || 0;
  }

  for (let visit = 1; visit <= 6; visit++) {
    let numberVisited = 0;
    for (let v = visit; v <= 6; v++) {
      numberVisited += clientsByNumVisits[v]?.length || 0;
    }

    let numberLost: number | "N/A" = "N/A";
    let clientsLost: Client[] = [];

    if (visit === 1) {
      numberLost = 0;
      clientsLost = [];
    } else {
      const previousVisitClients = clientsByNumVisits[visit - 1] || [];
      numberLost = previousVisitClients.length;
      
      clientsLost = [...previousVisitClients];
    }

    const percentTotal =
      totalClients > 0 ? (numberVisited / totalClients) * 100 : 0;

    result.push({
      visit,
      numberVisited,
      numberLost,
      percentTotal,
      clientsLost,
    });
  }

  return result;
}

