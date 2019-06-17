const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const connection = require('../databases/assetDB.js');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router.get('/', (req,res)=>{
    connection.query(
        '(SELECT laptops.serial_number, laptops.model, CONCAT(owner.first_name, " ", owner.last_name) AS owner,\
         laptops.cost, owner.department AS contract, laptops.warranty_provider, laptops.warranty, laptops.inDate,\
         laptops.comment, laptops.broken, laptops.archived\
        FROM laptops\
        LEFT JOIN\
        (SELECT laptopHistory.laptop_id, employees.first_name, employees.last_name, employees.department\
        FROM employees\
        INNER JOIN laptopHistory\
        ON laptopHistory.emp_id =  employees.emp_id AND laptopHistory.end IS NULL) as owner\
        ON owner.laptop_id = laptops.laptop_id)\
        UNION ALL\
        (SELECT serial_number, model, owner, cost, contract, warranty_provider, warranty, inDate, comment,\
        broken, archived FROM hardware)', (err,results) =>{
            if (err){
                console.log(err);
                res.status(500).send("Database query error")
            }
            res.send(JSON.stringify(results))
        })
});

module.exports = router;