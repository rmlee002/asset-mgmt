var mysql = require('mysql');
require('dotenv').config();

connection = mysql.createConnection({
	host : process.env.DB_HOST,
	user : process.env.DB_USER,
	password : process.env.DB_PASS,
	database : 'assets'
});

connection.connect(function(err){
    if (err) throw err;
})

module.exports = connection;
