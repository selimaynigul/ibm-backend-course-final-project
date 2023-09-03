const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  for (const user of users) {
    if (user.username === username) {
      return true;
    }
    return false;
  }
};

const authenticatedUser = (username, password) => {
  for (const user of users) {
    if (user.username === username && user.password === password) {
      return true;
    }
    return false;
  }
};

// task 7
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error" });
  }

  if (authenticatedUser(username, password)) {
    let token = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      token,
      username,
    };
    return res.status(200).send("Logged in");
  } else {
    return res.status(208).json({ message: "Unable to log in" });
  }
});

// task 8
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.session.authorization.username;
  if (books[isbn]) {
    let book = books[isbn];
    book.reviews[username] = review;
    return res.status(200).send("Review added");
  } else {
    return res.status(404).json({ message: `ISBN ${isbn} not found` });
  }
});

// task 9
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  if (books[isbn]) {
    let book = books[isbn];
    delete book.reviews[username];
    return res.status(200).send("Review deleted");
  } else {
    return res.status(404).json({ message: `ISBN ${isbn} not found` });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
