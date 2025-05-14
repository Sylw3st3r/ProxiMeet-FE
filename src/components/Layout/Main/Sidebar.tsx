import React, { useState } from "react";
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
} from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { NavLink } from "react-router-dom";

const drawerWidth = 240;
const iconOnlyWidth = 60;

const navItems = [
  { label: "Dashboard", icon: <InboxIcon />, path: "/dashboard", end: true },
  {
    label: "Events",
    icon: <MailIcon />,
    path: "/dashboard/events",
    end: false,
  },
];

export default function SidebarNav() {
  const [isCollapsed, setIsCollapsed] = useState(false); // State to control the sidebar toggle

  // Toggle the sidebar between full and icon-only
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isCollapsed ? iconOnlyWidth : drawerWidth,
        flexShrink: 0,
        transition: "width 0.3s ease", // Smooth width transition
        [`& .MuiDrawer-paper`]: {
          width: isCollapsed ? iconOnlyWidth : drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#f5f5f5",
          transition: "width 0.3s ease", // Smooth paper width transition
        },
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "8px",
        }}
      >
        {/* Only show the title when not collapsed */}
        {!isCollapsed && (
          <Typography variant="h6" noWrap>
            Event planner
          </Typography>
        )}
        <IconButton onClick={toggleSidebar}>
          {isCollapsed ? <MenuIcon /> : <ArrowBackIcon />}
        </IconButton>
      </Toolbar>
      <Divider />
      <List>
        {navItems.map((item) => (
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
                    backgroundColor: isActive ? "#e0e0e0" : "inherit",
                    borderLeft: isActive
                      ? "4px solid #1976d2"
                      : "4px solid transparent",
                  }}
                >
                  <ListItemIcon
                    sx={{ color: isActive ? "#1976d2" : "inherit" }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {/* Only show the label when not collapsed */}
                  {!isCollapsed && (
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        color: isActive ? "#1976d2" : "inherit",
                        fontWeight: isActive ? "bold" : "normal",
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            )}
          </NavLink>
        ))}
      </List>
    </Drawer>
  );
}
