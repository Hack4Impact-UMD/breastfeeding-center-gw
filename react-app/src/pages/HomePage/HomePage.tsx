import { useJaneConsultationsCount } from "@/hooks/queries/useJaneConsultationsCount"
import { useNewJaneClientsCount } from "@/hooks/queries/useNewJaneClientsCount"
import { DateTime } from "luxon"
import { useMemo } from "react"

export default function HomePage() {
  const startDate = useMemo(() => DateTime.now().minus({ month: 5 }), []);
  const endDate = useMemo(() => DateTime.now(), []);
  const { data: newClients, isPending: clientCountPending, error: clientCountError } = useNewJaneClientsCount(startDate, endDate);
  const { data: apptsCount, isPending: apptsCountPending, error: apptsCountError } = useJaneConsultationsCount(startDate, endDate);

  return <div className="p-4">
    <p>Home</p>
    {clientCountPending ? (
      <p>Loading...</p>
    ) : clientCountError ? (
      <p>Failed to fetch new clients</p>
    ) : (
      <p>New Jane clients in last month: {newClients}</p>
    )
    }

    {apptsCountPending ? (
      <p>Loading...</p>
    ) : apptsCountError ? (
      <p>Failed to fetch new clients</p>
    ) : (
      <p>Jane consultations in last month: {apptsCount}</p>
    )
    }
  </div>
}
