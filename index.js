require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.SERVER_PORT || 5000

const mysql = require('mysql')
const conn = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

app.get('/book', (req, res) => {
  let search = req.query
  if (search.category && search.location) {
    conn.query('SELECT * FROM book LEFT JOIN category ON book.category_id = category.categoryid WHERE category.name = ? AND book.location = ?', [search.category, search.location], (err, results) => {
      if (err)console.log(err)
      res.json(results)
    })
  } else if (search.location) {
    conn.query('SELECT * FROM book LEFT JOIN category ON book.category_id = category.categoryid WHERE book.location = ?', search.location, (err, results) => {
      if (err)console.log(err)
      res.json(results)
    })
  } else if (search.category) {
    conn.query('SELECT * FROM book LEFT JOIN category ON book.category_id = category.categoryid WHERE category.name = ? ', search.category, (err, results) => {
      if (err)console.log(err)
      res.json(results)
    })
  } else {
    conn.query('SELECT book.*,category.name as category FROM book LEFT JOIN category ON book.category_id = category.categoryid', (err, results) => {
      if (err) console.log(err)
      res.json(results)
    })
  }
})

app.post('/book', (req, res) => {
  const data = {
    name: req.body.name,
    writer: req.body.writer,
    location: req.body.location,
    category_id: req.body.category_id,
    created_at: new Date(),
    updated_at: new Date()
  }
  conn.query('INSERT INTO book SET ?', data, (err, results) => {
    if (err) console.log(err)
    res.json(results)
  })
})

app.patch('/book/:book_id', (req, res) => {
  const data = {
    name: req.body.name,
    writer: req.body.writer,
    location: req.body.location,
    category_id: req.body.category_id,
    updated_at: new Date()
  }
  const bookid = req.params.book_id
  conn.query('UPDATE book SET ? WHERE bookid = ?', [data, bookid], (err, results) => {
    if (err)console.log(err)
    res.json(results)
  })
})

app.delete('/book/:book_id', (req, res) => {
  const bookid = req.params.book_id
  conn.query('DELETE FROM book WHERE bookid = ? ', bookid, (err, results) => {
    if (err)console.log(err)
    res.json(results)
  })
})

app.get('/category', (req, res) => {
  conn.query('SELECT * FROM category', (err, results) => {
    if (err)console.log(err)
    res.json(results)
  })
})

app.post('/category', (req, res) => {
  const data = {
    name: req.body.name,
    created_at: new Date(),
    updated_at: new Date()
  }
  conn.query('INSERT INTO category SET ?', data, (err, results) => {
    if (err)console.log(err)
    res.json(results)
  })
})

app.patch('/category/:categoryid', (req, res) => {
  const data = {
    name: req.body.name,
    updated_at: new Date()
  }
  const categoryid = req.params.categoryid
  conn.query('UPDATE category SET ? WHERE categoryid = ?', [data, categoryid], (err, results) => {
    if (err) console.log(err)
    res.json(results)
  })
})

app.delete('/category/:categoryid', (req, res) => {
  const categoryid = req.params.categoryid
  conn.query('DELETE FROM category WHERE categoryid = ?', categoryid, (err, results) => {
    if (err) console.log(err)
    res.json(results)
  })
})
