# Organisation Trello - Career Copilot

## Liste 1 : Analyse et preparation

### Carte : Definir le besoin du projet

Description : Identifier le probleme a resoudre : aider les candidats a preparer leurs candidatures et leurs entretiens avec une plateforme assistee par IA.

Checklist :
- Definir les utilisateurs : candidat et conseiller RH
- Lister les fonctionnalites principales
- Definir les donnees necessaires
- Preparer le scenario de demonstration

### Carte : Choisir l'architecture technique

Description : Mettre en place une architecture full-stack avec React pour le frontend et Django REST Framework pour le backend.

Checklist :
- Choisir React + Vite pour l'interface
- Choisir Django pour l'API
- Utiliser SQLite pour le prototype
- Prevoir l'integration avec l'API Hugging Face
- Organiser le projet en dossiers Backend et frontend

## Liste 2 : Backend Django

### Carte : Configurer le projet Django

Description : Initialiser le backend, configurer les routes API, la base de donnees et les applications Django.

Checklist :
- Creer le projet Django RH_Project
- Configurer settings.py
- Ajouter les apps : accounts, cover_letter, interview, cv_tools
- Configurer les URLs principales
- Preparer les migrations

### Carte : Creer le systeme d'authentification

Description : Permettre aux utilisateurs de se connecter avec un role candidat ou conseiller RH.

Checklist :
- Creer le modele UserProfile
- Ajouter les roles : candidat et conseiller RH
- Creer les routes login, register, logout et me
- Gerer la session utilisateur
- Adapter l'acces selon le role

### Carte : Developper la generation de lettre de motivation

Description : Creer une API qui genere une lettre personnalisee a partir du CV, du poste et de l'offre.

Checklist :
- Creer le modele CoverLetter
- Creer la route API de generation
- Construire le prompt IA
- Appeler Hugging Face
- Sauvegarder la lettre generee

### Carte : Developper la simulation d'entretien

Description : Generer des questions d'entretien et evaluer les reponses du candidat avec feedback et score.

Checklist :
- Creer les modeles InterviewSession, InterviewQuestion et InterviewAnswer
- Generer 5 questions adaptees au poste
- Evaluer les reponses utilisateur
- Calculer un score total
- Sauvegarder la session d'entretien

### Carte : Developper le matching CV / offre

Description : Comparer un CV avec une offre d'emploi et retourner un score de compatibilite.

Checklist :
- Creer le modele CvMatchAnalysis
- Generer un score sur 100
- Identifier les points forts
- Identifier les competences manquantes
- Ajouter des suggestions d'amelioration

### Carte : Developper la reformulation de CV

Description : Permettre a l'utilisateur de reformuler une section de CV de maniere plus professionnelle.

Checklist :
- Creer le modele CvRewriteResult
- Recevoir la section du CV
- Generer une version amelioree
- Retourner des notes d'amelioration
- Sauvegarder le resultat

### Carte : Developper les outils conseiller RH

Description : Ajouter des fonctionnalites specifiques au role conseiller RH.

Checklist :
- Generer un guide de questions d'entretien
- Classer plusieurs CV selon une offre
- Creer les modeles HrInterviewGuide et HrCvRanking
- Sauvegarder les resultats RH
- Afficher uniquement ces outils aux conseillers RH

## Liste 3 : Frontend React

### Carte : Creer la structure de l'application React

Description : Mettre en place l'interface principale du portail Career Copilot.

Checklist :
- Initialiser React avec Vite
- Creer App.jsx
- Configurer Axios dans api.js
- Creer la navigation par onglets
- Preparer le style global

### Carte : Creer l'interface d'authentification

Description : Permettre a l'utilisateur de se connecter ou de creer un compte.

Checklist :
- Creer le composant Auth.jsx
- Ajouter formulaire login
- Ajouter formulaire inscription
- Gerer les erreurs
- Rediriger selon le role utilisateur

### Carte : Creer l'interface lettre de motivation

Description : Formulaire candidat pour generer une lettre de motivation personnalisee.

Checklist :
- Creer les champs : nom, poste, entreprise, CV, offre
- Envoyer les donnees au backend
- Afficher la lettre generee
- Ajouter un bouton copier
- Gerer le chargement

### Carte : Creer l'interface simulation d'entretien

Description : Interface permettant de generer des questions, repondre et recevoir un feedback.

Checklist :
- Creer le formulaire poste + CV
- Afficher les questions generees
- Ajouter les reponses du candidat
- Afficher score et feedback
- Afficher le resume final

### Carte : Creer l'interface matching CV

Description : Interface pour comparer un CV avec une offre d'emploi.

Checklist :
- Creer les champs CV et offre
- Afficher le score de compatibilite
- Afficher les points forts
- Afficher les competences manquantes
- Afficher les suggestions

### Carte : Creer l'interface reformulation CV

Description : Interface pour ameliorer une section du CV.

Checklist :
- Choisir le nom de la section
- Ajouter le texte original
- Ajouter le poste cible
- Afficher l'avant/apres
- Afficher les notes d'amelioration

### Carte : Creer l'espace conseiller RH

Description : Ajouter les vues reservees aux conseillers RH.

Checklist :
- Creer HrInterviewGuide.jsx
- Creer HrCvRanking.jsx
- Afficher les onglets RH seulement pour le role conseiller
- Connecter les composants aux APIs
- Afficher les resultats generes

### Carte : Creer l'historique utilisateur

Description : Permettre a l'utilisateur de consulter ses anciennes generations et analyses.

Checklist :
- Creer History.jsx
- Recuperer les donnees depuis le backend
- Afficher les lettres generees
- Afficher les entretiens
- Afficher les analyses CV

## Liste 4 : Integration IA

### Carte : Configurer le client IA Hugging Face

Description : Centraliser les appels vers le modele IA utilise par le projet.

Checklist :
- Creer/configurer ai_client.py
- Ajouter la cle API dans .env
- Preparer les prompts
- Gerer les erreurs API
- Tester les reponses generees

### Carte : Ameliorer les prompts IA

Description : Rendre les resultats plus structures, utiles et adaptes au contexte RH.

Checklist :
- Prompt lettre de motivation
- Prompt questions d'entretien
- Prompt feedback entretien
- Prompt matching CV
- Prompt reformulation CV
- Prompt classement CV RH

## Liste 5 : Tests et validation

### Carte : Tester les APIs backend

Description : Verifier que toutes les routes Django fonctionnent correctement.

Checklist :
- Tester l'authentification
- Tester generation lettre
- Tester entretien
- Tester matching CV
- Tester reformulation CV
- Tester outils RH

### Carte : Tester l'interface frontend

Description : Verifier que chaque ecran fonctionne correctement cote utilisateur.

Checklist :
- Tester connexion et inscription
- Tester navigation entre onglets
- Tester affichage des resultats
- Tester messages d'erreur
- Tester responsive design

### Carte : Corriger les bugs

Description : Identifier et corriger les problemes rencontres pendant les tests.

Checklist :
- Corriger bugs backend
- Corriger bugs frontend
- Corriger erreurs d'affichage
- Corriger problemes d'encodage texte
- Verifier la coherence des donnees sauvegardees

## Liste 6 : Documentation et presentation

### Carte : Rediger la documentation du projet

Description : Expliquer le fonctionnement du projet, les technologies utilisees et les etapes d'installation.

Checklist :
- Presenter le projet
- Decrire l'architecture
- Expliquer les fonctionnalites
- Ajouter les commandes d'installation
- Ajouter les variables d'environnement

### Carte : Preparer la presentation orale

Description : Preparer les slides et le discours de presentation du projet.

Checklist :
- Presenter le contexte
- Presenter la solution
- Montrer l'architecture
- Detailler les fonctionnalites
- Preparer une demonstration
- Presenter les limites et ameliorations futures

### Carte : Preparer la demonstration finale

Description : Organiser un scenario simple pour montrer le projet pendant la soutenance.

Checklist :
- Creer un compte candidat
- Generer une lettre de motivation
- Lancer une simulation d'entretien
- Faire un matching CV/offre
- Montrer la reformulation CV
- Creer un compte conseiller RH
- Montrer le classement CV et le guide entretien

## Liste 7 : Termine

Deplacer ici les cartes une fois realisees :

- Analyse du besoin terminee
- Backend configure
- Authentification terminee
- Fonctionnalites candidat terminees
- Fonctionnalites RH terminees
- Frontend termine
- Tests realises
- Presentation preparee
