import * as React from "react";
import { useState, useEffect } from "react";
import useShowSnackbar from "../../../hooks/useShowSnackbar";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
  Avatar,
} from "@mui/material";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ChangePassword from "./ChangePassword";
import useAuth from "../../../hooks/useAuth";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

const UPDATE_PROFILE_API = "api/v1/users/update-profile/";

export default function Profile() {
  const { showSnackbar, CustomSnackbar } = useShowSnackbar();
  const { auth, setAuth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [initialUserData, setInitialUserData] = useState({});
  const [formData, setFormData] = useState({});
  const [isChanged, setIsChanged] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [openChangePassword, setOpenChangePassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setFormData((prev) => ({
        ...prev,
        avatar: URL.createObjectURL(file),
      }));
    }
  };
  useEffect(() => {
    const userData = {
      avatar: auth?.avatar || "",
      fullName: auth?.fullName || "",
      phone: auth?.phone || "",
      address: auth?.address || "",
      email: auth?.email || "",
    };
    setInitialUserData(userData);
    console.log("userData", userData);
    setFormData(userData);
  }, [auth]);

  useEffect(() => {
    const hasChanges = Object.keys(formData).some(
      (key) => formData[key] !== initialUserData[key]
    );
    setIsChanged(hasChanges);
  }, [formData]);

  const handleSave = async () => {
    if (!isChanged) return;

    const form = new FormData();
    form.append("fullName", formData.fullName);
    form.append("phone", formData.phone);
    form.append("address", formData.address);
    form.append("email", formData.email);

    if (avatarFile) {
      form.append("avatar", avatarFile);
    }

    try {
      const res = await axiosPrivate.put(UPDATE_PROFILE_API, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setAuth((prev) => ({
        ...prev,
        avatar: res.data.avatar,
        fullName: res.data.full_name,
        phone: res.data.phone,
        address: res.data.address,
        email: res.data.email,
      }));
      setInitialUserData(res.data);
      setFormData(res.data);
      showSnackbar("Profile updated successfully!", "success");
      setInitialUserData(formData);
      setIsChanged(false);
      setIsEditing(false);
    } catch (error) {
      showSnackbar("Failed to update profile. Please try again.", "error");
    }
  };

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "100%",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h5" mb={2} textAlign="left">
          Personal Information
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 3,
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar
            src={formData.avatar}
            alt="User Avatar"
            sx={{ width: 100, height: 100, mb: 2 }}
          />
          {isEditing && (
            <IconButton component="label">
              <EditIcon fontSize="small" />
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={handleAvatarChange}
              />
            </IconButton>
          )}
        </Box>

        <Grid container spacing={3}>
          {isEditing ? (
            <>
              {/* <Grid item xs={12}>
                <Button component="label" variant="outlined" fullWidth>
                  Upload New Avatar
                  <input
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={handleAvatarChange}
                  />
                </Button>
              </Grid> */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between">
                  <Button
                    color="secondary"
                    onClick={() => {
                      setFormData(initialUserData);
                      setIsEditing(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    onClick={handleSave}
                    disabled={!isChanged}
                  >
                    Save
                  </Button>
                </Box>
              </Grid>
            </>
          ) : (
            <>
              <Grid item xs={12}>
                <Typography>
                  <strong>Full Name:</strong> {formData.fullName}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography>
                  <strong>Phone:</strong>{" "}
                  {formData.phone ? formData.phone : "N/A"}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography>
                  <strong>Address:</strong>{" "}
                  {formData.address ? formData.address : "N/A"}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography>
                  <strong>Email:</strong> {formData.email}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" justifyContent="flex-end">
                  <Button
                    color="primary"
                    onClick={() => setOpenChangePassword(true)}
                  >
                    Change Password
                  </Button>
                  <Button color="primary" onClick={() => setIsEditing(true)}>
                    Edit
                  </Button>
                </Box>
              </Grid>
            </>
          )}
        </Grid>
      </Paper>
      <ChangePassword
        open={openChangePassword}
        onClose={() => setOpenChangePassword(false)}
      />
      <CustomSnackbar />
    </Box>
  );
}
