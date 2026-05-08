# Discours de presentation - 10 minutes

Bonjour a toutes et a tous,

Aujourd'hui, je vais vous presenter notre projet intitule **Career Copilot**.

Il s'agit d'une application web intelligente destinee a accompagner les candidats dans plusieurs etapes importantes de leur recherche d'emploi. L'idee principale est simple: au lieu d'utiliser plusieurs outils separes pour rediger une lettre de motivation, analyser un CV ou preparer un entretien, nous avons voulu centraliser ces besoins dans une seule plateforme, avec l'aide de l'intelligence artificielle.

Le probleme de depart est tres concret. Quand une personne postule a une offre, elle doit souvent adapter son CV, rediger une lettre de motivation personnalisee, verifier si son profil correspond reellement au poste, puis se preparer a un eventuel entretien. Toutes ces taches prennent du temps et ne sont pas toujours faciles, surtout pour un etudiant ou un jeune diplome. C'est donc dans ce contexte que nous avons imagine Career Copilot.

Notre projet est une application full-stack, c'est-a-dire qu'il comporte une partie frontend et une partie backend. Le frontend a ete developpe avec **React** et **Vite**, ce qui nous permet d'avoir une interface moderne, fluide et reactive. Le backend a ete developpe avec **Django** et **Django REST Framework**, pour exposer des API claires et bien separees. Enfin, pour la partie intelligence artificielle, nous utilisons un modele accessible via l'API de **Hugging Face**.

Le fonctionnement global est le suivant: l'utilisateur saisit ses informations dans l'interface, par exemple son CV ou une offre d'emploi. Le frontend envoie ensuite une requete HTTP au backend. Le backend construit un prompt adapte a la demande, l'envoie au modele d'IA, recupere la reponse, puis la renvoie au frontend pour l'affichage. Dans certains cas, comme pour la lettre de motivation ou les sessions d'entretien, des donnees sont aussi enregistrees dans la base SQLite.

Je vais maintenant presenter les quatre fonctionnalites principales du projet.

La premiere fonctionnalite est la **generation de lettre de motivation**. L'utilisateur renseigne son nom, le poste vise, l'entreprise, un resume de son CV ainsi que la description de l'offre d'emploi. A partir de ces informations, le backend genere un prompt qui demande au modele de produire une lettre de motivation professionnelle et coherente. L'avantage de cette fonctionnalite est qu'elle fait gagner du temps a l'utilisateur tout en proposant un contenu plus cible qu'une lettre generique. Une fois la lettre generee, elle peut etre affichee, copiee ou telechargee.

La deuxieme fonctionnalite est la **simulation d'entretien**. Ici, l'utilisateur indique un poste cible et colle le contenu de son CV. Le systeme cree alors une session d'entretien et demande a l'IA de generer exactement cinq questions pertinentes en lien avec le profil et le poste. Ensuite, l'utilisateur repond a chaque question, et chaque reponse est evaluee par l'IA avec un score sur 10 ainsi qu'un feedback. A la fin, l'application calcule un score global et affiche un resume detaille de la session. Cette fonctionnalite est interessante parce qu'elle transforme l'IA en coach d'entrainement, et pas seulement en generateur de texte.

La troisieme fonctionnalite est le **matching CV / offre d'emploi**. Dans ce cas, l'utilisateur fournit son CV et l'offre cible. Le backend demande alors a l'IA d'analyser la compatibilite entre les deux contenus et de renvoyer un resultat structure au format JSON. Ce resultat contient un score de correspondance sur 100, un resume global, les points forts du CV, les competences manquantes, ainsi que des suggestions d'amelioration. Cette fonctionnalite est tres utile car elle aide l'utilisateur a comprendre pourquoi son CV correspond, ou au contraire pourquoi il risque de ne pas retenir l'attention du recruteur.

La quatrieme fonctionnalite est la **reformulation d'une section du CV**. Au lieu de refaire tout le CV, l'utilisateur peut choisir une section precise, comme le resume professionnel, l'experience, les competences, l'education ou les projets. Il colle ensuite le texte original, indique eventuellement le poste vise, puis l'application propose une version reformulee plus claire, plus concise et plus professionnelle. Le systeme affiche egalement des notes expliquant les ameliorations apportees. Cette approche est interessante car elle aide a ameliorer la qualite redactionnelle sans denaturer le contenu.

Sur le plan technique, nous avons structure le backend en plusieurs modules. Nous avons par exemple un module dedie aux lettres de motivation, un module pour l'entretien, et un module pour les outils CV. Cette separation rend le projet plus lisible et plus facile a maintenir. Cote frontend, chaque fonctionnalite correspond a un composant React distinct, ce qui facilite aussi l'organisation du code et l'evolution future de l'interface.

Un autre point important est la robustesse de l'echange avec l'IA. Dans certaines fonctionnalites, nous avons demande a l'IA de renvoyer une structure JSON precise. Ensuite, le backend tente de parser cette reponse. Si jamais la reponse du modele n'est pas parfaitement conforme, nous avons prevu des mecanismes de secours avec des valeurs par defaut. Cela rend l'application plus stable et evite un blocage complet de l'interface.

Parlons maintenant des points forts du projet.

Le premier point fort est son **utilite concrete**. Ce n'est pas une demonstration abstraite de l'IA: c'est un outil directement lie a un besoin reel, celui de mieux preparer une candidature.

Le deuxieme point fort est la **complementarite des fonctionnalites**. Au lieu de proposer une seule action isolee, notre application couvre plusieurs etapes du parcours candidat: redaction, analyse, adaptation et preparation orale.

Le troisieme point fort est la **modularite technique**. L'architecture choisie permet d'ajouter facilement d'autres outils plus tard, comme un generateur de reponses RH, un tableau de bord utilisateur ou encore un systeme d'historique.

Bien sur, le projet a aussi certaines limites.

D'abord, la qualite des resultats depend du modele d'IA et de la qualite des informations fournies par l'utilisateur. Si le CV est incomplet ou si l'offre est mal decrite, le resultat sera moins pertinent.

Ensuite, l'application est aujourd'hui un prototype fonctionnel. Elle ne gere pas encore l'authentification, la personnalisation par utilisateur, ni un deploiement a grande echelle. De plus, la base SQLite convient tres bien au developpement, mais une version de production utiliserait plutot PostgreSQL ou une autre base plus robuste.

Enfin, plusieurs ameliorations sont envisageables pour la suite. Nous pourrions ajouter un systeme de comptes utilisateurs, un historique des sessions, l'import de fichiers PDF, l'export des resultats en PDF ou DOCX, ainsi qu'un deploiement en ligne. Nous pourrions aussi enrichir la partie entretien avec des conseils plus detailles ou un suivi de progression.

Pour conclure, Career Copilot est une application web intelligente qui aide les candidats a mieux preparer leur dossier et leurs entretiens. Ce projet nous a permis de combiner developpement frontend, developpement backend, structuration d'API et integration d'intelligence artificielle dans un cas d'usage concret. Au-dela de la technique, il repond surtout a un vrai besoin utilisateur, ce qui lui donne une valeur pratique et evolutive.

Merci pour votre attention.

