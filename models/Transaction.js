const { Sequelize, DataTypes } = require("sequelize");

// Initialize Sequelize with environment variables or hardcoded credentials
const sequelize = new Sequelize({
  username: "transaction_user", // DB Username
  password: "password", // DB Password
  database: "transaction_db", // Database Name
  host: "localhost", // Database Host
  dialect: "postgres", // Database Dialect (PostgreSQL)
});

// Define the 'Transaction' model
const Transaction = sequelize.define("Transaction", {
  amount: {
    type: DataTypes.DECIMAL(10, 2), // Decimal type for monetary values
    allowNull: false, // Amount cannot be null
  },
  transaction_type: {
    type: DataTypes.ENUM("DEPOSIT", "WITHDRAWAL"), // Enum type for transaction type
    allowNull: false, // Transaction type must be provided
  },
  user: {
    type: DataTypes.INTEGER, // User ID associated with the transaction
    allowNull: false, // User ID cannot be null
  },
  timestamp: {
    type: DataTypes.DATE, // Timestamp for transaction creation
    defaultValue: Sequelize.NOW, // Set default to current date/time
    allowNull: false, // Ensure timestamp is not null
  },
  status: {
    type: DataTypes.ENUM("PENDING", "COMPLETED", "FAILED"), // Enum type for status
    defaultValue: "PENDING", // Default status is "PENDING"
    allowNull: false, // Status must be provided
  },
});

// Sync the model with the database and create the table if it doesn't exist
sequelize.sync().then(() => {
  console.log("Transaction model synced with the database");
});

module.exports = { sequelize, Transaction };
