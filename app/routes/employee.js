const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const connection = require('../databases/assetDB.js');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router.get('/', function(req, res, next){
    connection.query('SELECT * FROM employees', function(err, results){
        if (err) throw err;
        res.send(JSON.stringify(results));
    });
});

router.post('/add', (req,res) => {
	const {
		first_name, last_name, email, affiliation, department, supervisor, reviewer,
		time_approver, start, end, notes
	} = req.body

	connection.query('INSERT INTO employees (display_name, first_name, \
		last_name, email, affiliation, department, supervisors, reviewers, \
		time_approvers,start,end,notes)\
		VALUES (?,?,?,?,?,?,?,?,?,?,?,?)', [first_name+' '+last_name,
		first_name, last_name, email, affiliation, department, supervisor, reviewer,
		time_approver, start, end, notes], (err, results) => {
			if (err){
				res.status(501).send("Database query error")
			}
			else{
				res.send(JSON.stringify(results));
			}
		});
});

module.exports = router;