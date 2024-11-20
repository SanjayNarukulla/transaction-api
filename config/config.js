// config/config.js

module.exports = {
  development: {
    username: process.env.DB_USER || "transaction_user", // Fallback to defaults if env variable not found
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "transaction_db",
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",
  },
  production: {
    use_env_variable: process.env.DATABASE_URL, // Use environment variable in production
    dialect: "postgres",
  },
};
