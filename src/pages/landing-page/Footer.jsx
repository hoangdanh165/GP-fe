import { Box, Container, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box sx={{ bgcolor: "#e0e0e0", py: 3, mt: 6 }}>
      <Container>
        <Typography variant="body2" color="textSecondary" align="center">
          © {new Date().getFullYear()} Prestige Auto Garage. All rights
          reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
