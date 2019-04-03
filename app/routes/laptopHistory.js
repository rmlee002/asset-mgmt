const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const connection = require('../databases/assetDB.js');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router.post('/add', (req,res) => {
    connection.query('UPDATE laptopHistory SET end=? WHERE laptop_id=? AND end IS NULL', [req.body.start, req.body.laptop_id], (err, results) => {
        if (err){
            console.log(err)
            res.status(500).send("Database query error")
        }
        connection.query('INSERT INTO laptopHistory (laptop_id, emp_id, start,end) VALUES (?,?,?,NULL)', [req.body.laptop_id, req.body.emp_id, req.body.start], (err,results) => {
            if(err){
                console.log(err)
                res.status(500).send("Database query error")
            }
            else{
                res.status(200).send("Success")
            }
        })
    })
})

router.post('/retire', (req,res)=>{
    connection.query('UPDATE laptopHistory SET end=? WHERE laptop_id=? AND emp_id=? AND end IS NULL', [req.body.end, req.body.laptop_id, req.body.emp_id], (err,results) => {
        if (err){
            console.log(err)
            res.status(500).send("Database query error")
        }
        else{
            res.status(200).send("Success")
        }
    })
})

// router.post('/employee', (req, res) => {
//     connection.query('SELECT * FROM (SELECT hardware.asset_id, history.emp_id, hardware.serial_number, hardware.model, hardware.comment, \
// 		history.start, history.end FROM history INNER JOIN hardware ON history.asset_id = hardware.asset_id) AS j WHERE emp_id=? AND end IS NULL', 
// 		req.body.emp_id,(err,results) => {
// 			if (err){
// 				console.log(err)
// 				res.status(500).send("Database query error")
// 			}
// 			else{
// 				res.send(JSON.stringify(results))
// 			}
// 		})
// })

router.post('/employee', (req, res) => {
    connection.query('SELECT laptops.laptop_id, laptopHistory.emp_id, laptops.serial_number, \
    laptops.model, laptops.comment, laptopHistory.start, laptopHistory.end FROM laptopHistory INNER JOIN laptops\
    ON laptopHistory.laptop_id = laptops.laptop_id AND laptopHistory.emp_id=? AND laptopHistory.end IS NULL', req.body.emp_id,(err,results) => {
			if (err){
				console.log(err)
				res.status(500).send("Database query error")
			}
			else{
				res.send(JSON.stringify(results))
			}
		})
})

router.get('/employee/add', (req,res) => {
    const id = req.body.emp_id;
    connection.query('SELECT laptop_id, serial_number, model, comment\
        FROM laptops WHERE laptop_id NOT IN (SELECT laptop_id FROM laptopHistory WHERE end IS NULL) AND archived = FALSE', (err, results) => {
			if (err){
				console.log(err)
				res.status(500).send("Database query error")
			}
			else{
				res.send(JSON.stringify(results))
			}
		})
})

router.post('/laptop', (req,res) => {
    connection.query('SELECT * FROM (SELECT laptopHistory.laptop_id, employees.emp_id, employees.first_name, employees.last_name, \
        laptopHistory.start, laptopHistory.end FROM laptopHistory \
        INNER JOIN employees ON employees.emp_id=laptopHistory.emp_id) AS j WHERE laptop_id=?', req.body.laptop_id, function(err, results){
        if (err){
            console.log(err);
            res.status(500).send("Database query error")
        }
        res.send(JSON.stringify(results));
    })
})

router.post('/laptop/add', (req,res)=>{
    connection.query('SELECT first_name, last_name, email, affiliation, department, \
    emp_id FROM employees WHERE archived=FALSE AND emp_id NOT IN \
        (SELECT emp_id FROM laptopHistory WHERE end IS NULL AND laptop_id=?)',
        req.body.laptop_id, (err, results) => {
            if (err) {
                console.log(err)
                res.status(500).send("Database query error")
            }
            else{
                res.send(JSON.stringify(results))
            }
        })
})

module.exports = router;