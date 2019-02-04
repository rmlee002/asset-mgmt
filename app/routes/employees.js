const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const connection = require('../databases/assetDB.js');
const request = require('request');
const moment = require('moment');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router.get('/', (req, res) => {
    connection.query(
		'SELECT a.emp_id, a.first_name, a.last_name, a.email, a.affiliation, a.department,\
		b.first_name AS super_first, b.last_name AS super_last, c.first_name AS reviewer_first,\
		c.last_name AS reviewer_last, d.first_name AS time_first, d.last_name AS time_last, a.start, a.end, a.notes, a.archived\
 		FROM employees a\
		LEFT JOIN employees b\
		ON a.supervisor_id = b.emp_id\
		LEFT JOIN employees c\
		ON a.reviewer_id = c.emp_id\
		LEFT JOIN employees d\
		ON a.time_approver_id = d.emp_id', 
		function(err, results){
			if (err){
				console.log(err)
				res.status(500).send({
					error: "Database query error"
				})
			}
			res.send(JSON.stringify(results));
    });
});

router.post('/add', (req,res) => {
	const {
		first_name, last_name, email, affiliation, department, supervisor, reviewer,
		time_approver, start, end, notes
	} = req.body

	connection.query('INSERT INTO employees (first_name, last_name,\
		email, affiliation, department, supervisor_id, reviewer_id,time_approver_id, start, end, notes)\
		VALUES (?,?,?,?,?,?,?,?,?,?,?)', [first_name, last_name, email, affiliation, department,
			supervisor, reviewer, time_approver, start, end, notes], (err, results) => {
			if (err){
				console.log(err)
				res.status(500).send({
					error: "Database query error"
				})
			}
			else{
				res.status(200).send("Success")
			}
		});
});

router.post('/getEmployee', (req,res) => {
	const { emp_id } = req.body;

	connection.query(
		'SELECT a.emp_id, a.first_name, a.last_name, a.email, a.affiliation, a.department,\
		a.supervisor_id, b.first_name AS super_first, b.last_name AS super_last,\
		a.reviewer_id, c.first_name AS reviewer_first, c.last_name AS reviewer_last, \
		a.time_approver_id, d.first_name AS time_first, d.last_name AS time_last, a.start, a.end, a.notes\
 		FROM employees a\
		LEFT JOIN employees b\
		ON a.supervisor_id = b.emp_id\
		LEFT JOIN employees c\
		ON a.reviewer_id = c.emp_id\
		LEFT JOIN employees d\
		ON a.time_approver_id = d. emp_id\
		WHERE a.emp_id=?', 
		emp_id, (err, results) => {
		if (err){
			console.log(err)
			res.status(500).send({
                error: "Database query error"
            })
		}
		else{
			res.send(JSON.stringify(results));
		}
	})
})

router.post('/update', (req,res) => {
	const {
		emp_id, first_name, last_name, email, affiliation, department, supervisor, 
		reviewer, time_approver, start, end, notes} = req.body
		
	connection.query('UPDATE employees SET first_name=?, last_name=?, email=?, affiliation=?,\
		department=?, supervisor_id=?, reviewer_id=?, time_approver_id=?, start=?, end=?, notes=? WHERE emp_id=?',
		[first_name, last_name, email, affiliation, department, supervisor, reviewer,
		time_approver, start, end, notes, emp_id], (err) => {
			if (err){
				console.log(err)
				res.status(500).send({
					error: "Database query error"
				})
			}
			else{
				res.status(200).send("Success")
			}
		})
})

router.post('/retire', (req,res) => {
	const id = req.body.emp_id;
	connection.query('UPDATE employees SET end=?, archived=true WHERE emp_id=?', [req.body.end, id], (err,results) => {
		if (err){
			console.log(err);
			res.status(500).send({
                error: "Database query error"
            })
		}
		else{
			connection.query('UPDATE history SET end=? WHERE emp_id=? AND end IS NULL', [req.body.end, id], (err, results) =>{
				if (err){
					console.log(err)
					res.status(500).send({
						error: "Database query error"
					})
				}
				else{
					connection.query('UPDATE licenses SET end=? WHERE emp_id=? AND end IS NULL', [req.body.end, id], (err, results) => {
						if (err){
							console.log(err)
							res.status(500).send({
								error: "Database query error"
							})
						}
						res.status(200).send('Success')
					})
				}
			})
		}
	})
});

module.exports = router;