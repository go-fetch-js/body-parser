var assert      = require('assert');
var HttpClient  = require('go-fetch');
var body        = require('..');
var str         = require('string-to-stream');

describe('.body()', function() {

	it('body should be a string', function() {

		var client    = new HttpClient();
		var request   = new HttpClient.Request();
		var response  = new HttpClient.Response();

		client.use(body());

		response.setBody(str('Hello World!'));

		client.emit('after', request, response, function(error, request, response) {
			assert.equal(typeof(response.getBody()), 'string');
			assert.equal(response.getBody(), 'Hello World!');
		});

	});

});

describe('.json()', function() {

	it('body should be an object when `Content-Type` is `application/json`', function() {

		var client    = new HttpClient();
		var request   = new HttpClient.Request();
		var response  = new HttpClient.Response();
		var stream    = str('{"msg": "Hello World!" }');

		client.use(body.json());

		response
			.setBody(stream)
			.getContentType = function() {
				return 'application/json';
			}
		;

		client.emit('after', request, response, function(error, request, response) {
			assert.equal(typeof(response.getBody()), 'object');
			assert.deepEqual(response.getBody(), {msg: 'Hello World!'});
		});

	});

	it('body should remain a stream when `Content-Type` is not `application/json`', function() {

		var client    = new HttpClient();
		var request   = new HttpClient.Request();
		var response  = new HttpClient.Response();
		var stream    = str('{"msg": "Hello World!" }');

		client.use(body.json());

		response
			.setBody(stream)
			.getContentType = function() {
				return 'text/html';
			}
		;

		client.emit('after', request, response, function(error, request, response) {
			assert(response.getBody() instanceof str);
		});

	});

});