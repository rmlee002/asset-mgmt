const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const connection = require('../databases/assetDB.js');
const request = require('request')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router.post('/add', (req,res) => {
    connection.query('UPDATE history SET end=? WHERE asset_id=? AND end IS NULL', [req.body.start, req.body.asset_id], (err, results) => {
        if (err){
            console.log(err)
            res.status(500).send({
                error: "Database query error"
            })
        }
        connection.query('INSERT INTO history (asset_id, emp_id, start,end) VALUES (?,?,?,NULL)', [req.body.asset_id, req.body.emp_id, req.body.start], (err,results) => {
            if(err){
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
})

router.post('/retire', (req,res)=>{
    connection.query('UPDATE history SET end=? WHERE asset_id=? AND emp_id=? AND end IS NULL', [req.body.end, req.body.asset_id, req.body.emp_id], (err,results) => {
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

router.post('/employee', (req, res) => {
    connection.query('SELECT * FROM (SELECT hardware.asset_id, history.emp_id, hardware.serial_number, hardware.model, hardware.comment, \
		history.start, history.end FROM history INNER JOIN hardware ON history.asset_id = hardware.asset_id) AS j WHERE emp_id=? AND end IS NULL', 
		req.body.emp_id,(err,results) => {
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

router.get('/employee/add', (req,res) => {
    const id = req.body.emp_id;
    connection.query('SELECT asset_id, serial_number, model, comment\
        FROM hardware WHERE asset_id NOT IN (SELECT asset_id FROM history WHERE end IS NULL) AND archived = FALSE', (err, results) => {
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

router.post('/asset', (req,res) => {
    connection.query('SELECT * FROM (SELECT history.asset_id, employees.emp_id, employees.first_name, employees.last_name, history.start, history.end\
        FROM history INNER JOIN employees ON employees.emp_id=history.emp_id) AS j WHERE asset_id=?', req.body.asset_id, function(err, results){
        if (err){
            console.log(err);
            res.status(500).send({
                error: "Database query error"
            })
        }
        res.send(JSON.stringify(results));
    })
})

router.post('/asset/add', (req,res)=>{
    connection.query('SELECT * FROM employees WHERE archived=FALSE AND emp_id NOT IN \
        (SELECT emp_id FROM history WHERE end IS NULL AND asset_id=?)',
        req.body.asset_id, (err, results) => {
            if (err) {
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