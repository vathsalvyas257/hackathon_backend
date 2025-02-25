const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const connectDB=require("./config/dbConfig");
dotenv.config();
const cookieParser = require("cookie-parser");
const app = express();

app.use(express.json());
app.use(
cors({
  origin: "http://localhost:5173", // Explicitly allow frontend origin
  credentials: true, // Allow credentials (cookies, authorization headers)
}));
app.use(cookieParser());


app.use("/", authRoutes);

try {
    connectDB().then(() => {
      console.log("Database connection successful");
      const PORT = process.env.PORT;
      app.listen(PORT, () => {
          console.log(`server is running at: http://localhost:${PORT}`);
        })
        
    })
    .catch((err) => {
      console.log("Error:" + err.message);
    });
  } catch (err) {
    console.log("Error:" + err.message);
  }
  

