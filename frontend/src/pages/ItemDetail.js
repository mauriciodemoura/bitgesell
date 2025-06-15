import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, CircularProgress, Alert, Button, Avatar, Skeleton, Stack
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import ItemDetailService from '../services/ItemsService/ItemsDetailService';

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

function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setNotFound(false);

    ItemDetailService.getItemById(id, controller.signal)
      .then(data => {
        if (!data) return;
        setItem(data);
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });

    return () => controller.abort();
  }, [id]);

  // Skeleton for loading state
  if (loading) {
    return (
      <Box
        sx={{
          maxWidth: 480,
          mx: 'auto',
          mt: 6,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: 'linear-gradient(180deg, #f5f7fa 0%, #e0e7ff 100%)',
          borderRadius: 4,
          boxShadow: 6
        }}
      >
        <Skeleton variant="circular" width={88} height={88} sx={{ mb: 3 }} />
        <Skeleton variant="text" width={220} height={38} sx={{ mb: 2 }} />
        <Skeleton variant="text" width={180} height={28} sx={{ mb: 2 }} />
        <Skeleton variant="text" width={120} height={24} sx={{ mb: 4 }} />
        <Skeleton variant="rectangular" width={120} height={42} sx={{ borderRadius: 2 }} />
      </Box>
    );
  }

  // Empty state
  if (notFound) {
    return (
      <Box sx={{
        p: 4, maxWidth: 400, mx: 'auto', mt: 8,
        background: 'linear-gradient(180deg, #f8fafc 0%, #e5e7eb 100%)',
        borderRadius: 4, boxShadow: 3,
        textAlign: 'center'
      }}>
        <Alert severity="error" icon={false} sx={{ mb: 3, fontWeight: 600, fontSize: 18 }}>
          Item not found.
        </Alert>
        <Button
          variant="contained"
          size="large"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{
            borderRadius: 2, mt: 2,
            px: 4, fontWeight: 600, letterSpacing: 0.5
          }}
        >
          Back
        </Button>
      </Box>
    );
  }

  const avatarBg = item?.name ? stringToColor(item.name) : "#999";
  const avatarLabel = item?.name ? item.name[0].toUpperCase() : <Inventory2OutlinedIcon fontSize="large" />;

  return (
    <Box sx={{
      maxWidth: 520,
      mx: 'auto',
      mt: 7,
      p: { xs: 1, sm: 2 },
      background: 'linear-gradient(180deg, #f5f7fa 0%, #e0e7ff 100%)',
      borderRadius: 4
    }}>
      <Paper sx={{
        p: { xs: 2, sm: 4 },
        borderRadius: 4,
        boxShadow: '0 4px 28px 0 rgb(76 110 245 / 12%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <Avatar
          sx={{
            width: 88,
            height: 88,
            fontSize: 40,
            fontWeight: 700,
            bgcolor: avatarBg,
            color: '#fff',
            mb: 2,
            boxShadow: 2,
          }}
          aria-label={item?.name}
        >
          {avatarLabel}
        </Avatar>
        <Typography
          variant="h3"
          component="h2"
          gutterBottom
          sx={{ mb: 2, color: "primary.main", fontWeight: 700, textAlign: "center" }}
        >
          {item.name}
        </Typography>
        <Stack spacing={2} sx={{ width: "100%", maxWidth: 320, mb: 3 }}>
          <Box sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1
          }}>
            <Typography variant="subtitle1" color="text.secondary" fontWeight={500}>
              Category:
            </Typography>
            <Typography variant="subtitle1" fontWeight={600}>
              {item.category}
            </Typography>
          </Box>
          <Box sx={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1
          }}>
            <Typography variant="subtitle1" color="text.secondary" fontWeight={500}>
              Price:
            </Typography>
            <Typography variant="subtitle1" fontWeight={600}>
              {item.price ? `$${Number(item.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : "-"}
            </Typography>
          </Box>
        </Stack>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => navigate(-1)}
          startIcon={<ArrowBackIcon />}
          sx={{
            borderRadius: 2,
            fontWeight: 600,
            px: 5,
            py: 1.5,
            letterSpacing: 0.5,
            boxShadow: 1,
            mt: 1
          }}
        >
          Back
        </Button>
      </Paper>
    </Box>
  );
}

export default ItemDetail;
