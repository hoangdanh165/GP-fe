import { Backdrop, CircularProgress } from "@mui/material";

const LoadingOverlay = ({ loading }) => {
  return (
    <Backdrop
      open={loading}
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: (theme) => theme.zIndex.modal + 1,
        color: "#fff",
      }}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default LoadingOverlay;
