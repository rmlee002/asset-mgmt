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
            res.status(500).send('Database query error')
        }
        res.send(JSON.stringify(results))
    })
})

router.post('/retire', (req,res)=>{
    connection.query('UPDATE software SET archived=TRUE WHERE software_id=?', req.body.software_id, (err,results)=>{
        if (err){
            console.log(err)
            res.status(500).send("Database query error")
        }
        connection.query('UPDATE licenses SET end=CURDATE() WHERE software_id=? AND end IS NULL', [req.body.software_id], (err,results) =>{
            if (err){
                console.log(err)
                res.status(500).send("Database query error")
            }
            res.status(200).send('Success')
        }) 
    })
})

router.post('/add', (req,res)=>{
    connection.query('INSERT INTO software (name,cost) VALUES (?,?)', [req.body.name, req.body.cost], (err,results)=>{
        if (err){
            console.log(err)
            res.status(500).send("Database query error")
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
            res.status(500).send("Database query error")
        }
        res.send(JSON.stringify(results))
    })
})

router.post('/update', (req,res)=>{
    connection.query('UPDATE software SET name=?, cost=? WHERE software_id=?', [req.body.name, req.body.cost, req.body.software_id], (err,results)=>{
        if (err){
            console.log(err)
            res.status(500).send("Database query error")
        }
        res.status(200).send('Success')
    })
})

router.post('/unretire', (req,res)=>{
    connection.query('UPDATE software SET archived=FALSE WHERE software_id=?', req.body.software_id, (err,results)=>{
        if (err){
            console.log(err)
            res.status(500).send('Database query error')
        }
        res.status(200).send('Success')
    })
})

module.exports = router;