var url = require('url');

var databaseUrl = {};
databaseUrl.parse = function(urlString) {
  if (!urlString) urlString = process.env.DATABASE_URL
  return url.parse(urlString);
}

module.exports = databaseUrl;
