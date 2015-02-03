var HttpClient = require('go-fetch');
var parseBody = require('..');
var contentType = require('go-fetch-content-type');

HttpClient()
	.use(contentType)
	.use(parseBody.json())
	.get('https://api.github.com/repos/go-fetch-js/body-parser', {'User-Agent': 'go-fetch'}, function(error, response) {
		console.log(error, response.getBody());
	})
;