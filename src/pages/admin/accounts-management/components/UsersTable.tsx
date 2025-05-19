import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useFetchAccounts } from "./usersData";
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
import UserDialog from "./UserDialog";
import { Tooltip } from "@mui/material";
import useShowSnackbar from "../../../../hooks/useShowSnackbar";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import IconifyIcon from "../../../../components/base/IconifyIcon";
import useAuth from "../../../../hooks/useAuth";
import { useSocket } from "../../../../contexts/SocketContext";

export default function AccountsTable() {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const { onlineUsers } = useSocket();
  const [isEditMode, setIsEditMode] = useState(false);
  const { showSnackbar, CustomSnackbar } = useShowSnackbar();
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const { rows, loading } = useFetchAccounts(reloadTrigger);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleCreate = () => {
    setIsEditMode(false);
    setSelectedUser(null);
    setOpen(true);
  };

  const handleEdit = (user) => {
    console.log(user);
    setIsEditMode(true);
    setSelectedUser(user);
    setOpen(true);
  };

  const handleSave = async (formData) => {
    if (isEditMode) {
      if (!selectedUser && !formData) {
        return;
      }

      await axiosPrivate.patch(
        `/api/v1/users/${selectedUser.id}/partial_update_user/`,
        {
          email: formData.email,
          phone: formData.phone,
          status: formData.accountStatus,
          email_verified: formData.emailVerified,
          role: {
            name: formData.role,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setSelectedUser(null);
      showSnackbar("Updated user successfully!", "info");
      setReloadTrigger((prev) => prev + 1);
      setOpen(false);
      console.log("Updated account:", formData);
    } else {
      if (!formData) {
        return;
      }
      if (!formData.role) {
        showSnackbar("Please select a role!", "error");
        return;
      }
      try {
        const response = await axiosPrivate.post(
          `/api/v1/users/create-user/`,
          {
            full_name: formData.fullName,
            phone: formData.phone,
            address: formData.address,
            email: formData.email,
            status: formData.accountStatus,
            role: {
              name: formData.role,
            },
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Created new account:", response.data);
        setOpen(false);
        setReloadTrigger((prev) => prev + 1);
      } catch (error) {
        if (error) {
          showSnackbar("Error creating new user!", "error");
          return;
        }
      }

      showSnackbar("Created new user successfully!", "success");
    }
    setOpen(false);
  };

  const handleDelete = async (id) => {
    const idsToDelete = rowSelectionModel.length > 0 ? rowSelectionModel : [id];

    if (
      idsToDelete.length > 0 &&
      window.confirm("Are you sure want to delete selected account(s)?")
    ) {
      try {
        const response = await axiosPrivate.post(
          "/api/v1/users/delete-multiple/",
          {
            ids: idsToDelete,
          }
        );
        showSnackbar("Deleted selected account(s) successfully!", "info");
        setReloadTrigger((prev) => prev + 1);
      } catch (error) {
        console.error("Error deleting account(s):", error);
        showSnackbar("Error deleting account(s)!", "error");
      }
    }
  };

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
      flex: 0,
      minWidth: 50,
      renderCell: renderAvatar,
    },
    { field: "fullName", headerName: "Name", flex: 1, minWidth: 150 },
    { field: "email", headerName: "Email", flex: 1.5, minWidth: 200 },

    {
      field: "phone",
      headerName: "Phone",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 80,
    },
    {
      field: "createAt",
      headerName: "Join Day",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 100,
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
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      resizable: false,
      flex: 1,
      minWidth: 80,
      headerAlign: "center",
      getActions: (params) => {
        return [
          <Tooltip title="Edit">
            <GridActionsCellItem
              icon={
                <IconifyIcon
                  icon="fluent:edit-32-filled"
                  color="text.secondary"
                  sx={{
                    fontSize: "body1.fontSize",
                    pointerEvents: "none",
                  }}
                />
              }
              label="Edit"
              size="small"
              sx={{
                border: "none",
                backgroundColor: "transparent !important",
                "&:hover": {
                  backgroundColor: "transparent !important",
                },
                "&.MuiButtonBase-root": {
                  backgroundColor: "transparent !important",
                },
              }}
              onClick={() => handleEdit(params.row)}
            />
          </Tooltip>,
          Boolean(auth?.userId !== params.id) && (
            <Tooltip title="Delete" key="delete">
              <GridActionsCellItem
                icon={
                  <IconifyIcon
                    icon="mingcute:delete-3-fill"
                    color="error.main"
                    sx={{ fontSize: "body1.fontSize", pointerEvents: "none" }}
                  />
                }
                label="Delete"
                size="small"
                sx={{
                  border: "none",
                  backgroundColor: "transparent !important",
                  "&:hover": {
                    backgroundColor: "transparent !important",
                  },
                  "&.MuiButtonBase-root": {
                    backgroundColor: "transparent !important",
                  },
                }}
                onClick={() => handleDelete(params.id)}
              />
            </Tooltip>
          ),
        ].filter(Boolean);
      },
    },
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="flex-end" mb={1}>
        <IconButton color="primary" onClick={handleCreate}>
          <AddIcon />
        </IconButton>
      </Box>
      <DataGrid
        checkboxSelection
        rows={rows}
        columns={columns}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
        }
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        pageSizeOptions={[10, 15, 30]}
        disableColumnResize
        onRowSelectionModelChange={(newRowSelectionModel) => {
          setRowSelectionModel(newRowSelectionModel);
        }}
        rowSelectionModel={rowSelectionModel}
        density="standard"
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
      <CustomSnackbar />
      <UserDialog
        open={open}
        onClose={() => setOpen(false)}
        userData={selectedUser}
        onSave={handleSave}
        isEditMode={isEditMode}
      />
    </Box>
  );
}
