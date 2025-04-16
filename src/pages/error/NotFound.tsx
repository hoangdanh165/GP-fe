import { ReactElement } from "react";
import { Link, Stack, Button, Typography } from "@mui/material";
import Image from "../../components/base/Image";
import errorSvg from "../../assets/images/error/error.svg";
import paths from "../../routes/paths";
import React from "react";

const NotFound = (): ReactElement => {
  return (
    <Stack
      minHeight="100vh"
      width="fit-content"
      mx="auto"
      justifyContent="center"
      alignItems="center"
      gap={10}
      py={12}
    >
      <Typography variant="h1" color="text.secondary">
        Oops! Not found!
      </Typography>
      <Typography
        variant="h5"
        fontWeight={100}
        color="text.primary"
        maxWidth={600}
        textAlign="center"
      >
        The page you visit not found, please check the url!
      </Typography>
      <Image
        alt="Not Found Image"
        src={errorSvg}
        sx={{
          mx: "auto",
          height: 260,
          my: { xs: 5, sm: 10 },
          width: { xs: 1, sm: 340 },
        }}
      />
      <Button
        href={paths.sign_in}
        size="large"
        variant="contained"
        component={Link}
      >
        Go back
      </Button>
    </Stack>
  );
};

export default NotFound;
