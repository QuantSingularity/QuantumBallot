/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import type { Transaction } from "@/data_types";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default function TableTransactionsBlockDetails({ detail }: any) {
  const getTransactionsDetails = (transactions: any[]): Transaction[] => {
    if (!Array.isArray(transactions)) return [];
    return transactions.map((x: any, index: number) => ({
      id: index + 1,
      transactionHash: x.transactionHash ?? "",
      identifier: x.data?.identifier ?? "",
      choiceCode: x.data?.choiceCode ?? "",
      voteTime: x.data?.voteTime ?? "",
    }));
  };

  const [data, setData] = useState<Transaction[]>([]);

  useEffect(() => {
    if (detail?.transactions) {
      setData(getTransactionsDetails(detail.transactions));
    }
  }, [detail]);

  return (
    <section>
      <DataTable columns={columns} data={data} />
    </section>
  );
}
