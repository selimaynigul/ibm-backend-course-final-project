const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// task 1
public_users.get("/", function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// task 2
public_users.get("/isbn/:isbn", function (req, res) {
  res.send(books[req.params.isbn]);
});

/// task 3
public_users.get("/author/:author", function (req, res) {
  let searchResult = [];
  for (const [key, val] of Object.entries(books)) {
    const book = Object.entries(val);
    for (let i = 0; i < book.length; i++) {
      if (book[i][0] == "author" && book[i][1] == req.params.author) {
        searchResult.push(books[key]);
      }
    }
  }
  if (searchResult.length == 0) {
    return res.status(300).json({ message: "Author not found" });
  }
  res.send(searchResult);
});

// task 4
public_users.get("/title/:title", function (req, res) {
  let searchResult = [];
  for (const [key, val] of Object.entries(books)) {
    const book = Object.entries(val);
    for (let i = 0; i < book.length; i++) {
      if (book[i][0] == "title" && book[i][1] == req.params.title) {
        searchResult.push(books[key]);
      }
    }
  }
  if (searchResult.length == 0) {
    return res.status(300).json({ message: "Title not found" });
  }
  res.send(searchResult);
});

// task 5
public_users.get("/review/:isbn", function (req, res) {
  res.send(books[req.params.isbn].reviews);
});

// task 6
const doesExist = (username) => {
  for (const user of users) {
    if (user.username === username) {
      return true;
    }
  }
  return false;
};

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!doesExist(username)) {
      users.push({ username: username, password: password });
      return res.status(200).json({ message: "Registered" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Error" });
});

// task 10
const getBookList = () => {
  return new Promise((resolve, reject) => {
    resolve(books);
  });
};
public_users.get("/", function (req, res) {
  getBookList().then(
    (bk) => res.send(JSON.stringify(bk, null, 4)),
    (err) => res.send("denied")
  );
});

// task 11
const getFromISBN = (isbn) => {
  let book_ = books[isbn];
  return new Promise((resolve, reject) => {
    if (book_) {
      resolve(book_);
    } else {
      reject("Unable to find book!");
    }
  });
};
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  getFromISBN(isbn).then(
    (bk) => res.send(JSON.stringify(bk, null, 4)),
    (error) => res.send(error)
  );
});

// task 12
const getFromAuthor = (author) => {
  let output = [];
  return new Promise((resolve, reject) => {
    for (let isbn in books) {
      let book_ = books[isbn];
      if (book_.author === author) {
        output.push(book_);
      }
    }
    resolve(output);
  });
};
public_users.get("/author/:author", function (req, res) {
  getFromAuthor(req.params.author).then((result) =>
    res.send(JSON.stringify(result, null, 4))
  );
});

// task 13
const getFromTitle = (title) => {
  let output = [];
  return new Promise((resolve, reject) => {
    for (let isbn in books) {
      let book_ = books[isbn];
      if (book_.title === title) {
        output.push(book_);
      }
    }
    resolve(output);
  });
};
public_users.get("/title/:title", function (req, res) {
  getFromTitle(req.params.title).then((result) =>
    res.send(JSON.stringify(result, null, 4))
  );
});

module.exports.general = public_users;
