import * as React from "react";
import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import MuiDrawer, { drawerClasses } from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import MenuContent from "./MenuContent";
import OptionsMenu from "./OptionsMenu";

import useAuth from "./../../../hooks/useAuth";

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: "border-box",
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: "border-box",
  },
});

export default function SideMenu() {
  const { auth } = useAuth();

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: "none", md: "block" },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: "background.paper",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mt: "calc(var(--template-frame-height, 0px) + 4px)",
          p: 1.5,
        }}
      >
        <Box
          component="img"
          src="/logo.png"
          alt="Logo"
          sx={{
            width: 150,
            height: 60,
            borderRadius: 2,
            boxShadow: 3,
            objectFit: "cover",
          }}
        />
      </Box>

      <Divider />
      <Box
        sx={{
          overflow: "auto",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <MenuContent />
      </Box>
      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: "center",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Avatar
          sizes="small"
          alt=""
          src={auth?.avatar}
          sx={{ width: 36, height: 36 }}
        />
        <Box sx={{ mr: "auto" }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 500, lineHeight: "16px" }}
          >
            {auth?.fullName}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "calc(100% - 10px)",
            }}
          >
            {auth?.email?.length > 15
              ? `${auth.email.substring(0, 15)}...`
              : auth?.email}
          </Typography>
        </Box>
        <OptionsMenu />
      </Stack>
    </Drawer>
  );
}
