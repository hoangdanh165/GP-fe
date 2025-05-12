import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { CircularProgress, Box, Typography, Link } from "@mui/material";

const PaymentQRCode = ({ paymentUrl, loading }) => {
  return (
    <Box sx={{ textAlign: "center", padding: 2 }}>
      {loading ? (
        <CircularProgress size={24} />
      ) : paymentUrl ? (
        <Box>
          <QRCodeSVG
            value={paymentUrl}
            size={256}
            includeMargin={true}
            level="L"
          />
          <Typography variant="body2" sx={{ marginTop: 2 }}>
            Scan the QR code to make the payment.
          </Typography>
          <Typography variant="body2" sx={{ marginTop: 1 }}>
            Or click this{" "}
            <Link
              href={paymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              color="primary"
            >
              link
            </Link>{" "}
            to pay directly.
          </Typography>
        </Box>
      ) : (
        <Typography variant="body2">No payment URL available.</Typography>
      )}
    </Box>
  );
};

export default PaymentQRCode;
