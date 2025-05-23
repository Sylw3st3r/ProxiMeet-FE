import { useContext, useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Typography,
  ListItemButton,
  IconButton,
  Box,
  useTheme,
  Badge,
} from "@mui/material";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  CalendarMonth,
  ExitToApp,
  ListAltSharp,
  PlaylistAddSharp,
  TrackChanges,
} from "@mui/icons-material";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../../authentication/auth-context";
import { useTranslation } from "react-i18next";
import { LanguageMenu } from "../../Settings/LanguageMenu";
import ThemeSwitch from "../../Settings/ThemeSwitch";
import { useQuery } from "@tanstack/react-query";
import { getUnseenNotificationsCount } from "../../../vendor/notifications-vendor";

const drawerWidth = 280;
const iconOnlyWidth = 60;

const navItems = (unseenNotificationsCount: number | undefined) => [
  {
    label: "sidenav.dashboard",
    icon: <DashboardIcon />,
    path: "/dashboard",
    end: true,
  },
  {
    label: "sidenav.all",
    icon: <ListAltSharp />,
    path: "/dashboard/events",
    end: false,
  },
  {
    label: "sidenav.own",
    icon: <PlaylistAddSharp />,
    path: "/dashboard/user-events",
    end: false,
  },
  {
    label: "sidenav.near",
    icon: <TrackChanges />,
    path: "/dashboard/near-you",
    end: false,
  },
  {
    label: "sidenav.schedule",
    icon: <CalendarMonth />,
    path: "/dashboard/schedule",
    end: false,
  },
  {
    label: "sidenav.inbox",
    icon: unseenNotificationsCount ? (
      <Badge badgeContent={unseenNotificationsCount} color="secondary">
        <MailIcon />
      </Badge>
    ) : (
      <MailIcon />
    ),
    path: "/dashboard/inbox",
    end: false,
  },
];

export default function SidebarNav() {
  const { logOut } = useContext(AuthContext);
  const theme = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { t } = useTranslation();

  // Polling every 30s to check if we have something new in inbox
  // At the beggining used websockets to inform user about new notification
  // Decided that it was an overkill
  const { data } = useQuery({
    queryKey: ["unseen-notifications-count"],
    queryFn: ({ signal }) => getUnseenNotificationsCount(signal),
    refetchInterval: 30000,
  });

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isCollapsed ? iconOnlyWidth : drawerWidth,
        flexShrink: 0,
        transition: "width 0.3s ease",
        [`& .MuiDrawer-paper`]: {
          width: isCollapsed ? iconOnlyWidth : drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "background.paper",
          transition: "width 0.3s ease",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        },
      }}
    >
      <Box>
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Typography
            variant="h6"
            noWrap
            sx={{
              opacity: isCollapsed ? 0 : 1,
              transition: "opacity 0.3s ease",
              whiteSpace: "nowrap",
              overflow: "hidden",
              width: isCollapsed ? 0 : "auto",
            }}
          >
            ProxiMeet
          </Typography>
          <IconButton onClick={toggleSidebar}>
            {isCollapsed ? <MenuIcon /> : <ArrowBackIcon />}
          </IconButton>
        </Toolbar>
        <Divider />
        <List>
          {navItems(data).map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              end={item.end}
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
            >
              {({ isActive }) => (
                <ListItem disablePadding>
                  <ListItemButton
                    sx={{
                      backgroundColor: isActive
                        ? theme.palette.action.selected
                        : "inherit",
                      borderLeft: isActive
                        ? `4px solid ${theme.palette.primary.main}`
                        : "4px solid transparent",
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 40,
                        color: isActive
                          ? theme.palette.primary.main
                          : "inherit",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={t(item.label)}
                      primaryTypographyProps={{
                        color: isActive
                          ? theme.palette.primary.main
                          : "inherit",
                        fontWeight: isActive ? "bold" : "normal",
                      }}
                      sx={{
                        opacity: isCollapsed ? 0 : 1,
                        transition: "opacity 0.3s ease",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        width: isCollapsed ? 0 : "auto",
                        ml: isCollapsed ? 0 : 1,
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              )}
            </NavLink>
          ))}
        </List>
      </Box>

      {/* Logout section */}
      <List
        sx={{
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <LanguageMenu marginLeft={1.5} />
          <ThemeSwitch />
        </Box>
        <ListItem disablePadding>
          <ListItemButton
            onClick={logOut}
            sx={{
              backgroundColor: "inherit",
              borderLeft: "4px solid transparent",
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
              <ExitToApp />
            </ListItemIcon>
            <ListItemText
              primary={t("sidenav.logout")}
              primaryTypographyProps={{
                color: "inherit",
                fontWeight: "normal",
              }}
              sx={{
                opacity: isCollapsed ? 0 : 1,
                transition: "opacity 0.3s ease",
                whiteSpace: "nowrap",
                overflow: "hidden",
                width: isCollapsed ? 0 : "auto",
                ml: isCollapsed ? 0 : 1,
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
}
