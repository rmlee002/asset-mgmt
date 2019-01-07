const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');

connection = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : 'password',
	database : 'credentials'
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

connection.connect(function(err){ 
	if (err) throw err;
});

router.post('/', function(req, res) {
	const { user, password } = req.body;
	connection.query('SELECT password AS pass FROM admins WHERE user = ?', user, function(err, results, fields){
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
					const token = jwt.sign(payload, "temp-secret", {
						expiresIn: '1m'
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
