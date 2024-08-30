import Logout from "@/components/Logout";
import { DataTable } from "@/components/orders/DataTable";
import { columns } from "@/components/orders/OrderColumns";
import Pagination from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import { getOrders } from "@/lib/actions/order.action";
import { signOut } from "next-auth/react";
import Link from "next/link";
import React from "react";

export const fetchCache = "force-no-store";
export const revalidate = 0; // seconds
export const dynamic = "force-dynamic";

export interface SearchParamsProps {
  searchParams: { [key: string]: string | undefined };
}

const Page = async ({ searchParams }: SearchParamsProps) => {
  const result = await getOrders({
    page: searchParams.page ? +searchParams.page : 1,
    filter: searchParams.filter,
    pageSize:
      searchParams.size === "all"
        ? "all"
        : searchParams.size
        ? +searchParams.size
        : 10,
  });

  return (
    <div className="px-10 py-5" dir="ltr">
      <div className="flex justify-between">
        <Link href="/admin">
        <h1 className="text-3xl font-bold">Orders</h1>
        </Link>
        <Logout />
      </div>

      <DataTable
        columns={columns}
        data={result.orders}
        searchKey="status"
        total={result.totalOrders}
      />
      <Pagination
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={result.isNext}
      />
    </div>
  );
};

export default Page;
