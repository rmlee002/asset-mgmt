const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const connection = require('../databases/departmentDB.js');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router.get('/', (req,res)=>{
    connection.query('SELECT * FROM departments', (err,results) => {
        if (err) {
            console.log(err)
            res.status(500).send({
                error: 'Database query error'
            });
        }
        else{
            res.send(JSON.stringify(results))
        }
    })
})

router.post('/', (req,res) => {
    connection.query('INSERT INTO departments VALUES (?,?)', [req.body.value,req.body.label], (err,results)=>{
        if (err){
            console.log(err)
            res.status(500).send({
                error: 'Database query error'
            });
        }
        else{
            res.status(200).send('Success')
        }
    })
})

module.exports = router