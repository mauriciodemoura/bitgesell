import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useData } from '../state/DataContext';
import { Link } from 'react-router-dom';
import { FixedSizeList as List } from 'react-window';

// MUI Components
import {
  Box,
  TextField,
  Button,
  Typography,
  List as MuiList,
  ListItem,
  CircularProgress,
  Skeleton,
  Paper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

function Items() {
  const {
    items, total, page, pageSize, q, loading, hasMore,
    setPage, fetchItems, resetAndFetch
  } = useData();

  const [search, setSearch] = useState(q);
  const listRef = useRef();

  // Initial fetch on component mount or search term/page size change
  useEffect(() => {
    const controller = new AbortController();
    fetchItems({ q, page: 1, limit: pageSize, signal: controller.signal });
    return () => controller.abort();
  }, [q, pageSize, fetchItems]);

  const handleItemsRendered = useCallback(
    ({ visibleStopIndex }) => {
      // Fetch more items if close to the end and not already loading, and there are more items to load
      if (!loading && hasMore && visibleStopIndex >= items.length - 5) {
        // We call fetchItems with the next page directly.
        // setPage will be handled by the DataContext after a successful fetch
        fetchItems({ q, page: page + 1, limit: pageSize });
      }
    },
    [loading, hasMore, items.length, q, page, pageSize, fetchItems]
  );

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Reset page to 1 and trigger new fetch with the search term
    resetAndFetch(search);
  };

  // Row renderer for FixedSizeList
  const Row = ({ index, style }) => {
    const item = items[index];

    // Skeleton for loading more items at the bottom of the list
    if (!item && loading && hasMore && index === items.length) {
      return (
        <ListItem style={style} key={`skeleton-${index}`}>
          <Skeleton variant="text" width="80%" height={24} />
        </ListItem>
      );
    }
    // Handle the case where item is undefined but it's not the loading skeleton slot
    if (!item) return null;

    return (
      <ListItem
        style={style}
        key={item.id}
        sx={{
          borderBottom: '1px solid #e0e0e0',
          '&:last-child': { borderBottom: 'none' },
          '&:hover': { backgroundColor: 'action.hover' },
          transition: 'background-color 0.3s ease-in-out',
        }}
        component={Link} // Use ListItem as a Link component
        to={'/items/' + item.id}
      >
        <Typography variant="body1" component="span" sx={{ color: 'primary.main', textDecoration: 'none' }}>
          {item.name}
        </Typography>
      </ListItem>
    );
  };

  // Skeleton placeholders for initial loading state
  const renderSkeletons = () => (
    <MuiList sx={{ width: '100%', height: 400, overflow: 'hidden', bgcolor: 'background.paper' }}>
      {[...Array(pageSize)].map((_, index) => (
        <ListItem key={index} sx={{ height: 44, borderBottom: '1px solid #e0e0e0' }}>
          <Skeleton variant="text" width="90%" height={24} />
        </ListItem>
      ))}
    </MuiList>
  );

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 2, mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3, textAlign: 'center', color: 'primary.dark' }}>
          Item List
        </Typography>

        {/* Search Input */}
        <Box component="form" onSubmit={handleSearchSubmit} sx={{ display: 'flex', mb: 3, gap: 1 }}>
          <TextField
            fullWidth
            label="Search items..."
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              endAdornment: (
                <SearchIcon color="action" />
              ),
            }}
          />
          <Button
            variant="contained"
            type="submit"
            disabled={loading}
            sx={{ minWidth: 'auto', px: 3 }}
          >
            Search
          </Button>
        </Box>

        {/* Info Text */}
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
          Showing {items.length} of {total} items
        </Typography>

        {/* Conditional Rendering for List or Skeletons */}
        {loading && items.length === 0 ? ( // Show full skeletons only if no items are loaded yet
          renderSkeletons()
        ) : (
          <>
            {!items.length && q && !loading ? (
              <Typography variant="body1" sx={{ textAlign: 'center', my: 4, color: 'text.secondary' }}>
                No items found for "{q}".
              </Typography>
            ) : !items.length && !q && !loading ? (
              <Typography variant="body1" sx={{ textAlign: 'center', my: 4, color: 'text.secondary' }}>
                No items available.
              </Typography>
            ) : (
              <MuiList sx={{ width: '100%', bgcolor: 'background.paper' }}>
                <List
                  ref={listRef}
                  height={400}
                  itemCount={hasMore ? items.length + 1 : items.length}
                  itemSize={44}
                  width={'100%'}
                  onItemsRendered={handleItemsRendered}
                >
                  {Row}
                </List>
              </MuiList>
            )}
          </>
        )}

        {/* Loading indicator for infinite scroll */}
        {loading && items.length > 0 && ( // Show spinner only if items are already loaded and more are loading
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default Items;