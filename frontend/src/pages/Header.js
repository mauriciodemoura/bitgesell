import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  Chip,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import StatsService from "../services/StatsService/StatsService";

function Header() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    StatsService.getStats(controller.signal)
      .then(data => {
        if (!data) return;
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    return () => controller.abort();
  }, []);

  const isHome = location.pathname === "/" || location.pathname.startsWith("/items");

  return (
    <AppBar
      position="sticky"
      elevation={4}
      sx={{
        background: "linear-gradient(90deg, #6366f1 0%, #818cf8 100%)",
        mb: 4,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        py: 0.5,
      }}
    >
      <Toolbar sx={{
        display: "flex", justifyContent: "space-between", alignItems: "center", px: 2, minHeight: 72
      }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            sx={{
              bgcolor: "#fff",
              color: "primary.main",
              boxShadow: 2,
              mr: 1
            }}
          >
            <Inventory2OutlinedIcon fontSize="medium" />
          </Avatar>
          <Typography
            component={Link}
            to="/"
            variant="h5"
            sx={{
              color: "#fff",
              fontWeight: 700,
              letterSpacing: 1,
              textDecoration: "none",
              transition: "opacity 0.2s",
              opacity: isHome ? 1 : 0.8,
              "&:hover": { opacity: 1 },
            }}
          >
            Item Explorer
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Tooltip title="Total registered items" arrow>
            <Chip
              icon={<QueryStatsIcon />}
              label={
                loading ? (
                  <CircularProgress color="inherit" size={16} sx={{ ml: 1, mr: 1 }} />
                ) : (
                  <span>
                    <b>{stats?.total ?? "--"}</b> items
                  </span>
                )
              }
              variant="outlined"
              sx={{
                bgcolor: "rgba(255,255,255,0.85)",
                fontWeight: 600,
                fontSize: 15,
                color: "primary.dark",
                px: 1.5,
                boxShadow: 1,
                borderRadius: 2
              }}
            />
          </Tooltip>
          <Tooltip title="Average item price" arrow>
            <Chip
              label={
                loading ? (
                  <CircularProgress color="inherit" size={16} sx={{ ml: 1, mr: 1 }} />
                ) : (
                  <span>
                    Average:&nbsp;
                    <b>
                      {stats
                        ? `$${Number(stats.averagePrice).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                        : "--"}
                    </b>
                  </span>
                )
              }
              variant="outlined"
              sx={{
                bgcolor: "rgba(255,255,255,0.85)",
                fontWeight: 500,
                fontSize: 15,
                color: "primary.dark",
                px: 1.5,
                boxShadow: 1,
                borderRadius: 2
              }}
            />
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
