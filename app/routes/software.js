const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const connection = require('../databases/assetDB.js');
const moment = require('moment');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router.get('/', (req,res)=>{
    connection.query('SELECT * FROM software', (err, results) => {
        if(err){
            console.log(err)
            res.status(500).send({
                error: 'Database query error'
            })
        }
        res.send(JSON.stringify(results))
    })
})

router.post('/retire', (req,res)=>{
    connection.query('UPDATE software SET archived=TRUE WHERE software_id=?', req.body.software_id, (err,results)=>{
        if (err){
            console.log(err)
            res.status(500).send({
                error: "Database query error"
            })
        }
        res.status(200).send('Success')  
    })
})

router.post('/add', (req,res)=>{
    connection.query('INSERT INTO software (name,cost) VALUES (?,?)', [req.body.license, req.body.cost], (err,results)=>{
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

router.post('/getSoftware', (req,res) =>{
    connection.query('SELECT * FROM software WHERE software_id=?', req.body.software_id, (err,results)=>{
        if (err){
            console.log(err)
            res.status(500).send({
                error: "Database query error"
            })
        }
        res.send(JSON.stringify(results))
    })
})

router.post('/update', (req,res)=>{
    connection.query('UPDATE software SET name=?, cost=? WHERE software_id=?', [req.body.name, req.body.cost, req.body.software_id], (err,results)=>{
        if (err){
            console.log(err)
            res.status(500).send({
                error: "Database query error"
            })
        }
        res.status(200).send('Success')
    })
})

router.post('/total', (req,res)=>{
    const days = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    connection.query('SELECT software.cost, licenses.start, licenses.end FROM licenses \
        JOIN software ON licenses.software_id=software.software_id WHERE licenses.software_id=?',
        software_id, (err,results) => {
            if (err){
                console.log(err)
                res.status(500).send({
                    error: "Database query error"
                })              
            }
            else{
                if(results.length === 0){
                    res.send(0)
                }
                else{
                    var total=0;
                    results.forEach((license) => {
                        total += days[moment(license.start).get('month')]
                    })
                }
            }
        })
})

module.exports = router;