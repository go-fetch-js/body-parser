var HttpClient = require('go-fetch');
var body = require('..');

HttpClient()
	.use(HttpClient.plugins.contentType)
	.use(body.json())
	.get('https://api.github.com/repos/go-fetch-js/body-parser', {'User-Agent': 'go-fetch'}, function(error, response) {
		console.log(error, response.getBody());
	})
;