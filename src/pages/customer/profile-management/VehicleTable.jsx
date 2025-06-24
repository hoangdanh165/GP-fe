import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useFetchCars } from "./vehiclesData";
import { CircularProgress, Box, Stack, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { GridActionsCellItem } from "@mui/x-data-grid";
import VehicleDialog from "./VehicleDialog";
import { Tooltip } from "@mui/material";
import useShowSnackbar from "../../../hooks/useShowSnackbar";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import IconifyIcon from "../../../components/base/IconifyIcon";
import useAuth from "../../../hooks/useAuth";

export default function VehiclesTable() {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);
  const { showSnackbar, CustomSnackbar } = useShowSnackbar();
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const { rows, loading } = useFetchCars(reloadTrigger);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const handleCreate = () => {
    setIsEditMode(false);
    setSelectedVehicle(null);
    setOpen(true);
  };

  const handleEdit = (car) => {
    console.log(car);
    setIsEditMode(true);
    setSelectedVehicle(car);
    setOpen(true);
  };

  const handleSave = async (formData) => {
    console.log("update", formData);

    if (isEditMode) {
      if (!selectedVehicle && !formData) {
        return;
      }

      await axiosPrivate.patch(
        `/api/v1/cars/${selectedVehicle.id}/`,
        {
          model: formData.model,
          name: formData.name,
          brand: formData.brand,
          color: formData.color,
          year: formData.year,
          engine_type: formData.engineType,
          current_odometer: formData.currentOdometer,
          license_plate: formData.licensePlate,
          registration_province: formData.registrationProvince,
          vin: formData.vin,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setSelectedVehicle(null);
      showSnackbar("Updated vehicle successfully!", "success");
      setReloadTrigger((prev) => prev + 1);
      setOpen(false);
    } else {
      if (!formData) {
        return;
      }

      try {
        const response = await axiosPrivate.post(
          `/api/v1/cars/`,
          {
            name: formData.name,
            model: formData.model,
            brand: formData.brand,
            color: formData.color,
            year: formData.year,
            engine_type: formData.engineType,
            current_odometer: formData.currentOdometer,
            license_plate: formData.licensePlate,
            registration_province: formData.registrationProvince,
            vin: formData.vin,
            user: auth.userId,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Added new car:", response.data);
        setOpen(false);
        setReloadTrigger((prev) => prev + 1);
      } catch (error) {
        if (error) {
          showSnackbar("Error adding new car!", "error");
          return;
        }
      }

      showSnackbar("Added new car successfully!", "success");
    }
    setOpen(false);
  };

  const handleDelete = async (id) => {
    const idsToDelete = rowSelectionModel.length > 0 ? rowSelectionModel : [id];

    if (
      idsToDelete.length > 0 &&
      window.confirm("Are you sure want to delete selected vehicle(s)?")
    ) {
      try {
        const response = await axiosPrivate.post(
          "/api/v1/cars/delete-multiple/",
          {
            ids: idsToDelete,
          }
        );
        showSnackbar(response.data.message, "info");
        setReloadTrigger((prev) => prev + 1);
      } catch (error) {
        console.error("Error deleting vehicle(s):", error);
        showSnackbar("Error deleting vehicle(s)!", "error");
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

  const columns = [
    { field: "id", headerName: "ID", flex: 1, minWidth: 150 },
    { field: "name", headerName: "Name", flex: 1, minWidth: 150 },
    { field: "brand", headerName: "Brand", flex: 1, minWidth: 100 },

    {
      field: "licensePlate",
      headerName: "License Plate",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "createAt",
      headerName: "Added At",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 100,
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
          pagination: { paginationModel: { pageSize: 5 } },
          columns: {
            columnVisibilityModel: {
              id: false,
            },
          },
        }}
        pageSizeOptions={[5, 10, 15]}
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
      <VehicleDialog
        open={open}
        onClose={() => setOpen(false)}
        carData={selectedVehicle}
        onSave={handleSave}
        isEditMode={isEditMode}
      />
    </Box>
  );
}
