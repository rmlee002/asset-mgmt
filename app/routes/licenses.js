const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const connection = require('../databases/assetDB.js');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router.post('/', (req,res)=>{
    connection.query(
        'SELECT software.cost, employees.emp_id, employees.first_name, employees.last_name, employees.department, licenses.start\
        FROM licenses\
        JOIN employees\
        ON licenses.emp_id = employees.emp_id\
        AND employees.archived=FALSE\
        JOIN software\
        ON licenses.software_id = software.software_id\
        WHERE licenses.software_id=? AND licenses.end IS NULL', req.body.software_id, (err,results)=>{
        if(err){
            console.log(err)
            res.status(500).send({
                error: "Database query error"
            })
        }
        else{
            connection.query('SELECT software.name FROM software WHERE software_id=?', req.body.software_id, (err,results2)=>{
                if (err){
                    console.log(err)
                    res.status(500).send({
                        error: "Database query error"
                    })
                }
                res.send({
                    name: results2[0].name,
                    info: results
                })
            })
        }
    })
})

router.post('/add', (req,res)=>{
    connection.query('INSERT INTO licenses (emp_id, software_id, start) VALUES (?,?,?)', 
    [req.body.emp_id, req.body.software_id,req.body.start], (err,results)=>{
        if (err){
            console.log(err)
            res.status(500).send("Database query error")
        }
        else{
            res.status(200).send('Success')
        }
    })
})

router.post('/retire', (req,res) => {
    connection.query('UPDATE licenses SET end=? WHERE software_id=? AND emp_id=? AND end IS NULL', [req.body.end, req.body.software_id, req.body.emp_id], (err,results)=>{
        if (err){
            console.log(err)
            res.status(500).send("Database query error")
        }
        res.status(200).send('Success')
    })
})

router.post('/getUserData', (req,res)=>{
    connection.query('SELECT software.software_id, software.name, licenses.start, licenses.end FROM licenses JOIN software\
        ON licenses.software_id = software.software_id AND software.archived=FALSE WHERE emp_id=?', req.body.emp_id, (err,results)=>{
            if (err){
                console.log(err)
                res.status(500).send("Database query error")
            }
            res.send(JSON.stringify(results))
        })
})

router.post('/getEmployees', (req,res)=>{
    connection.query('SELECT emp_id, first_name, last_name, email, affiliation, department\
        FROM employees WHERE archived=FALSE AND emp_id NOT IN\
        (SELECT emp_id FROM licenses WHERE software_id=? AND end IS NULL)', req.body.software_id, (err,results)=>{
            if (err){
                console.log(err)
                res.status(500).send("Database query error")
            }
            res.send(JSON.stringify(results))
        })
})

router.post('/getSoftware', (req,res)=>{
    connection.query('SELECT software_id, name FROM software WHERE software_id NOT IN \
        (SELECT software_id FROM licenses WHERE emp_id=? AND end IS NULL)', req.body.emp_id, (err, results) => {
            if (err) {
                console.log(err)
                res.status(500).send("Database query error")
            }
            res.send(JSON.stringify(results))
        })
})

module.exports = router;