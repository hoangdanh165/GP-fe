import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useFetchServices } from "./servicesData";
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
import ServiceDialog from "./ServiceDialog";
import { Tooltip } from "@mui/material";
import useShowSnackbar from "../../../../hooks/useShowSnackbar";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate";
import IconifyIcon from "../../../../components/base/IconifyIcon";
import useAuth from "../../../../hooks/useAuth";
import { useSocket } from "../../../../contexts/SocketContext";

export default function ServicesTable() {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);
  const { showSnackbar, CustomSnackbar } = useShowSnackbar();
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const { rows, loading } = useFetchServices(reloadTrigger);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const handleCreate = () => {
    setIsEditMode(false);
    setSelectedService(null);
    setOpen(true);
  };

  const handleEdit = (service) => {
    console.log(service);
    setSelectedService(service);
    setIsEditMode(true);
    setOpen(true);
  };

  const handleSave = async (formData) => {
    if (!formData) return;

    const payload = {
      name: formData.name,
      description: formData.description,
      price: formData.price,
      discount: formData.discount,
      discount_from: formData.discount_from,
      discount_to: formData.discount_to,
      estimated_duration: formData.estimated_duration,

      ...(formData.new_category
        ? {
            new_category: formData.new_category,
            new_category_description: formData.new_category_description,
          }
        : formData.category
        ? { category: formData.category.id || formData.category }
        : {}),
    };

    try {
      if (isEditMode) {
        if (!selectedService) return;

        await axiosPrivate.patch(
          `/api/v1/services/${selectedService.id}/partial-update-service/`,
          payload,
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        showSnackbar("Updated service successfully!", "info");
        console.log("Updated service:", payload);
      } else {
        const response = await axiosPrivate.post(
          `/api/v1/services/create-service/`,
          payload,
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        console.log("Created new service:", response.data);
        showSnackbar("Created new service successfully!", "success");
      }

      if (formData.new_category) {
        fetchCategories();
      }
      setSelectedService(null);
      setReloadTrigger((prev) => prev + 1);
      setOpen(false);
    } catch (error) {
      console.error("Service save error:", error);
      showSnackbar("Error saving service!", "error");
    }
  };

  const handleDelete = async (id) => {
    const idsToDelete = rowSelectionModel.length > 0 ? rowSelectionModel : [id];

    if (
      idsToDelete.length > 0 &&
      window.confirm("Are you sure want to delete selected service(s)?")
    ) {
      try {
        const response = await axiosPrivate.post(
          "/api/v1/services/delete-multiple/",
          {
            ids: idsToDelete,
          }
        );
        showSnackbar("Deleted selected service(s) successfully!", "info");
        setReloadTrigger((prev) => prev + 1);
      } catch (error) {
        console.error("Error deleting service(s):", error);
        showSnackbar("Error deleting service(s)!", "error");
      }
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosPrivate.get(
        "/api/v1/services/all-categories/"
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error deleting service(s):", error);
      showSnackbar("Error deleting service(s)!", "error");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

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
    { field: "name", headerName: "Name", flex: 1.5, minWidth: 200 },
    { field: "category_name", headerName: "Category", flex: 1, minWidth: 150 },

    {
      field: "price",
      headerName: "Price",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 80,
    },
    {
      field: "discount",
      headerName: "Discount",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 80,
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
      <ServiceDialog
        open={open}
        onClose={() => setOpen(false)}
        serviceData={selectedService}
        onSave={handleSave}
        isEditMode={isEditMode}
        categoryOptions={categories}
      />
    </Box>
  );
}
