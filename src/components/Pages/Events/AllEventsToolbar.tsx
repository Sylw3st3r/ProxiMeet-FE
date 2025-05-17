import {
  Box,
  Button,
  MenuItem,
  Pagination,
  Select,
  TextField,
  Toolbar,
  useTheme,
} from "@mui/material";

export default function AllEventsToolbar({
  search,
  setSearch,
  page,
  setPage,
  totalPages,
  limit,
  setLimit,
  children,
}: any) {
  const theme = useTheme();

  return (
    <Toolbar
      sx={{
        borderBottom: `1px solid ${theme.palette.divider}`,
        position: "sticky",
        top: 0,
        zIndex: 200,
        bgcolor: theme.palette.background.paper,
        flexWrap: "wrap",
      }}
    >
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
    </Toolbar>
  );
}
