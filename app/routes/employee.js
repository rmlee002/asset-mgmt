const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const mysql = require('mysql');
require('dotenv').config();

connection = mysql.createConnection({
	host : process.env.DB_HOST,
	user : process.env.DB_USER,
	password : process.env.DB_PASS,
	database : 'assets'
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

connection.connect(function(err){ 
	if (err) throw err;
});

router.get('/employees', function(req, res, next){
    connection.query('SELECT * FROM employees', function(err, results, fields){
        if (err) throw err;
        res.send(JSON.stringify(results));
    });
});

module.exports = router;