"use client";

import { PAGE_LIMIT } from "@/app/common/constants/constants";
import { PaginationMeta } from "@/app/common/interfaces/pagination.interface";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryState, parseAsInteger } from "nuqs";

interface PaginationControlsProps {
  meta: PaginationMeta;
}

export function PaginationControls({ meta }: PaginationControlsProps) {
  const { totalPages, totalItems } = meta;

  const [curPage, setCurPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1).withOptions({ shallow: false }),
  );
  const [curLimit, setCurLimit] = useQueryState(
    "limit",
    parseAsInteger.withDefault(PAGE_LIMIT).withOptions({ shallow: false }),
  );

  const getPageNumbers = () => {
    if (totalPages <= 1) return [];

    const pages = new Set<number>();
    const siblingCount = 1;

    pages.add(1);
    pages.add(totalPages);
    pages.add(curPage);

    for (let i = curPage - siblingCount; i <= curPage + siblingCount; i++) {
      if (i > 1 && i < totalPages) {
        pages.add(i);
      }
    }

    const sortedPages = Array.from(pages).sort((a, b) => a - b);
    const result: (number | string)[] = [];

    sortedPages.forEach((current, index) => {
      if (index > 0) {
        const prev = sortedPages[index - 1];
        if (current - prev === 2) result.push(prev + 1);
        if (current - prev > 2)
          result.push(current < curPage ? "ellipsis-start" : "ellipsis-end");
      }
      result.push(current);
    });

    return result;
  };

  if (totalItems === 0 || totalPages === 0) return null;

  return (
    <div className="flex items-center justify-between gap-4">
      <Field orientation="horizontal" className="w-fit">
        <FieldLabel htmlFor="select-rows-per-page">Rows per page</FieldLabel>
        <Select
          defaultValue={curLimit.toString()}
          onValueChange={(val) => {
            setCurLimit(parseInt(val, 10));
            setCurPage(1);
          }}
        >
          <SelectTrigger className="w-20" id="select-rows-per-page">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectGroup>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
      {totalPages > 1 && (
        <Pagination className="mx-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (curPage > 1) setCurPage(curPage - 1);
                }}
                className={
                  curPage <= 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
                aria-disabled={curPage <= 1}
              />
            </PaginationItem>
            {getPageNumbers().map((pageNum, index) => {
              if (typeof pageNum === "string") {
                return (
                  <PaginationItem
                    key={`${pageNum}-${index}`}
                    className="hidden sm:block"
                  >
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }

              return (
                <PaginationItem key={pageNum} className="hidden sm:block">
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurPage(pageNum);
                    }}
                    isActive={curPage === pageNum}
                    className="cursor-pointer"
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (curPage < totalPages) setCurPage(curPage + 1);
                }}
                className={
                  curPage >= totalPages ? "pointer-events-none opacity-50" : ""
                }
                aria-disabled={curPage >= totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
