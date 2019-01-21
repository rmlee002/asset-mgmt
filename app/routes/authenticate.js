const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const connection = require('../databases/loginDB');
const jwt = require('jsonwebtoken');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router.post('/login', function(req, res) {
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
						.status(200).send('Success!');
				}
				//Incorrect password
				else{
					res.status(400).send({
						"error": 'Invalid password'});
				}
			}
		}	
	});
}); 

router.get('/logout', (req,res)=>{
	res.clearCookie('token').send()
})

module.exports = router;
