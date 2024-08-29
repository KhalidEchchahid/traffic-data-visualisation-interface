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

const filters = [
  {
    value: "all",
    label: "Tout",
  },
  {
    value: 10,
    label: "10",
  },
  {
    value: 20,
    label: "20",
  },
];

const SelectPageSize = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const paramFilter = searchParams.get("size");

  const handelUpdateParams = (value: string) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "size",
      value,
    });
    router.push(newUrl, { scroll: false });
  };

  return (
    <div className="relative">
      <Select
        onValueChange={handelUpdateParams}
        defaultValue={paramFilter || undefined}
      >
         <SelectTrigger
          className={`body-regular light-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5`}
        >
          <div className="line-clamp-1 flex-1 text-left">
            <SelectValue placeholder="page size" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {filters.map((item) => (
              <SelectItem key={item.value} value={String(item.value)}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectPageSize;
