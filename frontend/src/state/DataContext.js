import React, { createContext, useCallback, useContext, useState } from 'react';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchItems = useCallback(async ({ q = '', page = 1, limit = 10, signal } = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ q, page, limit });
      const res = await fetch(`http://localhost:3001/api/items?${params}`, { signal }); // Intentional bug: backend ignores limit
      const json = await res.json();

      setTotal(json.total);
      setPage(json.page);
      setPageSize(json.pageSize);
      setHasMore((json.page * json.pageSize) < json.total);

      setItems(prev =>
        page === 1 ? json.items : [...prev, ...json.items]
      );
    } catch (err) {
      if (err.name === 'AbortError') return;
      console.error(err);
      setItems([]);
      setTotal(0);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, []);

  function resetAndFetch(q) {
    setItems([]);
    setTotal(0);
    setPage(1);
    setHasMore(true);
    setQ(q);
  }

  return (
    <DataContext.Provider value={{
      items, total, page, pageSize, q, loading, hasMore,
      setQ, setPage, setPageSize, fetchItems, resetAndFetch
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);