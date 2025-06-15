import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import PaidIcon from '@mui/icons-material/Paid';
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

  // InfoBox component for stat display
  const InfoBox = ({ icon, title, value, loading }) => (
    <Tooltip title={title} arrow>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          bgcolor: "rgba(255,255,255,0.92)",
          px: 2,
          py: 1,
          borderRadius: 2,
          boxShadow: 1,
          minWidth: 120,
          minHeight: 46,
          gap: 1.5,
        }}
      >
        <Avatar
          sx={{
            bgcolor: "primary.light",
            color: "primary.dark",
            width: 32,
            height: 32,
            fontSize: 18,
            mr: 1,
            boxShadow: 1,
          }}
        >
          {icon}
        </Avatar>
        <Box>
          <Typography
            variant="body2"
            sx={{ color: "primary.dark", fontWeight: 500, lineHeight: 1, mb: 0.2 }}
          >
            {title}
          </Typography>
          {loading ? (
            <CircularProgress color="inherit" size={16} sx={{ mt: 0.5 }} />
          ) : (
            <Typography
              variant="subtitle1"
              sx={{ color: "primary.main", fontWeight: 700 }}
            >
              {value}
            </Typography>
          )}
        </Box>
      </Box>
    </Tooltip>
  );

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
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 2,
          minHeight: 72,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            sx={{
              bgcolor: "#fff",
              color: "primary.main",
              boxShadow: 2,
              mr: 1,
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

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <InfoBox
            icon={<QueryStatsIcon />}
            title="Total registered items"
            loading={loading}
            value={
              <span>
                <b>{stats?.total ?? "--"}</b> items
              </span>
            }
          />
          <InfoBox
            icon={<PaidIcon />}
            title="Average item price"
            loading={loading}
            value={
              stats
                ? (
                  <span>
                    <b>
                      ${Number(stats.averagePrice).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </b>
                  </span>
                ) : "--"
            }
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
