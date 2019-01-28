const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const connection = require('../databases/assetDB.js');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router.post('/', (req,res)=>{
    connection.query(
        'SELECT software.cost, employees.first_name, employees.last_name, employees.department, licenses.start\
        FROM licenses\
        JOIN employees\
        ON licenses.emp_id = employees.emp_id\
        JOIN software\
        ON licenses.software_id = software.software_id\
        WHERE licenses.software_id=?', req.body.software_id, (err,results)=>{
        if(err){
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

router.post('/add', (req,res)=>{
    connection.query('INSERT INTO licenses (emp_id, software_id, start) VALUES (?,?,?)', 
    [req.body.emp_id, req.body.software_id,req.body.start], (err,results)=>{
        if (err){
            console.log(err)
            res.status(500).send({
                error: "Database query error"
            })
        }
        else{
            res.status(200).send('Success')
        }
    })
})

router.post('/getUserData', (req,res)=>{
    connection.query('SELECT software.name, licenses.start FROM licenses JOIN software\
        ON licenses.software_id = software.software_id WHERE emp_id=? AND end IS NULL', req.body.emp_id, (err,results)=>{
            if (err){
                console.log(err)
                res.status(500).send({
                    error: "Database query error"
                })
            }
            res.send(JSON.stringify(results))
        })
})

module.exports = router;