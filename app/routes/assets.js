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

router.post('/history', (req, res) => {
    connection.query('SELECT first_name, last_name FROM employees WHERE\
        emp_id IN (SELECT emp_id FROM history WHERE asset_id=?)', req.body.asset_id, function(err, results){
        if (err){
            console.log(err);
            res.status(500).send({
                error: "Database query error"
            })
        }
        res.send(JSON.stringify(results));
    })
})

router.post('/add', (req, res) =>{
    const asset = req.body;
    connection.query(`INSERT INTO hardware (description, model, serial_number, warranty_provider,\
        cost, comment, vendor, order_num, warranty, inDate, department) VALUES (?,?,?,?,?,?,?,?,?,?,?)`, [asset.description, asset.model,
        asset.serial_number, asset.warranty_provider, asset.cost, asset.comment, asset.vendor,
        asset.order_num, asset.warranty, asset.inDate, asset.department], (err, results) => {
            if (err) {
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
    const {description, model, serial_number, warranty_provider, owner, cost, comment, vendor, 
        order_num, warranty, inDate, outDate, department, asset_id} = req.body;

        // console.log(asset_id+' '+description+' '+model+' '+seri)
    connection.query('UPDATE hardware SET description=?, model=?, serial_number=?, warranty_provider=?,\
        owner=?, cost=?, comment=?, vendor=?, order_num=?, warranty=?, inDate=?, outDate=?, department=?\
        WHERE asset_id=?', [description, model, serial_number, warranty_provider, owner, cost, comment, 
            vendor, order_num, warranty, inDate, outDate, department, asset_id], (err, results) =>{
            if(err){
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

router.post('/addHistory', (req,res) => {
    const {asset_id, emp_id, start} = req.body
    connection.query('INSERT INTO history VALUES (?,?,?,NULL)', [asset_id,emp_id,start], (err,results) => {
        if(err){
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

module.exports = router;