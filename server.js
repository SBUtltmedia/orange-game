var express = require('express'),
       path = require('path'),
        app = express(),
       port = 3000;

// Include static assets. Not advised for production
app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.listen(port);
console.log('Server is Up and Running at Port : ' + port);
