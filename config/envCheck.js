const dotenv = require('dotenv');
dotenv.config();

if (!process.env.ACCESS_TOKEN_SECRET) {
  throw new Error("Missing ACCESS_TOKEN_SECRET in .env");
}

if (!process.env.REFRESH_TOKEN_SECRET) {
  throw new Error("Missing REFRESH_TOKEN_SECRET in .env");
}

if (!process.env.DATABASE_URI) {
  throw new Error("Missing DATABASE_URI in .env");
}