const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const connection = require('../databases/assetDB.js');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router.get('/', (req, res) => {
    connection.query('SELECT * FROM hardware WHERE archived=0', function(err, results){
        if (err){
            console.log(err);
            res.status(500).send({
                error: "Database query error"
            })
        }
        res.send(JSON.stringify(results));
    });
});

router.post('/add', (req,res)=>{
    let assets = JSON.parse(req.body.assets)
    values = assets.map(extract)

    function extract(asset){
        return [asset.model, asset.serial_number,
            req.body.warranty_provider, asset.cost, asset.comment,
            req.body.vendor, req.body.order_num, req.body.warranty, 
            req.body.inDate]
    }
    
    connection.query('INSERT INTO hardware (model,serial_number,warranty_provider,cost,comment,vendor,order_num,warranty,inDate) VALUES ?',
        [values], (err, results) => {
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

router.post('/getAsset', (req,res) => {
    connection.query('SELECT * FROM hardware WHERE asset_id=?', req.body.asset_id, (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send({
                error: "Database query error"
            })
        }
        res.send(JSON.stringify(results));
    })
})

router.post('/updateAsset', (req,res) => {
    const {model, serial_number, warranty_provider, owner, owner_id, cost, comment, vendor, 
        order_num, warranty, inDate, outDate, asset_id} = req.body;

    connection.query('UPDATE hardware SET model=?, serial_number=?, warranty_provider=?,\
        owner=?, owner_id=?, cost=?, comment=?, vendor=?, order_num=?, warranty=?, inDate=?, outDate=?\
        WHERE asset_id=?', [model, serial_number, warranty_provider, owner, owner_id, cost, comment, 
            vendor, order_num, warranty, inDate, outDate, asset_id], (err, results) =>{
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

router.post('/retire', (req, res) => {
    const asset_id = req.body.asset_id
    connection.query('UPDATE hardware SET archived=TRUE WHERE asset_id=?', asset_id, (err,result) => {
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

module.exports = router;