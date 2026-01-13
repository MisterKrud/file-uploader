import "dotenv/config";
import { Pool } from "pg";

let pool
if(process.env.NODE_ENV === "production"){

pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false 
  },
  connectionTimeoutMillis: 5000, 
  idleTimeoutMillis: 30000
  
});
console.log("Attempting to connect to:", process.env.DATABASE_URL ? "URL found" : "URL NOT FOUND");
} else if(process.env.NODE_ENV === "development"){
    pool = new Pool({
  connectionString: process.env.DATABASE_URL
    })
}


module.exports = pool;