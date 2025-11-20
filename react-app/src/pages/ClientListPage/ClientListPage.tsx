import { clientListColumns } from "./ClientListTableColumns.tsx";
import { DataTable } from "@/components/DataTable/DataTable.tsx";
import Loading from "@/components/Loading.tsx";
import { useClientListRows } from "@/hooks/queries/useClientListRows.ts";

const ClientList = () => {
  //styles
  const centerItemsInDiv = "flex justify-between items-center";
  const {
    data: clientData,
    isPending: clientsLoading,
    error,
  } = useClientListRows();

  const isLoading = clientsLoading;

  return (
    <>
      <div className="flex flex-col py-14 px-10 sm:px-20">
        {/*headings*/}
        <div className={centerItemsInDiv}>
          <div>
            <h1 className="font-bold text-4xl lg:text-5xl">Client List</h1>
          </div>
        </div>

        {/*table section*/}
        <div className="mt-5">
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
