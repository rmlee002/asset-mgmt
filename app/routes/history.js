const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const connection = require('../databases/assetDB.js');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router.post('/employee', (req, res) => {
    connection.query('SELECT * FROM (SELECT history.emp_id, hardware.serial_number, hardware.model, hardware.comment, \
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

router.post('/employee/add', (req,res) => {
    const id = req.body.emp_id;
	connection.query('SELECT asset_id, model, serial_number, comment\
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

router.post('/asset', (req,res) => {
    connection.query('SELECT * FROM (SELECT history.asset_id, employees.first_name, employees.last_name, history.start, history.end\
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

router.post('/asset/add', (req,res) => {
    const {asset_id, emp_id, start} = req.body
    connection.query('INSERT INTO history VALUES (?,?,?,NULL)', [asset_id,emp_id,start], (err,results) => {
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

module.exports = router;