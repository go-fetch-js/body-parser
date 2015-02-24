var assert      = require('assert');
var HttpClient  = require('go-fetch');
var bodyParser  = require('..');
var contentType = require('go-fetch-content-type');
var str         = require('string-to-stream');
var Stream      = require('stream');

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

	it('should parse the body a second time', function(done) {

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

			response.setBody(str('Hello World!'));
			client.emit(event, function(error, event) {
				assert.equal(typeof(event.response.getBody()), 'string');
				assert.equal(event.response.getBody(), 'Hello World!');
				done();
			});

		});

	});

	it('should not parse the body a second time when `once` is true', function(done) {

		var client    = new HttpClient();
		var request   = new HttpClient.Request();
		var response  = new HttpClient.Response();
		var event     = new HttpClient.Event({
			name:     'after',
			request:  request,
			response: response
		});

		client.use(bodyParser({once: true}));

		response.setBody(str('Hello World!'));
		client.emit(event, function(error, event) {
			assert.equal(typeof(event.response.getBody()), 'string');

			response.setBody(str('Hello World!'));
			client.emit(event, function(error, event) {
				assert.equal(typeof(event.response.getBody()), 'object');
				assert(event.response.getBody() instanceof Stream);
				done();
			});

		});

	});

	it('should parse the body if it is shorter than the maxlength', function(done) {

		var client    = new HttpClient();
		var request   = new HttpClient.Request();
		var response  = new HttpClient.Response();
		var event     = new HttpClient.Event({
			name:     'after',
			request:  request,
			response: response
		});

		client.use(bodyParser({maxlength: 15}));

		response
			.setHeader('Content-Length', '12')
			.setBody(str('Hello World!'))
		;

		client.emit(event, function(error, event) {
			assert.equal(typeof(event.response.getBody()), 'string');
			done();
		});

	});

	it('should not parse the body if it is longer than the maxlength', function(done) {

		var client    = new HttpClient();
		var request   = new HttpClient.Request();
		var response  = new HttpClient.Response();
		var event     = new HttpClient.Event({
			name:     'after',
			request:  request,
			response: response
		});

		client.use(bodyParser({maxlength: 10}));

		response
			.setHeader('Content-Length', '12')
			.setBody(str('Hello World!'))
		;

		client.emit(event, function(error, event) {
			assert.equal(typeof(event.response.getBody()), 'object');
			assert(event.response.getBody() instanceof Stream);
			done();
		});

	});

	it('should parse the body if it is a listed type', function(done) {

		var client    = new HttpClient();
		var request   = new HttpClient.Request();
		var response  = new HttpClient.Response();
		var event     = new HttpClient.Event({
			name:     'after',
			request:  request,
			response: response
		});

		client.use(bodyParser({types: ['text/plain']}));

		response
			.setBody(str('Hello World!'))
			.isContentType = function() {
				return true;
			}
		;

		client.emit(event, function(error, event) {
			assert.equal(typeof(event.response.getBody()), 'string');
			done();
		});

	});

	it('should not parse the body if it is not a listed type', function(done) {

		var client    = new HttpClient();
		var request   = new HttpClient.Request();
		var response  = new HttpClient.Response();
		var event     = new HttpClient.Event({
			name:     'after',
			request:  request,
			response: response
		});

		client.use(bodyParser({types: ['text/plain']}));

		response
			.setBody(str('<h1>Hello World!</h1>'))
			.isContentType = function() {
				return false
			}
		;

		client.emit(event, function(error, event) {
			assert.equal(typeof(event.response.getBody()), 'object');
			assert(event.response.getBody() instanceof Stream);
			done();
		});

	});

});

describe('.urlencoded()', function() {

	it('body should be an object when `Content-Type` is `application/x-www-form-urlencoded`', function(done) {

		var client    = new HttpClient();
		var request   = new HttpClient.Request();
		var response  = new HttpClient.Response();
		var event     = new HttpClient.Event({
			name:     'after',
			request:  request,
			response: response
		});

		client.use(bodyParser.urlencoded());

		response
			.setBody(str('msg=Hello%20World!'))
			.isContentType = function() {
				return true;
			}
		;

		client.emit(event, function(error, event) {
			assert(!error);
			assert.equal(typeof(event.response.getBody()), 'object');
			assert.deepEqual(event.response.getBody(), {msg: 'Hello World!'});
			done();
		});

	});

	it('body should remain a stream when `Content-Type` is not `application/x-www-form-urlencoded`', function(done) {

		var client    = new HttpClient();
		var request   = new HttpClient.Request();
		var response  = new HttpClient.Response();
		var event     = new HttpClient.Event({
			name:     'after',
			request:  request,
			response: response
		});

		client.use(bodyParser.urlencoded());

		response
			.setBody(str('msg=Hello%20World!'))
			.isContentType = function() {
				return false;
			}
		;

		client.emit(event, function(error, event) {
			assert(event.response.getBody() instanceof str);
			done();
		});

	});

});

describe('.json()', function() {

	it('body should be an object when `Content-Type` is `application/json`', function(done) {

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
			.isContentType = function() {
				return true;
			}
		;

		client.emit(event, function(error, event) {
			assert.equal(typeof(event.response.getBody()), 'object');
			assert.deepEqual(event.response.getBody(), {msg: 'Hello World!'});
			done();
		});

	});

	it('body should remain a stream when `Content-Type` is not `application/json`', function(done) {

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
			.isContentType = function() {
				return false;
			}
		;

		client.emit(event, function(error, event) {
			assert(event.response.getBody() instanceof str);
			done();
		});

	});

});