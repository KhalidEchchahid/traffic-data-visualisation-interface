"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery } from "@/lib/utils";
import Link from "next/link";

const filters = [
  {
    value: "en attente",
    name: "En attente",
  }, // Pending
  { value: "confirme", name: "Confirmé" }, // Confirmed
  {
    value: "pas de reponse",
    name: "Pas de réponse",
  }, // No reply
  { value: "Annule", name: "Annulé" }, // Canceled
];

const Filter = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const paramFilter = searchParams.get("filter");

  const handelUpdateParams = (value: string) => {
    if (value === "all") {
      router.push("/admin", { scroll: false });
      return;
    }
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "filter",
      value,
    });
    router.push(newUrl, { scroll: false });
  };

  return (
    <div className={`relative `}>
      <Select
        onValueChange={handelUpdateParams}
        defaultValue={paramFilter || undefined}
      >
        <SelectTrigger
          className={`body-regular light-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5`}
        >
          <div className="line-clamp-1 flex-1 text-left">
            <SelectValue placeholder="Select a Filter" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">Tout</SelectItem>
            {filters.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Filter;
