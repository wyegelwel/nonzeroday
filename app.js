var express = require("express");
var logfmt = require("logfmt");
var http = require('http');
var path = require('path');
var app = express();

app.use(logfmt.requestLogger());
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


console.log(__dirname);

app.get('/', function(req, res) {
  res.sendfile(__dirname + "/views/index.html");
});

var server = http.createServer(app);
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
