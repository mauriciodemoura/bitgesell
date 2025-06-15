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
  Paper,
  Avatar,
  Chip,
  Fade,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InboxIcon from '@mui/icons-material/Inbox';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';

function stringToColor(string) {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    color += ('00' + ((hash >> (i * 8)) & 0xff).toString(16)).slice(-2);
  }
  return color;
}

function Items() {
  const {
    items, total, page, pageSize, q, loading, hasMore,
    setPage, fetchItems, resetAndFetch
  } = useData();

  const [search, setSearch] = useState(q);
  const listRef = useRef();

  useEffect(() => {
    const controller = new AbortController();
    fetchItems({ q, page: 1, limit: pageSize, signal: controller.signal });
    return () => controller.abort();
  }, [q, pageSize, fetchItems]);

  const handleItemsRendered = useCallback(
    ({ visibleStopIndex }) => {
      if (!loading && hasMore && visibleStopIndex >= items.length - 5) {
        fetchItems({ q, page: page + 1, limit: pageSize });
      }
    },
    [loading, hasMore, items.length, q, page, pageSize, fetchItems]
  );

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    resetAndFetch(search);
  };

  const Row = ({ index, style }) => {
    const item = items[index];
    if (!item && loading && hasMore && index === items.length) {
      return (
        <ListItem style={style} key={`skeleton-${index}`}>
          <Skeleton variant="rectangular" width="100%" height={40} animation="wave" />
        </ListItem>
      );
    }
    if (!item) return null;

    return (
      <Fade in>
        <ListItem
          style={style}
          key={item.id}
          component={Link}
          to={'/items/' + item.id}
          sx={{
            alignItems: 'center',
            gap: 2,
            borderBottom: '1px solid #ececec',
            '&:last-child': { borderBottom: 'none' },
            transition: 'background 0.2s',
            '&:hover, &:focus': {
              background: 'linear-gradient(90deg, #f5f7fa 0%, #e0e7ff 100%)',
              textDecoration: 'none',
            },
          }}
          tabIndex={0}
        >
          <Avatar
            sx={{
              bgcolor: stringToColor(item.name),
              width: 32,
              height: 32,
              fontSize: 18,
              fontWeight: 500,
              mr: 2,
            }}
          >
            {item.name?.[0]?.toUpperCase() || <InboxIcon fontSize="small" />}
          </Avatar>
          <Typography
            variant="body1"
            noWrap
            component="span"
            sx={{ flex: 1, color: 'primary.dark', fontWeight: 500 }}
          >
            {item.name}
          </Typography>
        </ListItem>
      </Fade>
    );
  };

  const renderSkeletons = () => (
    <MuiList sx={{ width: '100%', height: 400, overflow: 'hidden', bgcolor: 'background.paper' }}>
      {[...Array(pageSize)].map((_, index) => (
        <ListItem key={index} sx={{ height: 44, borderBottom: '1px solid #ececec' }}>
          <Skeleton variant="rectangular" width="90%" height={32} />
        </ListItem>
      ))}
    </MuiList>
  );

  return (
    <Box sx={{
      maxWidth: 640,
      mx: 'auto',
      p: { xs: 1, sm: 3 },
      mt: 5,
      background: 'linear-gradient(180deg, #f5f7fa 0%, #e0e7ff 100%)',
      borderRadius: 4,
    }}>
      <Paper elevation={6} sx={{
        p: { xs: 2, sm: 4 },
        borderRadius: 4,
        boxShadow: '0 6px 24px 0 rgb(76 110 245 / 10%)'
      }}>
        <Typography variant="h4" component="h1" gutterBottom
          sx={{
            mb: 4,
            textAlign: 'center',
            color: 'primary.main',
            fontWeight: 700,
            letterSpacing: 1,
          }}>
          📦 Item Explorer
        </Typography>

        <Box
          component="form"
          onSubmit={handleSearchSubmit}
          sx={{
            display: 'flex',
            mb: 3,
            gap: 1,
            alignItems: 'center',
            bgcolor: '#f3f6fd',
            borderRadius: 2,
            px: 2,
            py: 1,
            boxShadow: '0 1px 8px 0 rgb(60 100 245 / 3%)'
          }}
        >
          <TextField
            fullWidth
            label="Search item"
            variant="standard"
            size="small"
            value={search}
            onChange={e => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              disableUnderline: true,
              sx: { bgcolor: '#fff', borderRadius: 1, pl: 1, pr: 0.5, fontSize: 16 }
            }}
            sx={{
              mr: 2,
              '& .MuiInputBase-input': { py: 1.2 },
              boxShadow: '0 1px 2px 0 rgb(130 150 245 / 6%)',
            }}
            autoFocus
          />
          <Button
            variant="contained"
            type="submit"
            disabled={loading}
            sx={{
              minWidth: 88,
              fontWeight: 600,
              borderRadius: 2,
              py: 1.2,
              letterSpacing: 0.5,
              background: "linear-gradient(90deg, #6366f1 0%, #818cf8 100%)",
              boxShadow: "0 2px 8px 0 rgb(98 126 255 / 12%)",
              '&:hover': {
                background: "linear-gradient(90deg, #818cf8 0%, #6366f1 100%)",
              }
            }}
          >
            {loading ? <CircularProgress size={22} color="inherit" /> : 'Search'}
          </Button>
        </Box>

        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2, textAlign: "center" }}>
          <b>{items.length}</b> of <b>{total}</b> items displayed
        </Typography>

        {/* List - Skeleton */}
        {loading && items.length === 0 ? (
          renderSkeletons()
        ) : (
          <>
            {!items.length && q && !loading ? (
              <Box sx={{ textAlign: 'center', my: 6, color: 'text.secondary' }}>
                <SentimentDissatisfiedIcon fontSize="large" sx={{ mb: 2, color: 'grey.400' }} />
                <Typography variant="h6">
                  No items found for &quot;{q}&quot;.
                </Typography>
              </Box>
            ) : !items.length && !q && !loading ? (
              <Box sx={{ textAlign: 'center', my: 6, color: 'text.secondary' }}>
                <InboxIcon fontSize="large" sx={{ mb: 2, color: 'grey.400' }} />
                <Typography variant="h6">
                  No items available.
                </Typography>
              </Box>
            ) : (
              <MuiList sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 2, boxShadow: '0 2px 8px 0 rgb(60 60 245 / 2%)' }}>
                <List
                  ref={listRef}
                  height={400}
                  itemCount={hasMore ? items.length + 1 : items.length}
                  itemSize={54}
                  width={'100%'}
                  onItemsRendered={handleItemsRendered}
                  style={{ borderRadius: 8 }}
                >
                  {Row}
                </List>
              </MuiList>
            )}
          </>
        )}

        {/* Loading indicator for infinite scroll */}
        {loading && items.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={28} thickness={5} />
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default Items;
