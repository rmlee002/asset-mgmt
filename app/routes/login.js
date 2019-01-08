const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
require('dotenv').config();

adminConnection = mysql.createConnection({
	host : process.env.DB_HOST,
	user : process.env.DB_USER,
	password : process.env.DB_PASS,
	database : 'credentials'
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

adminConnection.connect(function(err){ 
	if (err) throw err;
});

router.post('/', function(req, res) {
	const { user, password } = req.body;
	adminConnection.query('SELECT password AS pass FROM admins WHERE user = ?', user, function(err, results, fields){
		if (err){
			console.log(err);
			res.send({
				"code": 400,
				"failed": 'error occurred'
			})
		}
		else{
			//Username doesn't exist
			if (results.length == 0){
				res.send({
					"code": 401,
					"error": 'Invalid username'
				});
			}
			//Username exists, check password
			else{
				//Correct login info
				if (password == results[0].pass){
					const payload = { user };
					const token = jwt.sign(payload, process.env.TOK_SECRET, {
						expiresIn: '1d'
					});
					res.cookie('token', token, {httpOnly: true})
						.send({
							"code": 200
						});
				}
				//Incorrect password
				else{
					res.send({
						"code": 401,
						"error": 'Invalid password'});
				}
			}
		}	
	});
}); 

module.exports = router;
