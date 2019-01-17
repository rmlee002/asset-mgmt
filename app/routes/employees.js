const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const connection = require('../databases/assetDB.js');

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
		email, affiliation, department, supervisor, reviewer,time_approver, start, end, notes)\
		VALUES (?,?,?,?,?,?,?,?,?,?,?)', [first_name, last_name, email, affiliation, department,
			supervisor, reviewer, time_approver, start, end, notes], (err, results) => {
			if (err){
				console.log(err)
				res.status(500).send({
					error: "Database query error"
				})
			}
			else{
				res.status(200)
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

router.post('/history', (req,res) => {
	const emp_id = req.body.emp_id;
	connection.query('SELECT description, model, serial_number, comment\
		FROM hardware WHERE asset_id IN (SELECT asset_id FROM history where emp_id=?)',
		emp_id, (err,results) => {
			if (err){
				console.log(err)
				res.status(500).send({
					error: "Database query error"
				})
			}
			else{
				res.send(JSON.stringify(results))
			}
		})
})

router.post('/manage/update', (req,res) => {
	const {
		emp_id, first_name, last_name, email, affiliation, department, supervisor, 
		reviewer, time_approver, start, end, notes} = req.body
	connection.query('UPDATE employees SET first_name=?, last_name=?, email=?, affiliation=?,\
		department=?, supervisor=?, reviewer=?, time_approver=?, start=?, end=?, notes=? WHERE emp_id=?',
		[first_name, last_name, email, affiliation, department, supervisor, reviewer,
		time_approver, start, end, notes, emp_id], (err) => {
			if (err){
				console.log(err)
				res.status(500).send({
					error: "Database query error"
				})
			}
			else{
				res.status(200)
			}
		})
})

router.post('/manage/retire', (req,res) => {
	const id = req.body.emp_id;
	connection.query('UPDATE employees SET archived=true WHERE emp_id=?', id, (err,results) => {
		if (err){
			console.log(err);
			res.status(500).send({
                error: "Database query error"
            })
		}
		else{
			res.status(200)
		}
	})
});

router.post('/addAsset', (req,res) => {
	const id = req.body.emp_id;
	connection.query('SELECT asset_id, description, model, serial_number, comment\
		FROM hardware WHERE asset_id NOT IN (SELECT asset_id FROM history WHERE emp_id=?)',
		id, (err, results) => {
			if (err){
				console.log(err)
				res.status(500).send({
					error: "Database query error"
				})
			}
			else{
				res.send(JSON.stringify(results))
			}
		})
})

module.exports = router;