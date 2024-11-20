const express = require("express");
const bodyParser = require("body-parser");
const { sequelize, Transaction } = require("./models/Transaction");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

// POST /api/transactions/ - Create a new transaction
app.post("/api/transactions/", async (req, res) => {
  const { amount, transaction_type, user } = req.body;

  // Validation
  if (!amount || !transaction_type || !user) {
    return res
      .status(400)
      .json({
        error: "All fields (amount, transaction_type, user) are required",
      });
  }

  try {
    const transaction = await Transaction.create({
      amount,
      transaction_type,
      user,
      status: "PENDING",
    });
    res.status(201).json({
      transaction_id: transaction.id,
      amount: transaction.amount,
      transaction_type: transaction.transaction_type,
      status: transaction.status,
      user: transaction.user,
      timestamp: transaction.createdAt,
    });
  } catch (error) {
    console.error("Error creating transaction:", error);
    if (process.env.NODE_ENV === "development") {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Error creating transaction" });
    }
  }
});

// GET /api/transactions/?user_id=1 - Get transactions by user ID
app.get("/api/transactions/", async (req, res) => {
  const { user_id } = req.query;
  if (!user_id) {
    return res
      .status(400)
      .json({ error: "user_id query parameter is required" });
  }

  try {
    const transactions = await Transaction.findAll({
      where: { user: user_id },
    });

    const formattedTransactions = transactions.map((transaction) => ({
      transaction_id: transaction.id,
      amount: transaction.amount,
      transaction_type: transaction.transaction_type,
      status: transaction.status,
      timestamp: transaction.createdAt,
    }));

    res.status(200).json({ transactions: formattedTransactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    if (process.env.NODE_ENV === "development") {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Error fetching transactions" });
    }
  }
});

// PUT /api/transactions/:id/ - Update status of a transaction
app.put("/api/transactions/:id/", async (req, res) => {
  const { status } = req.body;

  // Validation
  if (!status) {
    return res.status(400).json({ error: "Status field is required" });
  }

  try {
    const transaction = await Transaction.findByPk(req.params.id);
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    transaction.status = status;
    await transaction.save();

    res.status(200).json({
      transaction_id: transaction.id,
      amount: transaction.amount,
      transaction_type: transaction.transaction_type,
      status: transaction.status,
      timestamp: transaction.createdAt,
    });
  } catch (error) {
    console.error("Error updating transaction:", error);
    if (process.env.NODE_ENV === "development") {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Error updating transaction" });
    }
  }
});

// GET /api/transactions/:id/ - Get transaction details by ID
app.get("/api/transactions/:id/", async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.status(200).json({
      transaction_id: transaction.id,
      amount: transaction.amount,
      transaction_type: transaction.transaction_type,
      status: transaction.status,
      timestamp: transaction.createdAt,
    });
  } catch (error) {
    console.error("Error fetching transaction:", error);
    if (process.env.NODE_ENV === "development") {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "Error fetching transaction" });
    }
  }
});

// Sync the database and start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// Sync models to the database only in development (for production, use migrations)
if (process.env.NODE_ENV === "development") {
  sequelize.sync().then(() => {
    console.log("Database synced");
  });
} else {
  console.log("Skipping DB sync in production. Use migrations.");
}
