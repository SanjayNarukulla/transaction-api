// src/models/transactionModel.js
const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

// Define the Transaction model
const Transaction = sequelize.define(
  "Transaction",
  {
    transaction_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    transaction_type: {
      type: DataTypes.ENUM("DEPOSIT", "WITHDRAWAL"),
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("PENDING", "COMPLETED", "FAILED"),
      defaultValue: "PENDING",
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "transactions", // Table name in PostgreSQL
    timestamps: false, // Disable createdAt/updatedAt fields
  }
);

module.exports = Transaction;
