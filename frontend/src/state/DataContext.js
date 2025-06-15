import React, { createContext, useCallback, useContext, useState } from 'react';
import ItemsService from "../services/ItemsService/ItemsService";

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
      const data = await ItemsService.getItems({ q, page, limit, signal });
      if (!data) return;

      setTotal(data.total);
      setPage(data.page);
      setPageSize(data.pageSize);
      setHasMore((data.page * data.pageSize) < data.total);

      setItems(prev =>
        page === 1 ? data.items : [...prev, ...data.items]
      );
    } catch (err) {
      if (err.name === 'AbortError' || err.code === 'ERR_CANCELED') return;
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