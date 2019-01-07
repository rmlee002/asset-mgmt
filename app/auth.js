const jwt = require('jsonwebtoken');
require('dotenv').config();

const authorized = (req,res,next) => {
	const token =
		req.body.token ||
		req.query.token || 
		req.headers['x-access-token'] ||
		req.cookies.token;

	if (!token){
		res.status(401).send('Unauthorized: Please log in');
	}
	else{
		jwt.verify(token, process.env.TOK_SECRET, (err, decoded) => {
			if (err) {
				res.status(401).send('Unauthorized: Invalid token');
			}
			else{
				req.user = decoded.user;
				next();
			}
		})
	}
}

module.exports = authorized;