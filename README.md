# Career Copilot

Career Copilot est un portail web d'accompagnement a la recherche d'emploi, assiste par IA. Il aide les candidats a preparer leurs candidatures et leurs entretiens, tout en proposant aux conseillers RH des outils pour analyser des profils et preparer des guides d'entretien.

Le projet est construit avec un backend Django REST Framework, un frontend React/Vite et une integration Hugging Face pour la generation de contenus.

## Fonctionnalites

### Espace candidat

- Creation de compte et connexion.
- Generation d'une lettre de motivation personnalisee a partir du CV, du poste, de l'entreprise et de l'offre.
- Simulation d'entretien avec generation de questions, reponses du candidat, feedback et score.
- Analyse de compatibilite entre un CV et une offre d'emploi.
- Reformulation professionnelle d'une section de CV.
- Consultation de l'historique des lettres, entretiens et analyses.

### Espace conseiller RH

- Generation d'un guide de questions d'entretien pour un poste.
- Classement de plusieurs CV selon une offre d'emploi.
- Acces aux outils RH selon le role utilisateur.

## Stack technique

- Frontend : React, Vite, Axios
- Backend : Django, Django REST Framework
- Base de donnees : SQLite
- IA : Hugging Face Router / Inference API
- Authentification : sessions Django avec roles utilisateur

## Structure du projet

```text
project/
|-- Backend/
|   |-- RH_Project/          # Configuration Django
|   |-- accounts/            # Authentification, roles et historique
|   |-- cover_letter/        # Generation de lettres de motivation
|   |-- interview/           # Simulation d'entretien
|   |-- cv_tools/            # Matching CV, reformulation et outils RH
|   |-- ai_client.py         # Client Hugging Face
|   |-- manage.py
|   `-- db.sqlite3
|-- frontend/
|   |-- src/
|   |   |-- components/      # Composants React
|   |   |-- api.js           # Configuration Axios
|   |   `-- App.jsx
|   |-- package.json
|   `-- vite.config.js
`-- README.md
```

## Prerequis

- Python 3.10 ou plus recent
- Node.js 18 ou plus recent
- npm
- Un token Hugging Face

## Installation

### 1. Cloner le projet

```bash
git clone <url-du-repository>
cd project
```

### 2. Configurer le backend

```bash
cd Backend
python -m venv .venv
```

Activer l'environnement virtuel :

```bash
# Windows
.venv\Scripts\activate

# macOS / Linux
source .venv/bin/activate
```

Installer les dependances Python :

```bash
pip install django djangorestframework django-cors-headers requests
```

Creer un fichier `.env` dans le dossier `Backend/` :

```env
HF_API_TOKEN=votre_token_huggingface
HF_API_URL=https://router.huggingface.co/v1/chat/completions
HF_MODEL=Qwen/Qwen2.5-7B-Instruct:featherless-ai
HF_API_TIMEOUT=120
```

Appliquer les migrations :

```bash
python manage.py migrate
```

Lancer le serveur Django :

```bash
python manage.py runserver
```

Le backend est disponible sur :

```text
http://localhost:8000
```

### 3. Configurer le frontend

Dans un deuxieme terminal :

```bash
cd frontend
npm install
```

Optionnel : creer un fichier `.env` dans `frontend/` si l'API n'est pas sur l'URL par defaut.

```env
VITE_API_URL=http://localhost:8000
```

Lancer l'application React :

```bash
npm run dev
```

Le frontend est disponible sur :

```text
http://localhost:5173
```

## Scripts utiles

### Backend

```bash
python manage.py runserver
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
```

### Frontend

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Routes API principales

### Authentification

| Methode | Route | Description |
|---|---|---|
| POST | `/api/accounts/register/` | Creer un compte |
| POST | `/api/accounts/login/` | Se connecter |
| POST | `/api/accounts/logout/` | Se deconnecter |
| GET | `/api/accounts/me/` | Recuperer l'utilisateur connecte |
| GET | `/api/accounts/history/` | Recuperer l'historique utilisateur |

### Lettre de motivation

| Methode | Route | Description |
|---|---|---|
| POST | `/api/cover-letter/generate/` | Generer une lettre de motivation |
| GET | `/api/cover-letter/<id>/` | Consulter une lettre generee |

### Entretien

| Methode | Route | Description |
|---|---|---|
| POST | `/api/interview/start/` | Demarrer une simulation d'entretien |
| POST | `/api/interview/answer/` | Envoyer une reponse et recevoir un feedback |
| GET | `/api/interview/summary/<session_id>/` | Consulter le resume d'un entretien |

### Outils CV et RH

| Methode | Route | Description |
|---|---|---|
| POST | `/api/cv-tools/match/` | Analyser la compatibilite CV/offre |
| POST | `/api/cv-tools/rewrite/` | Reformuler une section de CV |
| POST | `/api/cv-tools/hr/interview-guide/` | Generer un guide d'entretien RH |
| POST | `/api/cv-tools/hr/rank-cvs/` | Classer plusieurs CV pour une offre |

## Roles utilisateur

Le projet utilise deux roles :

- `candidat` : acces aux outils de candidature, d'entretien, de matching CV et d'historique.
- `conseiller_rh` : acces aux outils RH, notamment le guide d'entretien et le classement de CV.

Le role est stocke dans le modele `UserProfile`.

## Scenario de demonstration

1. Creer un compte candidat.
2. Generer une lettre de motivation pour une offre.
3. Lancer une simulation d'entretien et repondre aux questions.
4. Tester le matching CV/offre.
5. Reformuler une section du CV.
6. Consulter l'historique.
7. Creer ou utiliser un compte conseiller RH.
8. Generer un guide d'entretien et classer plusieurs CV.

## Notes de developpement

- Le backend lit les variables d'environnement depuis `Backend/.env`.
- Le frontend utilise `VITE_API_URL` ou, par defaut, `http://localhost:8000`.
- Les requetes Axios sont configurees avec `withCredentials: true` pour utiliser les sessions Django.
- CORS autorise par defaut `http://localhost:5173` et `http://127.0.0.1:5173`.
- La base SQLite est adaptee pour un prototype ou une demonstration locale.

## Ameliorations possibles

- Ajouter un fichier `requirements.txt` pour figer les dependances Python.
- Ajouter des tests automatises backend et frontend.
- Remplacer SQLite par PostgreSQL pour un deploiement reel.
- Securiser la configuration Django pour la production.
- Ajouter une gestion plus avancee des erreurs IA et des limites d'API.
- Exporter les lettres, analyses et guides en PDF.

## Auteur

Projet realise dans le cadre du module Developpement de portail et d'outils de travail collaboratifs.
