# Mini-Épice — guide de démarrage

Mini-Épice est une application Vue et Express avec une base PostgreSQL. Docker démarre l'application et la base ; seul le port **3000** est utilisé sur l'ordinateur. Vue et l'API sont accessibles à partir de `http://localhost:3000`.

## 1. Préparer l'ordinateur

Installer et démarrer [Docker Desktop](https://www.docker.com/products/docker-desktop/). Attendre que le moteur Docker soit prêt. Git est utile pour cloner le projet ; il est aussi possible de télécharger l'archive ZIP du dépôt et de l'extraire. Il n'est pas nécessaire d'installer Node.js ou PostgreSQL.

## 2. Récupérer le projet

Dans PowerShell :

```powershell
git clone https://github.com/ArielHkr/Mini-Epice.git
cd Mini-Epice
```

Si le dépôt a été téléchargé en ZIP, ouvrir PowerShell dans le dossier extrait qui contient `compose.yaml`, `Dockerfile`, `Backend`, `Frontend` et `database/init.sql`.

## 3. Préparer la configuration

Dans ce dossier, copier le modèle des variables d'environnement :

```powershell
Copy-Item .env.example .env
```

Ouvrir `.env` et renseigner `DB_PASSWORD` et `JWT_SECRET`. Choisir ses propres valeurs ; les secrets du développeur ne sont pas requis. Exemple de structure :

```dotenv
DB_NAME=item_manager
DB_USER=postgres
DB_PASSWORD=choisir_un_mot_de_passe
JWT_SECRET=choisir_une_longue_valeur_aleatoire
```

Les noms de variables doivent correspondre à ceux de `compose.yaml`. Au premier démarrage, Docker crée la base avec ce mot de passe et transmet la même valeur à Express. Si le projet contient aussi `DB_HOST=localhost`, ce réglage sert au développement hors Docker : Compose utilise `db` entre ses conteneurs.

## 4. Démarrer l'application

S'assurer que le port 3000 n'est pas déjà utilisé par un autre serveur local, puis lancer depuis le dossier de `compose.yaml` :

```powershell
docker compose up --build -d
docker compose ps
```

Attendre que `db` soit **healthy** et que `app` soit **Up**. Au premier lancement, Docker télécharge les images et exécute `database/init.sql` pour créer les tables et les éventuelles données de démonstration.

Ouvrir le site : [http://localhost:3000](http://localhost:3000). Pour vérifier l'API directement : [http://localhost:3000/api/items](http://localhost:3000/api/items). Essayer également de rafraîchir `/login` pour vérifier la navigation Vue.

## 5. Tester les comptes et les droits

1. Consulter la liste des items sans être connecté.
2. Aller sur `/register`, créer un compte, puis se connecter sur `/login`.
3. Avec le rôle `user`, vérifier que l'ajout, la modification et la suppression ne sont pas proposés. Une tentative d'accès direct à une page réservée affiche la page d'accès refusé. Par exemple, vous ne pourrez pas ouvrir localhost:3000/items/add, même authentifié.

Les comptes créés depuis le formulaire ont le rôle `user`. Pour tester le rôle `admin`, promouvoir le compte qui vient d'être créé. Avec les valeurs `DB_USER=postgres` et `DB_NAME=item_manager` de l'exemple :

```powershell
docker compose exec db psql -U postgres -d item_manager
```

Dans la console PostgreSQL, remplacer l'adresse par celle utilisée à l'inscription :

```sql
UPDATE users
SET role = 'admin'
WHERE email = 'adresse-du-compte@example.com';
```

La commande doit indiquer `UPDATE 1`. Vérifier au besoin :

```sql
SELECT id, name, email, role FROM users;
```

Quitter avec `\q`, se déconnecter du site, puis se reconnecter. Le compte administrateur peut maintenant ajouter, modifier et supprimer des items. Les opérations sont vérifiées par l'API, en plus de l'affichage des boutons dans Vue.

## 6. Arrêter et reprendre

```powershell
docker compose down
```

Cette commande arrête les conteneurs en conservant la base dans le volume Docker. Pour reprendre :

```powershell
docker compose up -d
```

Pour reconstruire après une modification du code :

```powershell
docker compose up --build -d
```

`database/init.sql` s'exécute uniquement quand le volume de la base est vide. Les comptes et items créés pendant la correction restent dans le volume local ; ils ne sont pas inclus dans le dépôt Git.

## En cas de problème

Vérifier l'état et lire les journaux :

```powershell
docker compose ps -a
docker compose logs --tail=100 app db
```

- Si `localhost:3000` refuse la connexion, vérifier que `app` est **Up** et qu'aucun autre programme n'utilise le port 3000.
- Si une variable manque, vérifier le fichier `.env` dans le même dossier que `compose.yaml`.
- Si `app` s'arrête avec `Cannot find package`, vérifier que les dépendances utilisées figurent dans `Backend/package.json` et `Backend/package-lock.json`, puis reconstruire.
- Pour repartir d'une base entièrement neuve, supprimer le volume avec `docker compose down -v` **efface définitivement tous les comptes et items de cette installation**. N'utiliser cette commande que si cette suppression est voulue.
