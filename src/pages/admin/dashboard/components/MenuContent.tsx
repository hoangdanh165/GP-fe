import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import EventNoteRoundedIcon from "@mui/icons-material/EventNoteRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import { useNavigate, useLocation } from "react-router-dom";
import paths from "../../../../routes/paths";
import ConstructionIcon from "@mui/icons-material/Construction";
import InsertChartIcon from "@mui/icons-material/InsertChart";

const mainListItems = [
  { text: "Chat", icon: <ChatRoundedIcon />, to: paths.admin_chat },
  {
    text: "Appointments",
    icon: <EventNoteRoundedIcon />,
    to: paths.appointments_management,
  },
  {
    text: "Accounts",
    icon: <PeopleRoundedIcon />,
    to: paths.accounts_management,
  },
  {
    text: "Services",
    icon: <ConstructionIcon />,
    to: paths.services_management,
  },
  {
    text: "Invoices",
    icon: <EventNoteRoundedIcon />,
    to: paths.invoice_management_admin,
  },
  {
    text: "Statistics",
    icon: <InsertChartIcon />,
    to: paths.dashboard,
  },
];

const secondaryListItems = [
  {
    text: "Feedbacks",
    icon: <HelpRoundedIcon />,
    to: paths.feedbacks,
  },
];

export default function MenuContent() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List dense>
        {mainListItems.map((item) => (
          <ListItem key={item.to} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              selected={location.pathname === item.to}
              onClick={() => navigate(item.to)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List dense>
        {secondaryListItems.map((item) => (
          <ListItem key={item.to} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              selected={location.pathname === item.to}
              onClick={() => navigate(item.to)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
