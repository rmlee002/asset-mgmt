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
            res.status(500).send("Database query error")
        }
        res.send(JSON.stringify(results));
    });
});

router.post('/history', (req, res) => {
    connection.query('SELECT first_name, last_name FROM employees WHERE\
        emp_id IN (SELECT emp_id FROM history WHERE asset_id=?)', req.body.asset_id, function(err, results){
        if (err){
            console.log(err);
            res.status(500).send("Database query error")
        }
        res.send(JSON.stringify(results));
    })
})

router.post('/add', (req, res) =>{
    const asset = req.body;
    connection.query(`INSERT INTO hardware (description, model, serial_number, warranty_provider,\
        owner, cost, comment, vendor, order_num, warranty, inDate, outDate, department) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`, [request.description, request.model,
        asset.serial_number, asset.warranty_provider, asset.owner, asset.cost, asset.comment, asset.vendor,
        asset.order_num, asset.warranty, asset.inDate, asset.out, asset.department], (err, results) => {
            if (err) {
                console.log(err)
                res.status(500).send("Database query error")
            }
            else{
                res.status(200).send("Success!")
            }            
        })
})

router.post('/getAsset', (req,res) => {
    connection.query('SELECT * FROM hardware WHERE asset_id=?', req.body.asset_id, (err, results) => {
        if (err) {
            console.log(err);
            throw err;
        }
        res.send(JSON.stringify(results));
    })
})

router.post('/manage/updateAsset', (req,res) => {
    const newAsset = req.body;
    connection.query('UPDATE hardware SET description=?, model=?, serial_number=?, warranty_provider,\
        owner=?, cost=?, comment=?, vendor=?, order_num=?, warranty=?, inDate=?, outDate=?, department=?\
        WHERE asset_id=?', [newAsset.description, newAsset.model, newAsset.serial_number,
        newAsset.warranty_provider, newAsset.owner, newAsset.cost, newAsset.comment, newAsset.order_num,
        newAsset.warranty, newAsset.inDate, newAsset.outDate, newAsset.department, newAsset.asset_id], (err, results) =>{
            if(err){
                console.log(err)
                res.status(500).send("Database query error")
            }
            else{
                res.status(200).send("Success")
            }
        })
})

router.post('/manage/addHistory', (req,res) => {
    const {asset_id, emp_id, start, end} = req.body
    connection.query('INSERT INTO history VALUES (?,?,?)', [asset_id,emp_id,start], (err,results) => {
        if(err){
            console.log(err)
            res.status(500).send("Database query error")
        }
        else{
            res.status(200).send("Success");
        }
    })
})

module.exports = router;