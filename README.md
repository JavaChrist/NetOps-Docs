# EDF DIGIT — Générateur de documents structurés

Application web locale (`netops-docs`, version 0.0.0) pour rédiger des procédures techniques au format de document structuré DIGIT, les prévisualiser et les télécharger. L’écran d’accueil l’intitule « Générateur DIGIT / UNITEEP ». Les textes de page de garde et d’export parlent du modèle **UNITEP**. Le dépôt ne tranche pas entre ces deux graphies.

Elle s’adresse aux personnes qui préparent ce type de document dans un cadre interne. Le pied de page de l’interface indique « Outil interne ». Aucun compte, aucun serveur et aucun tarif ne sont prévus dans le code.

Les brouillons restent dans le navigateur de la personne qui les saisit. Rien n’est envoyé à un service distant.

## Fonctionnalités

### Opérationnelles

- **Liste des documents** (`/`) : titre, référence, indice et type. Ouverture, copie et suppression. Au premier lancement, ou si le stockage est vide, un document vierge est créé. Supprimer le dernier document en recrée un vierge : la liste n’est jamais vide.
- **Création** (`/documents/new`) : document minimal (en-tête, une ligne d’historique, sections « OBJET » et « PERIMETRE D'APPLICATION ») ou l’un des six modèles :
  - Caméra Axis — fixe (étapes d’installation déjà rédigées) ;
  - Caméra Axis — PTZ (étapes déjà rédigées) ;
  - Configuration réseau — adresses IP ;
  - Compte administrateur ;
  - Mise à jour firmware ;
  - Flux vidéo.
- **Édition** (`/documents/:id`) :
  - en-tête (marquage DIGIT, accessibilité, titre, référence, indice, nombre de pages, nombre d’annexes, entité émettrice, résumé, documents associés, type, processus, périmètre, date d’applicabilité) ;
  - historique des indices (indice, date, nature des évolutions, rédacteur, vérificateur, approbateur) ;
  - accessibilité et listes de diffusion EDF et externe, avec le texte associé à chaque niveau (LIBRE, INTERNE, LIMITE, CONFIDENTIEL) ;
  - sections de niveau 1, 2 ou 3, numérotées automatiquement (1, 1.1, 1.1.1). « OBJET » et « PERIMETRE D'APPLICATION » ne peuvent pas être renommées, déplacées ni supprimées ;
  - blocs : texte, liste simple ou numérotée, tableau, tableau ACTION / ILLUSTRATION, image, remarque ou vigilance ;
  - annexes, avec les mêmes types de blocs ;
  - images locales (PNG, JPEG, WebP, GIF), enregistrées dans le document.
- **Aperçu** du document mis en forme (page de garde, accessibilité, diffusion, table des matières, corps, annexes, mentions EDF reprises du modèle).
- **Téléchargement** : JSON (contenu brut), HTML (document autonome) et DOCX (fichier Word). Le nom de fichier reprend le titre.
- **Enregistrement automatique** dans le navigateur, clé `edf-digit-documents:v1`.

Toute adresse inconnue ramène à la liste.

### Partielles

- Le **nombre de pages** et le **nombre d’annexes** sont des champs saisis à la main. Ils ne sont pas recalculés à partir du contenu, malgré le texte d’aide « Saisie ou calcul export ».
- L’aperçu et l’export HTML affichent toujours « Page 1 » sur la couverture. Les numéros de page de la table des matières restent vides. Dans le DOCX, le pied de page Word utilise le numéro de page courant ; le total reprend la valeur saisie, ou reste vide.
- Les modèles IP, compte administrateur, firmware et flux vidéo posent la structure et, pour certains, un tableau d’actions vide. Seuls les modèles caméra fixe et PTZ contiennent des actions déjà rédigées.
- Le logo EDF affiché à l’aperçu et à l’export est une image intégrée au projet. Le champ `logoPlaceholder` existe dans les données mais n’est pas proposé à l’écran.
- Une fonction de migration d’un ancien stockage (`netops-axis-procedures:v1`) est présente dans le code et n’est appelée nulle part. Elle ne recopie rien.
- La suppression depuis la fiche de document passe par une confirmation native du navigateur. La suppression depuis la liste n’en demande pas.

### Simulées

Aucune. L’application n’appelle pas de service fictif. Le rappel « FID / DOCTEAM » inséré dans l’aperçu et les exports est un **texte fixe** du modèle UNITEP. Il n’y a pas de connexion à DOCTEAM, ni de synchronisation des champs.

### Prévues, non implémentées

- Export **PDF** : le type `pdf` existe dans le code, aucun bouton ni génération ne l’utilise.
- Calcul automatique du nombre de pages.
- Reprise d’un ancien format de procédures.
- Import d’un fichier JSON (seul le téléchargement existe).
- Comptes, partage, serveur, mise en ligne.

## Stack

| Élément | Rôle |
| --- | --- |
| React 19 et React DOM | Interface |
| TypeScript | Typage |
| Vite 8 | Serveur de développement et construction |
| React Router 7 | Pages |
| Tailwind CSS 4 | Mise en forme de l’interface |
| Bibliothèque `docx` | Fichier Word |

Pas de base de données, pas d’API et pas de variable d’environnement.

## Installation

Prérequis : Node.js et npm. Le dépôt ne fixe pas de version minimale.

```bash
npm install
npm run dev
```

Le serveur de développement affiche l’adresse locale (en général `http://localhost:5173`). Cette adresse n’est valable que sur la machine où la commande tourne.

## Configuration

Aucune. Il n’y a pas de fichier d’environnement à remplir.

## Commandes

| Commande | Effet |
| --- | --- |
| `npm run dev` | Lance l’application en développement |
| `npm run build` | Vérifie les types puis construit le site dans `dist` |
| `npm run preview` | Sert en local le dossier `dist` déjà construit |
| `npm run lint` | Lance ESLint |

La construction produit des fichiers statiques. Leur présence ne signifie pas que l’application est publiée.

## Données

Tout est stocké dans le `localStorage` du navigateur. Vider les données du site, changer de navigateur ou de profil efface les brouillons. Les images sont incluses dans ce stockage : un document très illustré peut dépasser le quota du navigateur. Dans ce cas, l’enregistrement échoue sans message à l’écran.

Le JSON téléchargé est une copie du document. L’application ne sait pas le réimporter.
