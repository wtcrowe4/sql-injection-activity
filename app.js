const http = require('http');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express(); 

app.use(express.static('.'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const db = new sqlite3.Database(':memory:');
db.serialize(() => {
 db.run("CREATE TABLE user (username TEXT, password TEXT, title TEXT)");
 db.run("INSERT INTO user VALUES ('User', 'UserPassword', 'Administrator')");
 db.run("INSERT INTO user VALUES ('User2', 'User2Password', 'User')");
});

app.get('/', (req, res) => {
    res.sendFile('index.html');
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const query = "SELECT * FROM user WHERE username = '" + username + "' AND password = '" + password + "'";

    console.log(`Query: ${query}`);
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);

    db.get(query, (err, row) => {
        if (err) {
            console.log(err);
            res.status(500).send(err).redirect('/index.html#error');
        } else if (!row) {
            console.log('Unauthorized');
            res.status(404).redirect('/index.html#unauthorized');
        } else {
            console.log('Success');
            res.status(200).send(`Welcome ${row.title} ${row.username}!<br /> This page contains sensitive information! <br /> <a href='/index.html'>Logout</a>`);
        }
    });
});


app.listen(3000, () => {
    console.log('Server listening on port 3000');
});


