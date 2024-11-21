const express = require("express");
const {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransactionStatus,
} = require("../controllers/transactionController");

const router = express.Router();

// Create a new transaction
router.post("/api/transactions", createTransaction);

// Get all transactions for a user
router.get("/api/transactions", getTransactions);

// Get a specific transaction by ID
router.get("/api/transactions/:transaction_id", getTransactionById);

// Update the status of a transaction
router.put("/api/transactions/:transaction_id", updateTransactionStatus);

module.exports = router;
