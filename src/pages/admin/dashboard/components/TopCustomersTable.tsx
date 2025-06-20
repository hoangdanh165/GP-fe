import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useFetchTopCustomers } from "./topCustomersData";
import { CircularProgress, Box, Stack, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import AddIcon from "@mui/icons-material/Add";
import {
  GridCellParams,
  GridRowsProp,
  GridColDef,
  GridActionsCellItem,
} from "@mui/x-data-grid";
import { Card, Typography } from "@mui/material";
import useShowSnackbar from "../../../../hooks/useShowSnackbar";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import { useSocket } from "../../../../contexts/SocketContext";

export default function TopCustomersTable() {
  const axiosPrivate = useAxiosPrivate();
  const { onlineUsers } = useSocket();
  const { showSnackbar, CustomSnackbar } = useShowSnackbar();
  const { rows, loading } = useFetchTopCustomers();

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "400px",
          width: "100%",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  function renderStatus(userId: string, onlineUsers: string[]) {
    const isOnline = onlineUsers?.includes(userId);
    const status = isOnline ? "Online" : "Offline";

    const colors: { [index: string]: "success" | "default" } = {
      Online: "success",
      Offline: "default",
    };

    return <Chip label={status} color={colors[status]} size="small" />;
  }

  function renderNOOfAppointments(params: GridCellParams<number>) {
    const count = params.value ?? 0;

    return (
      <Chip
        label={`${count}`}
        size="small"
        color={count > 0 ? "primary" : "default"}
        variant="outlined"
      />
    );
  }

  function renderAvatar(params: GridCellParams<{ avatar: string }, any, any>) {
    if (params.value == null) {
      return "";
    }
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Avatar
          sx={{
            width: "24px",
            height: "24px",
            fontSize: "0.85rem",
            backgroundColor: "gray",
          }}
          src={params.value}
        >
          {!params.value && params.value.substring(0, 1).toUpperCase()}{" "}
        </Avatar>
      </div>
    );
  }

  const columns: GridColDef[] = [
    {
      field: "avatar",
      headerName: "",
      headerAlign: "center",
      align: "center",
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
      field: "appointment_count",
      headerName: "NO. of Appointments",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 50,
      renderCell: renderNOOfAppointments,
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

  return (
    <Card variant="outlined" sx={{ height: "100%", flexGrow: 1 }}>
      <Typography component="h2" variant="subtitle2" gutterBottom>
        Top Customers
      </Typography>
      <DataGrid
        checkboxSelection
        rows={rows}
        columns={columns}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
        }
        initialState={{
          pagination: { paginationModel: { pageSize: 20 } },
        }}
        pageSizeOptions={[10, 20, 50]}
        disableColumnResize
        density="compact"
        slotProps={{
          filterPanel: {
            filterFormProps: {
              logicOperatorInputProps: {
                variant: "outlined",
                size: "small",
              },
              columnInputProps: {
                variant: "outlined",
                size: "small",
                sx: { mt: "auto" },
              },
              operatorInputProps: {
                variant: "outlined",
                size: "small",
                sx: { mt: "auto" },
              },
              valueInputProps: {
                InputComponentProps: {
                  variant: "outlined",
                  size: "small",
                },
              },
            },
          },
        }}
      />
    </Card>
  );
}
