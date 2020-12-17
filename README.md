# PostIt_Api
Avant de lancer l'application, il faut:
- installez vagrant + virtual box, cela permet d'héberger la base de données;
Pour lancer l'api:
- tapez "vagrant up" dans le terminal de l'api. (la vm de la bd tourne sur le port 3000)
- tapez "npm run initDB" pour creer la bd de l'api
- tapez ensuite npm run dev pour lancer l'api en local sur le port 3001

Pour l'instant, l'api n'est encore reliée à aucune partie android ou react. Il est donc recommandé d'utiliser PostMan pour tester nos requetes. N'oubliez pas de faire avant tout un login pour obtenir un bearer token avec les identifiants suivants:

POST sur localhost:3001/login/

Pseudo: Test

mot de pass: henallux

la doc de l'api se trouve dans le dossier "swagger" dans le ficher "spec.json". Elle sera plus lisible en mettant le fichier sur ce site :https://editor.swagger.io/

NE PAS OUBLIER: Pour fermer la base de données : "vagrant halt"

