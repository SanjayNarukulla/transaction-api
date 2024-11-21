const { Sequelize } = require("sequelize");
require("dotenv").config();

// Create a new instance of Sequelize with PostgreSQL credentials
const sequelize = new Sequelize(process.env.DB_URI, {
  dialect: "postgres",
  logging: false, // Disable logging for cleaner output
  dialectOptions: {
    ssl: {
      require: true, // Indicates that SSL is required
      rejectUnauthorized: false, // Allows self-signed certificates (if applicable)
    },
  },
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully!");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1); // Exit the process if database connection fails
  }
};

module.exports = { sequelize, connectDB };
