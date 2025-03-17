const express = require("express");
const router = express.Router();
const Book = require("../models/Book"); // FIXED: Correct Path to Your Model

const mongoose = require("mongoose");
// Add a New Book
router.post("/add", async (req, res) => {
  console.log("Request received at:", req.url);
  console.log("Request Body:", req.body);
  try {
    const newBook = new Book(req.body);
    await newBook.save();
    res.status(201).json({ message: "Book added successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error adding book", error });
  }
});

 


// Fetch All Books
router.get("/all", async (req, res) => {
  try {
    const books = await Book.find(); // Fetch all books from MongoDB
    res.status(200).json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Fetch Book by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // 🚨 Check if ID is valid for MongoDB
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid Book ID" });
    }

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ error: "Book Not Found" });
    }

    res.json(book);
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = router;