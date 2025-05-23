import { useEffect, useState } from "react";

// Hook resposnible for handling state of query params
export default function useQueryParamControls(
  initialPage = 1,
  initialLimit = 20,
) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce of search value change
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  return {
    page,
    setPage,
    limit,
    setLimit,
    search,
    setSearch,
    debouncedSearch,
  };
}
