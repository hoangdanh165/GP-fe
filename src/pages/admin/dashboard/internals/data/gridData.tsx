import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import { GridCellParams, GridRowsProp, GridColDef } from "@mui/x-data-grid";

function renderStatus(userId: string, onlineUsers: string[]) {
  const isOnline = onlineUsers?.includes(userId);
  const status = isOnline ? "Online" : "Offline";

  const colors: { [index: string]: "success" | "default" } = {
    Online: "success",
    Offline: "default",
  };

  return <Chip label={status} color={colors[status]} size="small" />;
}
export function renderAvatar(
  params: GridCellParams<{ name: string; color: string }, any, any>
) {
  if (params.value == null) {
    return "";
  }

  return (
    <Avatar
      sx={{
        backgroundColor: params.value.color,
        width: "24px",
        height: "24px",
        fontSize: "0.85rem",
      }}
    >
      {params.value.name.toUpperCase().substring(0, 1)}
    </Avatar>
  );
}

export const columns: GridColDef[] = [
  {
    field: "avatar",
    headerName: "",
    headerAlign: "center",
    align: "center",
    flex: 0,
    minWidth: 50,
    renderCell: renderAvatar,
  },

  {
    field: "full_name",
    headerName: "Full Name",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 100,
  },
  {
    field: "email",
    headerName: "Email",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 100,
  },
  {
    field: "phone",
    headerName: "Phone",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 50,
  },
  {
    field: "address",
    headerName: "Address",
    headerAlign: "center",
    align: "center",
    flex: 1,
    minWidth: 50,
  },
  {
    field: "status",
    headerName: "Status",
    headerAlign: "center",
    align: "center",
    flex: 0.5,
    minWidth: 80,
    renderCell: (params) => renderStatus(params.row.id, onlineUsers),
  },
];

export const rows: GridRowsProp = [];
