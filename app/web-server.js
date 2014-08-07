var express = require("express"),
    app     = express(),
    port    = parseInt(process.env.PORT, 10) || 3000;

app.use(express.static(__dirname + '/public'));

app.listen(port);
console.log('Now serving the app at http://localhost:' + port + '/');
