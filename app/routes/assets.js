const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const connection = require('../databases/assetDB.js');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router.get('/', (req, res) => {
    connection.query('SELECT * FROM hardware WHERE archived=0', function(err, results){
        if (err) throw err;
        res.send(JSON.stringify(results));
    });
});

module.exports = router;