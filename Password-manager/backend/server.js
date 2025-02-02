require("dotenv").config();
const express = require("express");
const AWS = require("aws-sdk");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();
app.use(express.json());
app.use(cors());

// AWS Setup
AWS.config.update({ region: "us-east-1" });
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const kms = new AWS.KMS();

// Encrypt Password
const encryptPassword = async (password) => {
  const params = { KeyId: process.env.KMS_KEY_ID, Plaintext: password };
  const encrypted = await kms.encrypt(params).promise();
  return encrypted.CiphertextBlob.toString("base64");
};

// API - Store Password
app.post("/store-password", async (req, res) => {
  const { userId, site, password } = req.body;
  const encryptedPassword = await encryptPassword(password);

  const params = {
    TableName: "PasswordsTable",
    Item: { userId, site, password: encryptedPassword },
  };

  await dynamoDB.put(params).promise();
  res.json({ message: "Password stored securely!" });
});

// API - Retrieve Passwords
app.get("/get-passwords", async (req, res) => {
  const { userId } = req.query;
  const params = {
    TableName: "PasswordsTable",
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: { ":userId": userId },
  };

  const data = await dynamoDB.query(params).promise();
  res.json(data.Items);
});

// Start Server
app.listen(5000, () => console.log("Backend running on port 5000"));
