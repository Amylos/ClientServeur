var prompt = require('prompt-sync')();
var http = require('node:http');

var login = prompt("login,");
var mdp = prompt("mot de passe?")


const server = http.createServer((req, res) => {
    res.write("Hello world");
    console.log('OMG Rainbows!');
    res.end();
});
// Ce serveur http écoute sur le port 3000.
server.listen(3000);