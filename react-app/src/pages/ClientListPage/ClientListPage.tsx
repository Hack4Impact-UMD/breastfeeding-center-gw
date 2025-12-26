import { clientListColumns } from "./ClientListTableColumns.tsx";
import { DataTable } from "@/components/DataTable/DataTable.tsx";
import Loading from "@/components/Loading.tsx";
import { Button } from "@/components/ui/button.tsx";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu.tsx";
import { useSyncAcuityClients } from "@/hooks/mutations/useSyncAcuityClients.ts";
import { useClientListRows } from "@/hooks/queries/useClientListRows.ts";
import { RefreshCwIcon } from "lucide-react";

const ClientList = () => {
  //styles
  const centerItemsInDiv = "flex justify-between items-center";
  const {
    data: clientData,
    isPending: clientsLoading,
    error,
  } = useClientListRows();

  const isLoading = clientsLoading;

  const { mutate: syncAcuity, isPending: acuityPending } = useSyncAcuityClients();

  const syncPending = acuityPending;

  // sync acuity -> upload jane: 1668
  // upload jane -> sync acuity: 1668
  // console.log("Clients: " + clientData?.length);

  return (
    <>
      <div className="flex flex-col py-14 px-10 sm:px-20">
        {/*headings*/}
        <div className={centerItemsInDiv}>
          <div className="flex flex-row">
            <h1 className="font-bold text-3xl sm:text-4xl lg:text-5xl grow">
              Client List
            </h1>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger disabled={syncPending} asChild>
              <Button variant={"yellow"}>
                <RefreshCwIcon className={`${syncPending ? 'animate-spin' : ''}`} />
                {
                  acuityPending ? (
                    "Syncing Acuity Clients..."
                  ) : (
                    "Sync Services"
                  )
                }
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white">
              <DropdownMenuLabel>Services</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => syncAcuity()}>Acuity</DropdownMenuItem>
              <DropdownMenuItem disabled>Booqable</DropdownMenuItem>
              <DropdownMenuItem disabled>Stripe</DropdownMenuItem>
              <DropdownMenuItem disabled>Square</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/*table section*/}
        <div className="lg:mt-5">
          {isLoading ? (
            <Loading />
          ) : error ? (
            <div className="flex justify-center items-center p-8">
              <p className="text-red-600">
                Failed to load Client data: {error.message}
              </p>
            </div>
          ) : (
            <DataTable
              columns={clientListColumns}
              data={clientData}
              tableType="clientList"
              pageSize={10}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ClientList;
