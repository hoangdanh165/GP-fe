import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import paths from "../../routes/paths";

const Banned = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate(paths.sign_in);
  };

  return (
    <Box
      sx={{
        height: "100vh",
        backgroundColor: "#171821",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          zIndex: 1,
        }}
      />
      <Container
        sx={{
          zIndex: 2,
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 4,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h2"
          gutterBottom
          sx={{ fontWeight: "bold", fontSize: "4.5rem", color: "red" }}
        >
          BẠN ĐÃ BỊ CHẶN!
        </Typography>
        <Box
          sx={{
            width: "70%",
            height: "2px",
            backgroundColor: "#fff",
            my: 2,
          }}
        />
        <Typography
          variant="body1"
          sx={{ mb: 4, color: "#bbb", fontSize: "1.5rem" }}
        >
          For some reasons, your account has been banned!
        </Typography>
        <Typography
          variant="body1"
          sx={{ mb: 4, color: "#bbb", fontSize: "1rem", marginBottom: 8 }}
        >
          Please contact to our support team for more information.
        </Typography>
        <Button
          variant="outlined"
          onClick={handleGoHome}
          sx={{
            color: "#fff",
            borderColor: "#fff",
            ":hover": {
              backgroundColor: "rgba(255,255,255,0.1)",
              borderColor: "#fff",
            },
          }}
        >
          VỀ TRANG CHỦ
        </Button>
      </Container>
    </Box>
  );
};

export default Banned;
