const mysql = require('mysql');

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "admin",
    database: "bscriptTest"
});
var queries = {
	users: 'SELECT * FROM users'
};

const getList = (queryName, queryParams) => {
	return new Promise(function(resolve, reject){
		db.query(queries[queryName], queryParams, function(err, result, fields){
			if (!err) resolve(JSON.parse(JSON.stringify(result))); // Hacky solution
			else reject(err);
		});
	});
};

module.exports = {
	getList
};