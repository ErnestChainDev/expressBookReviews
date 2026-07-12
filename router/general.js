const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6: User registration
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
    if (!isValid(username)) {
        return res.status(409).json({ message: "Username already exists or is invalid" });
    }

    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully" });
});

// ---------- Synchronous routes (Tasks 1-5) ----------

// Task 1: Get all books (synchronous)
public_users.get('/sync/books', function (req, res) {
    return res.status(200).send(JSON.stringify(books, null, 4));
});

// Task 2: Get book by ISBN (synchronous)
public_users.get('/sync/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).send(JSON.stringify(books[isbn], null, 4));
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// Task 3: Get books by author (synchronous)
public_users.get('/sync/author/:author', function (req, res) {
    const author = req.params.author.toLowerCase();
    const keys = Object.keys(books);
    const matchingBooks = [];

    for (let key of keys) {
        if (books[key].author.toLowerCase() === author) {
            matchingBooks.push({ isbn: key, ...books[key] });
        }
    }
    if (matchingBooks.length > 0) {
        return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
    } else {
        return res.status(404).json({ message: "No books found for this author" });
    }
});

// Task 4: Get books by title (synchronous)
public_users.get('/sync/title/:title', function (req, res) {
    const title = req.params.title.toLowerCase();
    const keys = Object.keys(books);
    const matchingBooks = [];

    for (let key of keys) {
        if (books[key].title.toLowerCase() === title) {
            matchingBooks.push({ isbn: key, ...books[key] });
        }
    }
    if (matchingBooks.length > 0) {
        return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
    } else {
        return res.status(404).json({ message: "No books found for this title" });
    }
});

// Task 5: Get book review by ISBN
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// ---------- Asynchronous routes (Tasks 10-13) ----------

// Helper that returns a Promise resolving with the books object (simulates async DB call)
const getBooksAsync = () => new Promise((resolve, reject) => resolve(books));

// Task 10: Get all books – async/await
public_users.get('/', async function (req, res) {
    try {
        const allBooks = await getBooksAsync();
        return res.status(200).send(JSON.stringify(allBooks, null, 4));
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books" });
    }
});

// Helper that returns a Promise resolving with a specific book by ISBN
const getBookByISBNAsync = (isbn) => new Promise((resolve, reject) => {
    if (books[isbn]) {
        resolve(books[isbn]);
    } else {
        reject("Book not found");
    }
});

// Task 11: Get book details by ISBN – async/await
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
        const book = await getBookByISBNAsync(isbn);
        return res.status(200).send(JSON.stringify(book, null, 4));
    } catch (error) {
        return res.status(404).json({ message: error });
    }
});

// Helper that returns a Promise with books filtered by author
const getBooksByAuthorAsync = (author) => new Promise((resolve, reject) => {
    const authorLower = author.toLowerCase();
    const keys = Object.keys(books);
    const matchingBooks = [];
    for (let key of keys) {
        if (books[key].author.toLowerCase() === authorLower) {
            matchingBooks.push({ isbn: key, ...books[key] });
        }
    }
    if (matchingBooks.length > 0) {
        resolve(matchingBooks);
    } else {
        reject("No books found for this author");
    }
});

// Task 12: Get book details by author – async/await
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const result = await getBooksByAuthorAsync(author);
        return res.status(200).send(JSON.stringify(result, null, 4));
    } catch (error) {
        return res.status(404).json({ message: error });
    }
});

// Helper that returns a Promise with books filtered by title
const getBooksByTitleAsync = (title) => new Promise((resolve, reject) => {
    const titleLower = title.toLowerCase();
    const keys = Object.keys(books);
    const matchingBooks = [];
    for (let key of keys) {
        if (books[key].title.toLowerCase() === titleLower) {
            matchingBooks.push({ isbn: key, ...books[key] });
        }
    }
    if (matchingBooks.length > 0) {
        resolve(matchingBooks);
    } else {
        reject("No books found for this title");
    }
});

// Task 13: Get book details by title – async/await
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
        const result = await getBooksByTitleAsync(title);
        return res.status(200).send(JSON.stringify(result, null, 4));
    } catch (error) {
        return res.status(404).json({ message: error });
    }
});

module.exports.general = public_users;