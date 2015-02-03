var assert      = require('assert');
var HttpClient  = require('go-fetch');
var bodyParser  = require('..');
var str         = require('string-to-stream');

describe('parse-body', function() {

	it('body should be a string', function() {

		var client    = new HttpClient();
		var request   = new HttpClient.Request();
		var response  = new HttpClient.Response();
		var event     = new HttpClient.Event({
			name:     'after',
			request:  request,
			response: response
		});

		client.use(bodyParser());

		response.setBody(str('Hello World!'));

		client.emit(event, function(error, event) {
			assert.equal(typeof(event.response.getBody()), 'string');
			assert.equal(event.response.getBody(), 'Hello World!');
		});

	});

});

describe('.json()', function() {

	it('body should be an object when `Content-Type` is `application/json`', function() {

		var client    = new HttpClient();
		var request   = new HttpClient.Request();
		var response  = new HttpClient.Response();
		var event     = new HttpClient.Event({
			name:     'after',
			request:  request,
			response: response
		});

		client.use(bodyParser.json());

		response
			.setBody(str('{"msg": "Hello World!" }'))
			.getContentType = function() {
				return 'application/json';
			}
		;

		client.emit(event, function(error, event) {
			assert.equal(typeof(event.response.getBody()), 'object');
			assert.deepEqual(event.response.getBody(), {msg: 'Hello World!'});
		});

	});

	it('body should remain a stream when `Content-Type` is not `application/json`', function() {

		var client    = new HttpClient();
		var request   = new HttpClient.Request();
		var response  = new HttpClient.Response();
		var event     = new HttpClient.Event({
			name:     'after',
			request:  request,
			response: response
		});
		var stream    = str('{"msg": "Hello World!" }');

		client.use(bodyParser.json());

		response
			.setBody(stream)
			.getContentType = function() {
				return 'text/html';
			}
		;

		client.emit(event, function(event, event) {
			assert(event.response.getBody() instanceof str);
		});

	});

});