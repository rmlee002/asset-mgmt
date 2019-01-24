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
    connection.query('SELECT * FROM employees WHERE archived=0', function(err, results){
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

	connection.query('SELECT * FROM employees WHERE emp_id=?', emp_id, (err, results) => {
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
	connection.query('UPDATE employees SET archived=true WHERE emp_id=?', id, (err,results) => {
		if (err){
			console.log(err);
			res.status(500).send({
                error: "Database query error"
            })
		}
		else{
			connection.query('SELECT history_id FROM history WHERE emp_id=? AND end IS NULL', id, (err,results) => {
                if (err){
                    console.log(err)
                    res.status(500).send({
                        error: "Database query error"
                    })
				}
				else if (results.length > 0){
					var options = undefined;
					results.forEach((item) => {
						options = {
							url: 'http://localhost:8080/history/retire',
							body: JSON.stringify({
								end: moment(new Date()).format('YYYY-MM-DD'),
								history_id: item.history_id
							}),
							method: 'POST',
							headers: { 'Content-Type': 'application/json' }
						}
						request(options, (err, response) => {
							if (err){
								console.log(err)
								res.status(500).send({
									error: "Database query error"
								})
							}
							else if (response.status >= 400){
								res.status(500).send({
									error: "Database query error"
								})
							}
						})
					})
				}
			})
			res.status(200).send("Success")
		}
	})
});

module.exports = router;