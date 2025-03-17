require("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const app = express();

// ✅ Middleware to log requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});
fetch("http://localhost:5000/cart/get-user-cart", {
  headers: {
    Authorization: `Bearer yourTokenHere`,
    id: "yourUserIdHere",
  },
})
  .then((res) => res.json())
  .then(console.log)
  .catch(console.error);
   
// ✅ CORS setup
app.use(cors({
  origin: "http://localhost:3000", // Frontend URL
  credentials: true, // Allow sending cookies
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "id"], // Allow custom headers like 'id'
}));

// ✅ Body parsing middleware
app.use(express.json());
app.use(cookieParser()); 

// ✅ MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("❌ MongoDB URI missing. Check your .env file.");
  process.exit(1);
}

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((error) => {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1);
  });

// ✅ JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token || req.headers["authorization"]?.split(" ")[1];
  
  if (!token) {
    return res.status(403).json({ message: "❌ No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "❌ Invalid or expired token" });
    }
    req.user = decoded;
    next();
  });
};

// ✅ Import Routes
const userRoutes = require("./routes/user");
const bookRoutes = require("./routes/book");
const orderRoutes = require("./routes/order");
const favouriteRoutes = require("./routes/favourites");
const cartRoutes = require("./routes/cart");

// ✅ Register Routes
app.use("/user", userRoutes);
app.use("/book", bookRoutes);
app.use("/orders", orderRoutes);
app.use("/favourites", favouriteRoutes);
app.use("/cart", cartRoutes); // This was duplicated, removed redundant app.use("/cart", require("./routes/cart"));

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("🚀 Welcome to the Bookstore API");
});

// ✅ 404 Route Handler
app.use((req, res) => {
  res.status(404).json({ message: "❌ Route not found" });
});

// ✅ Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message);
  res.status(500).json({ message: "Internal Server Error" });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
