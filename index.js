/* jshint strict: true */
/* global require, console */

const Hapi = require('hapi');
const npmcss = require('npm-css');
const github_markdown_css = npmcss('node_modules/github-markdown-css/github-markdown.css');
const Hoek = require('hoek');

// Create a server with a host, port, and options
var server = new Hapi.Server();

server.connection({port: 9247});

// landing page
server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {

        'use strict';
        // Render the view with the custom greeting
        reply.view('readme.html', {
            css: github_markdown_css
        });
    }
});

// test-endpoint
server.route({
    method: '*',
    path: '/endpoint',
    handler: function (request, reply) {
        'use strict';
        console.log('Params: %j', request.params);
        console.log('Query: %j', request.query);
        console.log('Method: %s', request.method);
        console.log('Body: %j', request.payload);
        console.log('\n\n\n');

        var statusCode = 200;

        if (request.query.status_code) {
            statusCode = parseInt(request.query.status_code);
        }

        reply('Maunz!').code(statusCode);
    }
});

// example post
server.route({
    method: 'GET',
    path: '/post',
    handler: function (request, reply) {

        'use strict';
        // default params
        var params = {
            css: github_markdown_css,
            head: false,
            link: false,
            a: false,
            rel: 'webmention',
            status_code: 200,
            endpoint: server.info.uri + '/endpoint'
        };

        // check "link" type
        if (request.query.type) {
            var type = request.query.type.split(',');

            // show <a /> (inside <body />)
            if (type.indexOf('a') >= 0) {
                params.a = true;
            }

            // show <link /> (inside <head />)
            if (type.indexOf('link') >= 0) {
                params.link = true;
            }

            // show link http header
            if (type.indexOf('head') >= 0) {
                params.head = true;
            }
        }

        // check "rel" version
        if (request.query.rel) {
            // use URI instead of ID
            if (request.query.rel === 'uri') {
                params.rel = 'http: //webmention.org/';
            }

            // use URL and ID
            if (request.query.rel === 'both') {
                params.rel = 'webmention http://webmention.org/';
            }
        }

        // check "URL" type
        if (request.query.url && request.query.url === 'rel') {
            params.endpoint = '/endpoint';
        }

        // check "STATUS_CODE" type
        if (request.query.status_code) {
            params.status_code = request.query.status_code;
        }

        // show http link header
        if (params.head) {
            // Render the view with the custom greeting
            reply.view('post.html', params).header('Link', '<' + params.endpoint + '?type=head&status_code=' + params.status_code + '>; rel="' + params.rel + '"');
            // or not
        } else {
            reply.view('post.html', params);
        }
    }
});

server.register(require('vision'), (err) => {

    Hoek.assert(!err, err);

    server.views({
        engines: {
            html: require('handlebars')
        },
        relativeTo: __dirname,
        path: 'templates'
    });
});

// Start the server
server.start();
