const mysql = require('mysql');
require('dotenv').config();

adminConnection = mysql.createConnection({
	host : process.env.DB_HOST,
	user : process.env.DB_USER,
	password : process.env.DB_PASS,
	database : 'credentials'
});

adminConnection.connect(function(err){ 
	if (err) throw err;
});

module.exports = adminConnection;