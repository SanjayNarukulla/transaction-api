const Transaction = require("../models/transactionModel");

const createTransaction = async (req, res) => {
  const { amount, transaction_type, user_id } = req.body;

  if (!amount || !transaction_type || !user_id) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const newTransaction = await Transaction.create({
      amount,
      transaction_type,
      user_id,
      status: "PENDING",
      timestamp: new Date(), // Automatically set timestamp to current date and time
    });

    // Format the response according to the desired structure and move `timestamp` to the end
    res.status(201).json({
      transaction_id: newTransaction.transaction_id,
      amount: newTransaction.amount,
      transaction_type: newTransaction.transaction_type,
      status: newTransaction.status,
      user_id: newTransaction.user_id,
      timestamp: newTransaction.timestamp.toISOString(), // Timestamp as ISO string
    });
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ message: "Error creating transaction", error });
  }
};


const getTransactions = async (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ message: "user_id is required" });
  }

  try {
    const transactions = await Transaction.findAll({
      where: { user_id },
    });

    res.status(200).json({
      transactions: transactions.map((transaction) => ({
        transaction_id: transaction.transaction_id,
        amount: transaction.amount,
        transaction_type: transaction.transaction_type,
        status: transaction.status,
        timestamp: transaction.timestamp,
      })),
    });
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ message: "Error fetching transactions", error });
  }
};

const updateTransactionStatus = async (req, res) => {
  const { transaction_id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: "Status is required" });
  }

  try {
    const transaction = await Transaction.findByPk(transaction_id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    transaction.status = status;
    await transaction.save();

    res.status(200).json({
      transaction_id: transaction.transaction_id,
      amount: transaction.amount,
      transaction_type: transaction.transaction_type,
      status: transaction.status,
      timestamp: transaction.timestamp,
    });
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ message: "Error updating transaction", error });
  }
};

const getTransactionById = async (req, res) => {
  const { transaction_id } = req.params;

  try {
    const transaction = await Transaction.findByPk(transaction_id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({
      transaction_id: transaction.transaction_id,
      amount: transaction.amount,
      transaction_type: transaction.transaction_type,
      status: transaction.status,
      timestamp: transaction.timestamp,
    });
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ message: "Error fetching transaction", error });
  }
};




module.exports = {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransactionStatus,
};
