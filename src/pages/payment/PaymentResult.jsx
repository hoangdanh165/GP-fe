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

  const formatPayDate = (dateString) => {
    if (!dateString || dateString.length !== 14) return "Invalid date";

    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    const hour = dateString.substring(8, 10);
    const minute = dateString.substring(10, 12);
    const second = dateString.substring(12, 14);

    return `${hour}:${minute}:${second} ${day}/${month}/${year}`;
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Box textAlign="left">
        {isSuccess ? (
          <Alert icon={<CheckCircleOutlineIcon />} severity="success">
            <Typography variant="h5" gutterBottom>
              Payment Successful!
            </Typography>
            <Typography>Order ID: {orderId}</Typography>
            <Typography>Amount: {parseInt(amount) / 100} VND</Typography>
            <Typography>Transaction No: {transactionNo}</Typography>
            <Typography>Bank Code: {bankCode}</Typography>
            <Typography>Payment Date: {formatPayDate(payDate)}</Typography>
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
      </Box>
      <Box textAlign={"center"}>
        <Button variant="contained" color="primary" sx={{ mt: 4 }} href="/">
          Back to Home
        </Button>{" "}
      </Box>
    </Container>
  );
};

export default PaymentResult;
