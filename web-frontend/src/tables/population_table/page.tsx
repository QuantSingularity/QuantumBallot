/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { GLOBAL_VARIABLES } from "@/global/globalVariables";
import { type Citizen, columns } from "./columns";
import { DataTable } from "./data-table";

function TablePopulation({ toast }: any) {
  const [data, setData] = useState<Citizen[]>([]);

  const onLoadPopulationData = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://${GLOBAL_VARIABLES.LOCALHOST}/api/committee/registers`,
      );
      const resData = response.data;
      if (resData?.registers) {
        let newData = resData.registers.map((element: any) => ({
          name: element.name,
          operation: "",
          electoralId: element.electoralId,
          email: element.email,
          address: element.address,
          province: element.province,
          password: element.password,
          status: element.status,
          verification: element.verification,
          otp: element.otp,
          toast,
          setData,
        }));

        newData.sort((a: any, b: any) =>
          a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
        );

        newData = newData.map((element: any, index: number) => ({
          id: index + 1,
          ...element,
        }));

        setData([...newData]);
      }
    } catch (error) {
      console.error(error);
    }
  }, [toast]);

  useEffect(() => {
    onLoadPopulationData();
  }, [onLoadPopulationData]);

  return (
    <section>
      <div className="py-4">
        <Button className="max-w-lg" onClick={onLoadPopulationData}>
          Load / Refresh Data
        </Button>
      </div>
      <DataTable columns={columns} data={data} />
    </section>
  );
}

export default TablePopulation;
