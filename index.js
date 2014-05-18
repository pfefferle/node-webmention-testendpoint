var Hapi = require('hapi');
var npmcss = require('npm-css');
var github_markdown_css = npmcss('node_modules/github-markdown-css/github-markdown.css');

var options = {
  views: {
    path: 'templates',
    engines: {
      html: 'handlebars'
    }
  }
};

// Create a server with a host, port, and options
var server = Hapi.createServer('localhost', 9247, options);

// landing page
server.route({
  method: 'GET',
  path: '/',
  handler: function (request, reply) {

    // Render the view with the custom greeting
    reply.view('readme.html', { css: github_markdown_css });
  }
});

// test-endpoint
server.route({
  method: '*',
  path: '/endpoint',
  handler: function (request, reply) {
    console.log("Params:");
    console.log(request.params);
    console.log("\nQuery:");
    console.log(request.query);
    console.log("\nMethod:");
    console.log(request.method);
    console.log("\nBody:");
    console.log(request.payload);
    console.log("\n\n\n\n");
    reply("Maunz!");
  }
});

// example post
server.route({
  method: 'GET',
  path: '/post',
  handler: function (request, reply) {
    // default params
    var params = {
      css: github_markdown_css,
      head: false,
      link: false,
      a: false,
      rel: "webmention",
      endpoint: server.info.uri + "/endpoint"
    };

    // check "link" type
    if (request.query.type) {
      var type = request.query.type.split(",");

      // show <a /> (inside <body />)
      if (type.indexOf("a") >= 0)
        params.a = true;

      // show <link /> (inside <head />)
      if (type.indexOf("link") >= 0)
        params.link = true;

      // show link http header
      if (type.indexOf("head") >= 0)
        params.head = true;
    }

    // check "rel" version
    if (request.query.rel) {
      // use URI instead of ID
      if (request.query.rel == "uri")
        params.rel = "http://webmention.org/";

      // use URL and ID
      if (request.query.rel == "both")
        params.rel = "webmention http://webmention.org/";
    }

    // check "URL" type
    if (request.query.url && request.query.url == "rel") {
      params.endpoint = "/endpoint";
    }

    // show http link header
    if (params.head) {
      // Render the view with the custom greeting
      reply.view('post.html', params).header('Link', '<'+params.endpoint+'?type=head>; rel="'+params.rel+'"');
    // or not
    } else {
      reply.view('post.html', params);
    }
}
});

// Start the server
server.start();