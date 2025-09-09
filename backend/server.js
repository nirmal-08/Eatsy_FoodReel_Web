import dotenv from "dotenv";
import path from "path";

// dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), "./backend/.env") });

import app from "./src/app.js";
import connectDB from "./src/db/db.js";


connectDB();

app.listen(8000, () => {
  console.log("🚀 Server started on port 8000");
});
