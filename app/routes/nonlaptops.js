const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const connection = require('../databases/assetDB.js');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router.get('/', (req,res) => {
    connection.query('SELECT * FROM hardware', function(err,results){
        if (err){
            console.log(err)
            res.status(500).send("Database query error")
        }
        res.send(JSON.stringify(results))
    })
});

router.post('/add', (req,res)=>{
    let assets = JSON.parse(req.body.assets);
    values = assets.map(extract);

    function extract(asset){
        return [asset.serial_number, asset.model, asset.description,
            req.body.warranty_provider, asset.cost, req.body.vendor, 
            req.body.order_num, req.body.warranty, req.body.inDate, asset.comment]
    }

    connection.query(
        'INSERT INTO hardware (serial_number, model, description, warranty_provider, cost, vendor,\
            order_number, warranty, inDate, comment) VALUES ?', [values], (err, results) =>{
        if (err){
            console.log(err);
            res.status(500).send("Database query error")
        }
        res.status(200).send("Success")
    })
});

router.post('/getNonLaptop', (req,res)=>{
    connection.query('SELECT * FROM hardware WHERE hardware_id = ?', req.body.hardware_id, (err, results) => {
        if (err){
            console.log(err);
            res.status(500).send("Database query error")
        }
        res.send(JSON.stringify(results))
    })
});

router.post('/updateNonLaptop', (req,res)=>{
    const {hardware_id, model, description, serial_number, warranty_provider, owner, contract, cost,vendor,
        order_number, warranty, inDate, outDate, broken, comment} = req.body
    connection.query('UPDATE hardware SET model=?, description=?, serial_number=?, warranty_provider=?,\
    owner=?, contract=?, cost=?, vendor=?, order_number=?, warranty=?, inDate=?, outDate=?, broken=?, comment=?\
    WHERE hardware_id=?', [model, description, serial_number, warranty_provider, owner, contract, cost, vendor,
        order_number, warranty, inDate, outDate, broken, comment, hardware_id], (err, results)=>{
            if(err){
                console.log(err);
                res.status(500).send("Database query error")
            }
            else{
                res.status(200).send("Success")
            }
        })
});

router.post('/retire', (req,res)=>{
    connection.query('UPDATE hardware SET outDate=?, archived = TRUE WHERE hardware_id = ?', [req.body.outDate, req.body.hardware_id], (err,results)=>{
        if (err){
            console.log(err);
            res.status(500).send("Database query error")
        }
        else{
            res.status(200).send("Success")
        }
    })
});

router.post('/unretire', (req,res)=>{
    connection.query('UPDATE hardware SET archived = FALSE, outDate = NULL WHERE hardware_id = ?', req.body.hardware_id, (err,results)=>{
        if (err){
            console.log(err);
            res.status(500).send("Database query error")
        }
        else{
            res.status(200).send("Success")
        }
    })
});

module.exports = router;