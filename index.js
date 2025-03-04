const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const userRoutes=require("./routes/userRouter");
const scheduleRoutes=require("./routes/scheduleRoutes");
const clobRoutes=require("./routes/clubRoutes");
const connectDB=require("./config/dbConfig");
const threadRouter=require("./routes/threadRouter")
dotenv.config();
const cookieParser = require("cookie-parser");
const app = express();
const alumniRoutes=require("./routes/alumniRoutes");
const replyRoutes=require("./routes/replyRoutes");
const clubRoutes=require("./routes/clubRoutes")

app.use(express.json());

app.use(cors({
  origin:["http://localhost:5173","https://hackathon-frontend-nine-xi.vercel.app/"], // React frontend URL
  credentials: true, // Allow cookies & authentication headers
}));

app.use(cookieParser());


app.use("/", authRoutes);
app.use("/",userRoutes);
app.use("/schedule",scheduleRoutes);
app.use("/threads",threadRouter);
app.use("/api/replies",replyRoutes );
app.use("/alumni",alumniRoutes);
app.use("/club",clubRoutes);

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
  

