var HttpClient  = require('go-fetch');
var contentType = require('go-fetch-content-type');
var parseBody   = require('..');

HttpClient()
	.use(contentType)
	.use(parseBody.json())
	.get('https://api.github.com/repos/go-fetch-js/parse-body', {'User-Agent': 'go-fetch'}, function(error, response) {
		console.log(error, response.getBody());
	})
;