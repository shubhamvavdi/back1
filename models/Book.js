const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true, 
    },
    author: {
      type: String,
      required: true,
    },
    price: {
      type: Number, // Using Number for price
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema); // Registered as "Book"
module.exports = Book;
