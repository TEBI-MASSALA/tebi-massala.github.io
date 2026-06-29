# Site personnel — Son Cliter Tebi Massala

Site statique publié gratuitement sur **GitHub Pages**.
Adresse : https://tebi-massala.github.io

## Comment ajouter un document à télécharger

Cette version n'a pas d'espace d'administration (GitHub Pages n'exécute pas de
back-end). On ajoute un document en deux temps :

1. **Déposer le fichier** dans le dossier `documents/`
   (par exemple `documents/cv.pdf`).
2. **Déclarer le document** dans le fichier `documents.json`, en ajoutant un objet
   dans la liste `documents` :

   ```json
   {
     "categories": ["documents-personnels", "algorithmes", "sujets-de-recherche"],
     "documents": [
       {
         "title": "Curriculum vitae",
         "description": "CV à jour (PDF).",
         "category": "documents-personnels",
         "file": "documents/cv.pdf"
       }
     ]
   }
   ```

   - `title` : le titre affiché.
   - `description` : courte description (facultative).
   - `category` : l'une des trois catégories ci-dessus.
   - `file` : le chemin du fichier déposé à l'étape 1.

3. **Publier** : envoyez les modifications sur GitHub. Le site se met à jour
   automatiquement en une à deux minutes.

   ```bash
   git add documents/ documents.json
   git commit -m "Ajout d'un document"
   git push
   ```

## Remplacer la photo

Remplacez le fichier `img/portrait.jpg` par votre nouvelle photo (même nom), puis
publiez (`git add`, `git commit`, `git push`).

## Structure

```
.
├── index.html        # Page unique (toutes les sections)
├── 404.html
├── css/styles.css
├── js/main.js
├── img/              # portrait.jpg, favicon.svg, portrait.svg (repli)
├── documents/        # vos fichiers à télécharger
└── documents.json    # liste des documents affichés
```
