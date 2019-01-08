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

router.get('/', function(req, res, next){
    connection.query('SELECT * FROM employees', function(err, results){
        if (err) throw err;
        res.send(JSON.stringify(results));
    });
});

router.post('/add', (req,res) => {
	const {
		first, last, email, affiliation, department, supervisor, reviewer,
		time_approver, start, end, notes
	} = req.body
	let q = ''
	connection.query('INSERT INTO employees (display_name, first_name, \
		last_name, email, affiliation, department, supervisors, reviewers, \
		time_approvers, start, end, notes)\
		VALUES (?,?,?,?,?,?,?,?,?,?,?,?)', first + ' ' + last, first,
		last, email, affiliation, department, supervisor, reviewer,
		time_approver, start, end, notes, (err, results) => {
			if (err){
				console.log(err);
				throw error;
			}
			else{
				res.send(JSON.stringify(results));
			}
		});
});

module.exports = router;