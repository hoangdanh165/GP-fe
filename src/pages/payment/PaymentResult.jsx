import React from "react";
import { useSearchParams } from "react-router-dom";
import { Container, Typography, Box, Alert, Button } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

const PaymentResult = () => {
  const [searchParams] = useSearchParams();

  const responseCode = searchParams.get("vnp_ResponseCode");
  const orderId = searchParams.get("vnp_TxnRef");
  const amount = searchParams.get("vnp_Amount");
  const transactionNo = searchParams.get("vnp_TransactionNo");
  const bankCode = searchParams.get("vnp_BankCode");
  const payDate = searchParams.get("vnp_PayDate");

  const isSuccess = responseCode === "00";

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Box textAlign="center">
        {isSuccess ? (
          <Alert icon={<CheckCircleOutlineIcon />} severity="success">
            <Typography variant="h5" gutterBottom>
              Payment Successful!
            </Typography>
            <Typography>Order ID: {orderId}</Typography>
            <Typography>Amount: {parseInt(amount) / 100} VND</Typography>
            <Typography>Transaction No: {transactionNo}</Typography>
            <Typography>Bank Code: {bankCode}</Typography>
            <Typography>Payment Date: {payDate}</Typography>
          </Alert>
        ) : (
          <Alert icon={<HighlightOffIcon />} severity="error">
            <Typography variant="h5" gutterBottom>
              Payment Failed!
            </Typography>
            <Typography>Error Code: {responseCode}</Typography>
            <Typography>Order ID: {orderId}</Typography>
          </Alert>
        )}

        <Button variant="contained" color="primary" sx={{ mt: 4 }} href="/">
          Back to Home
        </Button>
      </Box>
    </Container>
  );
};

export default PaymentResult;
