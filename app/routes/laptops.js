const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const connection = require('../databases/assetDB.js');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router.get('/', (req, res) => {
    connection.query(
        'SELECT laptops.laptop_id, laptops.serial_number, laptops.model, laptops.cost,\
        laptops.warranty_provider, owner.first_name, owner.last_name, laptops.comment, laptops.vendor,\
        laptops.order_num, laptops.warranty, laptops.inDate, laptops.outDate, laptops.archived, laptops.broken\
        FROM laptops \
        LEFT JOIN (SELECT laptopHistory.laptop_id, employees.first_name, employees.last_name\
        FROM employees\
        INNER JOIN laptopHistory\
        ON laptopHistory.emp_id =  employees.emp_id AND laptopHistory.end IS NULL) as owner\
        ON owner.laptop_id = laptops.laptop_id', function(err, results){
        if (err){
            console.log(err);
            res.status(500).send("Database query error")
        }
        res.send(JSON.stringify(results));
    });
});

router.post('/add', (req,res)=>{
    let assets = JSON.parse(req.body.assets);
    values = assets.map(extract);

    function extract(asset){
        return [asset.model, asset.serial_number,
            req.body.warranty_provider, asset.cost, asset.comment,
            req.body.vendor, req.body.order_num, req.body.warranty, 
            req.body.inDate]
    }
    
    connection.query('INSERT INTO laptops (model,serial_number,warranty_provider,cost,comment,vendor,order_num,warranty,inDate) VALUES ?',
        [values], (err, results) => {
        if (err){
            console.log(err);
            res.status(500).send("Database query error")
        }
        res.status(200).send("Success")
    })
});

router.post('/getLaptop', (req,res) => {
    connection.query('SELECT * FROM laptops WHERE laptop_id=?', req.body.laptop_id, (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send("Database query error")
        }
        res.send(JSON.stringify(results));
    })
});

router.post('/updateLaptop', (req,res) => {
    const {laptop_id, model, serial_number, warranty_provider, cost, vendor, 
        order_num, warranty, inDate, outDate, broken, comment} = req.body;

    connection.query('UPDATE laptops SET model=?, serial_number=?, warranty_provider=?,\
        cost=?, comment=?, vendor=?, order_num=?, warranty=?, inDate=?, outDate=?, broken=?\
        WHERE laptop_id=?', [model, serial_number, warranty_provider, cost, comment, 
            vendor, order_num, warranty, inDate, outDate, broken, laptop_id], (err, results) =>{
            if(err){
                console.log(err);
                res.status(500).send("Database query error")
            }
            else{
                res.status(200).send("Success")
            }
        })
});

router.post('/retire', (req, res) => {
    console.log(req.body.end);
    console.log(typeof req.body.end);
    connection.query('UPDATE laptops SET outDate=?, archived=TRUE WHERE laptop_id=?', [req.body.end, req.body.laptop_id], (err,result) => {
        if (err){
            console.log(err);
            res.status(500).send("Database query error")
        }        
        connection.query('UPDATE laptopHistory SET end=CURDATE() WHERE laptop_id=? AND end IS NULL', req.body.laptop_id, (err,results)=>{
            if (err){
                console.log(err);
                res.status(500).send("Database query error")
            }
            res.status(200).send("Success")
        })        
    })
});

router.post('/unretire', (req,res) => {
    connection.query('UPDATE laptops SET archived=FALSE, outDate=NULL WHERE laptop_id=?', req.body.laptop_id, (err,results)=>{
        if (err){
            console.log(err);
            res.status(500).send("Database query error")
        }
        res.status(200).send("Success")
    })
});

module.exports = router;