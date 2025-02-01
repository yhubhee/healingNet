var databaseUrl = require(__dirname + '/index');
var cfg = databaseUrl.parse('postgres://localhost/epochtalk_dev');
console.log(cfg);
