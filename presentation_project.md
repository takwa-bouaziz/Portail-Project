# Presentation du projet: Career Copilot

## Slide 1 - Titre
**Career Copilot**  
Assistant intelligent pour la candidature et la preparation aux entretiens

- Projet full-stack base sur React et Django
- Utilisation d'un modele d'IA via l'API Hugging Face
- Objectif: aider un candidat a mieux preparer sa candidature

## Slide 2 - Contexte et probleme
Aujourd'hui, beaucoup de candidats rencontrent les memes difficultes:

- rediger une lettre de motivation adaptee a chaque offre
- preparer un entretien de maniere ciblee
- savoir si leur CV correspond vraiment au poste
- ameliorer certaines parties du CV sans tout recommencer

Notre objectif a donc ete de creer une plateforme simple, centralisee et assistee par IA pour repondre a ces besoins.

## Slide 3 - Solution proposee
Career Copilot regroupe 4 fonctionnalites principales:

1. Generation de lettre de motivation
2. Simulation d'entretien avec feedback et score
3. Analyse de matching entre CV et offre d'emploi
4. Reformulation d'une section du CV

L'utilisateur saisit ses informations, le frontend envoie la requete au backend, puis le backend interroge le modele d'IA et renvoie un resultat exploitable.

## Slide 4 - Architecture generale
Architecture du projet:

- **Frontend**: React + Vite
- **Backend**: Django + Django REST Framework
- **Base de donnees**: SQLite
- **IA**: API Hugging Face
- **Communication**: requetes HTTP via Axios

Flux general:

1. L'utilisateur interagit avec l'interface React
2. React envoie une requete a une route API Django
3. Django prepare un prompt pour le modele
4. Hugging Face genere la reponse
5. Le backend renvoie le resultat au frontend
6. L'utilisateur visualise, copie ou reutilise le contenu

## Slide 5 - Fonctionnalite 1: Lettre de motivation
Cette fonctionnalite permet de generer une lettre de motivation personnalisee a partir de:

- nom du candidat
- poste vise
- entreprise
- contenu du CV
- description de l'offre

Valeur ajoutee:

- gain de temps
- meilleure personnalisation
- premier brouillon plus professionnel

Le resultat peut ensuite etre copie ou telecharge.

## Slide 6 - Fonctionnalite 2: Simulation d'entretien
Cette partie permet de preparer un entretien en deux etapes:

1. generation de 5 questions adaptees au poste et au CV
2. evaluation de chaque reponse avec un score sur 10 et un feedback

En fin de session, l'application calcule un score global et affiche un resume complet.

Interet:

- entrainement progressif
- feedback immediat
- meilleure preparation avant un vrai entretien

## Slide 7 - Fonctionnalites 3 et 4: CV Matching et reformulation
### CV Matching
- comparaison entre le CV et l'offre d'emploi
- generation d'un score de compatibilite sur 100
- identification des points forts
- mise en avant des competences manquantes
- suggestions d'amelioration concretes

### Reformulation CV
- l'utilisateur choisit une section du CV
- l'outil la reecrit dans un style plus professionnel
- l'application affiche l'avant/apres
- des notes d'amelioration expliquent les changements

## Slide 8 - Choix techniques et points forts
Nos choix techniques repondent a trois objectifs:

- **simplicite**: React pour une interface fluide, Django pour une API rapide a mettre en place
- **modularite**: chaque fonctionnalite est separee en composants et en routes dediees
- **evolutivite**: il est facile d'ajouter d'autres outils RH ou d'autres modeles d'IA

Points forts du projet:

- interface unique pour plusieurs besoins candidat
- logique metier clairement separee par modules
- integration reelle d'une IA generative
- stockage de certaines donnees comme les lettres et sessions d'entretien

## Slide 9 - Limites et ameliorations futures
Limites actuelles:

- dependance a la qualite des reponses du modele d'IA
- configuration locale necessaire pour les cles et variables d'environnement
- absence d'authentification utilisateur
- base SQLite adaptee au prototype mais pas a grande echelle

Ameliorations possibles:

- gestion de comptes utilisateurs
- historique complet des analyses
- export PDF ou DOCX
- analyse de CV a partir de fichiers PDF
- tableaux de bord et statistiques de progression
- deploiement cloud

## Slide 10 - Conclusion
Pour conclure, Career Copilot est une plateforme RH intelligente qui accompagne le candidat sur plusieurs etapes clefs:

- mieux rediger
- mieux se preparer
- mieux adapter son CV

Ce projet montre comment une architecture full-stack simple, combinee a l'IA generative, peut produire un outil concret, utile et evolutif.

Merci pour votre attention.

