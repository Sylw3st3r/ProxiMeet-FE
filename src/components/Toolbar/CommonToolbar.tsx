import { Box, MenuItem, Pagination, Select, TextField } from "@mui/material";
import { ReactNode } from "react";
import BlankToolbar from "./BlankToolbar";

export default function CommonToolabr({
  search,
  setSearch,
  page,
  setPage,
  totalPages = 1,
  limit,
  setLimit,
  children,
}: {
  search: string;
  setSearch: (value: string) => void;
  page: number;
  setPage: (value: number) => void;
  totalPages?: number;
  limit: number;
  setLimit: (value: number) => void;
  children?: ReactNode;
}) {
  return (
    <BlankToolbar>
      <TextField
        size="small"
        value={search}
        onChange={(event) => {
          setSearch(event.target.value);
          setPage(1);
        }}
      />{" "}
      <Box sx={{ flex: 1 }} />
      {children}
      <Box sx={{ flex: 1 }} />
      <Select
        value={limit}
        onChange={(event) => {
          setLimit(event.target.value);
          setPage(1);
        }}
        autoWidth
        size="small"
      >
        <MenuItem value={20}>20</MenuItem>
        <MenuItem value={50}>50</MenuItem>
        <MenuItem value={100}>100</MenuItem>
      </Select>
      <Pagination
        count={totalPages ? totalPages : 0}
        page={page}
        onChange={(event, value) => setPage(value)}
        variant="outlined"
        color="primary"
      />
    </BlankToolbar>
  );
}
