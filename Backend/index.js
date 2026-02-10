// ===============================
// IMPORT REQUIRED PACKAGES
// ===============================
require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

// ===============================
// CREATE EXPRESS APP
// ===============================
const app = express();
app.use(express.json());
app.use(cors());

// ===============================
// LOAD ENV VARIABLES
// ===============================
const {
  DARAJA_CONSUMER_KEY,
  DARAJA_CONSUMER_SECRET,
  DARAJA_SHORTCODE,
  DARAJA_PASSKEY,
} = process.env;

// ===============================
// HOME ROUTE (TEST SERVER)
// ===============================
app.get("/", (req, res) => {
  res.send("✅ M-Pesa Daraja Backend is running");
});

// ===============================
// GENERATE ACCESS TOKEN
// ===============================
async function getAccessToken() {
  const auth = Buffer.from(
    `${DARAJA_CONSUMER_KEY}:${DARAJA_CONSUMER_SECRET}`
  ).toString("base64");

  const response = await axios.get(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }
  );

  return response.data.access_token;
}

// ===============================
// STK PUSH ENDPOINT
// ===============================
app.post("/stkpush", async (req, res) => {
  try {
    const { phone, amount } = req.body;

    // Basic validation
    if (!phone || !amount) {
      return res.status(400).json({
        error: "Phone number and amount are required",
      });
    }

    // Get access token
    const token = await getAccessToken();

    // Generate timestamp
    const timestamp = new Date()
      .toISOString()
      .replace(/[^0-9]/g, "")
      .slice(0, 14);

    // Generate password
    const password = Buffer.from(
      `${DARAJA_SHORTCODE}${DARAJA_PASSKEY}${timestamp}`
    ).toString("base64");

    // STK Push request
    const stkResponse = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        BusinessShortCode: DARAJA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phone,
        PartyB: DARAJA_SHORTCODE,
        PhoneNumber: phone,
        CallBackURL: "https://example.com/callback",
        AccountReference: "EducationTest",
        TransactionDesc: "Daraja STK Push Sandbox",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    res.json(stkResponse.data);
  } catch (error) {
    res.status(500).json(
      error.response?.data || { error: "STK Push failed" }
    );
  }
});

// ===============================
// CALLBACK URL (SANDBOX LEARNING)
// ===============================
app.post("/callback", (req, res) => {
  console.log("📩 CALLBACK RECEIVED:");
  console.log(JSON.stringify(req.body, null, 2));

  res.json({
    ResultCode: 0,
    ResultDesc: "Accepted",
  });
});

// ===============================
// START SERVER
// ===============================
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
