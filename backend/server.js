
import app from "./src/app.js";
import connectDB from "./src/db/db.js";


connectDB();

app.listen(8000, () => {
  console.log("🚀 Server started on port 8000");
});
