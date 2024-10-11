// Partie pratique :
// Un client Node (un index.js) qui est en lien avec un serveur

// Côté client :
// Ce client Node affiche d'abord : "Login ?" et "Mot de passe ?"
// Une fois en possession de ces informations, il envoie au serveur le login et le mot de passe.
// En cas de succès, le client affiche les données de manière formattée.

// Côté serveur :
// Le serveur reçoit le login et le mot de passe.
// Il compare avec une source de données qui contient des logins et des hash de mot de passe.
// Si c'est bon, il renvoie des adresses, des produits, une liste de quelque chose au format JSON.
// Si c'est pas bon, il renvoie une erreur.

// Le serveur nécessite deux éléments de stockage :
// La liste des utilisateurs avec login/hash
// La liste des trucs à renvoyer (produits, adresses, ...)
// Ca peut être dans un fichier JSON, ça peut être en BDD, ça peut être où vous voulez.
// Si vous ne savez pas/n'y arrivez pas, des données en dur, c'est pas idéal mais ça fera le taf.

// La communication entre le client et le serveur, c'est vous qui voyez :
// Ca peut être un fetch côté client, avec un serveur http côté serveur
// Ca peut être deux scripts Node, où le premier fait appel à exec() (module child_process) pour appeler le serveur.

const http = require('http');
const url = require('url');
const fs = require('fs');

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const query = parsedUrl.query;

    const login = "login";
    const password = "password";

    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Erreur lors de la lecture du fichier:', err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Erreur serveur');
            return;
        }

        console.log('Contenu de data.json:', data);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(data);
    });
});

server.listen(3000, () => {
    console.log('Serveur à l\'écoute sur le port 3000');
});
