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
const bcrypt = require('bcrypt');

// Créer le serveur HTTP
const server = http.createServer((req, res) => {
    if (req.method === 'POST') {
        let body = '';

        // Lire les données de la requête
        req.on('data', chunk => {
            body += chunk.toString(); // Accumule les fragments de données
        });

        // Quand toutes les données sont reçues
        req.on('end', () => {
            try {
                // Parse le corps de la requête en JSON
                const parsedData = JSON.parse(body);
                const {login, password} = parsedData;
                console.log('Données reçues du client :', login,password);


                fs.readFile('data.json', 'utf8', (err, data) => {
                    if (err) {
                        console.error('Erreur lors de la lecture du fichier:', err);
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Erreur serveur');
                        return;
                    }

                    let parsedFileData;
                    try {
                        parsedFileData = JSON.parse(data);
                        parsedFileData.map((personne)=>{

                            bcrypt.compare(password, personne.password, (err, result) => {
                                if (err) {
                                    console.error('Erreur lors de la comparaison:', err);
                                } else if (result) {
                                    console.log('Le mot de passe est valide !');
                                    // Réponse au client avec les données parsées
                                    res.writeHead(200, { 'Content-Type': 'application/json' });
                                    res.end(JSON.stringify({
                                        message: 'Addresse de l utilisateur',
                                        address: personne.address,
                                    }));
                                } else {
                                    console.log('Le mot de passe est invalide.');
                                }
                            });
                        });

                    } catch (parseError) {
                        console.error('Erreur lors du parsing de data.json:', parseError);
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Erreur lors du parsing du fichier JSON');
                        return;
                    }

                  
                });

            } catch (error) {
                console.error('Erreur lors du parsing des données:', error);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Erreur lors du parsing des données' }));
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Seules les requêtes POST sont supportées');
    }
});

// Démarrer le serveur sur le port 3000
server.listen(3000, () => {
    console.log('Serveur à l\'écoute sur le port 3000');
});



   // fs.readFile('data.json', 'utf8', (err, data) => {
    //     if (err) {
    //         console.error('Erreur lors de la lecture du fichier:', err);
    //         res.writeHead(500, { 'Content-Type': 'text/plain' });
    //         res.end('Erreur serveur');
    //         return;
    //     }

    //     console.log('Contenu de data.json:', data);

    //     res.writeHead(200, { 'Content-Type': 'application/json' });
    //     res.end(data);
    // });




  