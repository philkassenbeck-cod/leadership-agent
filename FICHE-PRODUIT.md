# Leadership Agent Optimup — Fiche produit

*Document de travail pour préparer une présentation commerciale et une grille de prix. Rédigé le 18.10.2026. Tout ce qui suit est exact par rapport au fonctionnement réel de l'outil (vérifié dans le code).*

---

## 1. En une phrase

Un agent d'analyse StrengthsFinder qui transforme les rapports Gallup de vos clients en débriefs de leadership profonds, nuancés et prêts à remettre, en gardant VOTRE signature de coach et VOTRE méthode Optimup.

**Pour qui** : coachs, formateurs, consultants RH qui travaillent avec le CliftonStrengths / StrengthsFinder (34 forces). En individuel, en binôme, et en équipe.

---

## 2. Les trois modes d'analyse (plus le mode « pitch seul »)

| Mode | Ce qu'il produit | Entrée |
|---|---|---|
| **Individuel** | Un portrait de leadership complet en 6 parties, plus un pitch à la première personne. | Top 5 ou top 10 d'une personne. |
| **Binôme** | Une analyse de la dynamique entre deux personnes (pairs, manager/collaborateur, co-fondateurs, transverse). | Les 2 profils. |
| **Équipe** | Une analyse collective (jusqu'à 20 personnes) : forces dominantes, angles morts, perception externe, leviers, synergies, et un pitch d'équipe. | Jusqu'à 20 profils. |

**Mode « pitch seul »** (option, une simple case à cocher) : au lieu du débrief complet, l'agent ne génère que le pitch. En équipe, il sort un pitch « je » par personne plus un pitch collectif « nous », chacun sur sa propre page à l'export. Utile pour un atelier ou une mise en avant rapide.

---

## 3. Le parcours, étape par étape

1. **Connexion.** Accès réservé par mot de passe maître ou par code d'accès à durée limitée (voir §7).
2. **Choix du mode** : individuel, binôme ou équipe.
3. **Saisie des forces.** Deux façons :
   - **Import automatique** du PDF Gallup (lu directement dans le navigateur, les forces sont extraites toutes seules), un par un ou en lot.
   - **Saisie manuelle** avec autocomplétion des 34 forces.
4. **Contexte** (optionnel mais utile) : prénom, rôle, niveau de responsabilité, objectif du débrief, secteur, nom de l'équipe, chef d'équipe.
5. **Génération.** L'agent calcule d'abord des statistiques exactes, puis rédige le débrief ancré sur votre méthode.
6. **Lecture et approfondissement.** Un chat permet de poser des questions de suivi, d'ajuster, de creuser une force.
7. **Export** en PDF ou en Word, à la charte Optimup, prêt à remettre au client.

---

## 4. Ce qui rend l'analyse unique (le moteur)

Ce n'est pas « du ChatGPT sur les forces ». Quatre choses la distinguent :

- **Un référentiel Optimup intégré.** L'agent s'appuie sur VOTRE matière : les 34 forces avec leur définition, une formulation « je » par force, une zone de vigilance, une question puissante validée par force, une banque de 50 questions puissantes (dont 20 favorites), et des notes de profondeur sur les familles de forces. L'analyse est donc ancrée sur votre travail, pas sur les généralités d'une IA.

- **Des calculs exacts, pas « au feeling ».** Avant de rédiger, l'outil calcule de façon déterministe : la répartition par domaine, le classement pondéré des forces de l'équipe, les forces communes et complémentaires, les paires de friction, les forces absentes, et la **tension centrale** (la « collision » entre les forces du haut). Ces chiffres sont injectés comme des faits : la lecture reste stable d'une génération à l'autre.

- **Des grilles d'analyse reconnues.** Lecture de synergie et d'antagonisme (modèle Fauvet, cohésion interne contre ouverture), plus quatre lentilles d'équipe : concentration contre mission, point de saturation, adéquation au contexte, et contre-talent. Le tout traduit en clair, sans jargon.

- **Un double passage qualité.** Un premier moteur rédige en profondeur (Claude Opus), un second relit et polit la langue (Claude Sonnet, plus rapide). Le résultat est à la fois profond et fluide.

Et surtout, **vos règles de style et d'éthique sont dans le moteur** : clarté avant la beauté, sobriété (pas de superlatifs), pas de flatterie, les forces nommées en langage naturel avec le thème discrètement entre parenthèses, et des règles de confidentialité strictes (voir §6).

---

## 5. Les livrables

- **Débrief individuel** : avant-propos « comment lire ce portrait », portrait, zones de vigilance, leviers de développement, perception par les autres, trois questions puissantes (dont une « question plus osée »), un pitch à la première personne, et une lettre signée du coach.
- **Analyse d'équipe** : forces dominantes, angles morts, perception externe, leviers concrets, synergies et conditions de performance, pitch d'équipe, et une note d'atelier.
- **Analyse de binôme** : ressemblances, complémentarités, points de friction, et ce que le duo construit ensemble.
- **Pitchs** (mode pitch seul) : individuels et collectifs, un par page.
- **Exports** PDF et Word à la charte Optimup (police Arial, orange Optimup, encadrés), prêts à remettre.
- **Chat de suivi** dans chaque mode, pour approfondir après coup.

---

## 6. Confidentialité et éthique intégrées

Ces règles sont codées dans l'agent, elles s'appliquent automatiquement à chaque génération :

- **Aucun nom de marque ni d'entreprise** n'est cité dans les débriefs.
- **Aucun nom de tiers** n'est mentionné dans l'analyse.
- La matière source a été nettoyée de tout nom et prénom réels.
- Le pitch ne nomme jamais les thèmes officiels (langage naturel uniquement).

C'est un argument commercial réel : l'outil respecte la confidentialité des personnes par conception.

---

## 7. Sécurité et protection des données

*(Partie la plus importante pour rassurer un client ou un service RH. Les points ci-dessous sont exacts.)*

### Architecture : « privacy by design »

- **Aucune base de données. Aucune donnée personnelle stockée.** C'est le point clé. Les forces et le contexte saisis servent uniquement à générer le débrief en direct, puis ne sont conservés nulle part côté serveur. Une fois le document téléchargé et l'onglet fermé, il ne reste aucune copie sur le serveur.
- **Les PDF Gallup sont lus dans le navigateur**, sur le poste du coach. Le fichier PDF lui-même n'est jamais envoyé sur un serveur : seules les forces extraites servent à l'analyse.
- **Surface d'attaque minimale** : l'application repose sur très peu de composants (Next.js, React, le SDK de l'IA), ce qui limite les failles possibles.

### Accès et authentification

- Accès **réservé** : mot de passe maître, ou **codes d'accès à durée limitée** que vous distribuez vous-même à vos clients (par exemple pour deux semaines).
- **Deux portées de code** : « accès complet » ou « pitch seul » (le client ne peut alors générer que des pitchs, le reste de l'interface est grisé).
- Les codes et les sessions sont **signés cryptographiquement** (HMAC-SHA256) et portent leur propre date d'expiration. Ils sont **sans stockage serveur** et ne peuvent pas être falsifiés.
- La session passe par un **cookie sécurisé** (httpOnly, transmis uniquement en HTTPS), impossible à lire ou à manipuler depuis le navigateur. La vérification se fait côté serveur, impossible à contourner.
- Comparaisons à temps constant (protection contre les attaques par chronométrage).

### Hébergement et transit

- Hébergé chez **Vercel, région Francfort (Allemagne, Union européenne)**. Les données transitent donc en Europe, pas aux États-Unis par défaut.
- **Chiffrement en transit (HTTPS/TLS)** sur toutes les communications.

### Le seul sous-traitant externe : l'IA

- La génération des textes passe par l'**API d'Anthropic (Claude)**. Le profil (forces, prénom, rôle) est donc transmis à Anthropic le temps de produire le texte.
- Points à connaître et à faire valoir : les données envoyées via l'API **ne servent pas à entraîner les modèles**, et la rétention est limitée. C'est un traitement, pas un stockage durable.

---

## 8. RGPD et nLPD suisse

L'outil est très bien placé pour la conformité, parce qu'il **ne stocke rien**. Points forts :

- **Minimisation des données** : on ne saisit que les forces, et au choix un prénom et un rôle. Le prénom n'est même pas obligatoire (le débrief fonctionne sans). Aucune donnée « sensible » au sens de la loi n'est requise.
- **Pas de conservation** : le « droit à l'effacement » est trivial, puisqu'il n'y a aucune copie à effacer côté serveur.
- **Pas de cookies de pistage ni de traceurs publicitaires** : le seul cookie est fonctionnel (la session de connexion), ce qui relève de l'exemption « cookie strictement nécessaire ». Pas de bandeau cookies imposé en principe.
- **Hébergement en UE** (Francfort), compatible RGPD. Un hébergement en Suisse ou ailleurs en UE reste configurable si un client l'exige.

### À formaliser avant de vendre à un grand compte (honnêteté)

- Rédiger une **courte notice de confidentialité** (qui traite quoi, où, combien de temps) à remettre au client.
- Prévoir un **accord de sous-traitance (DPA)** mentionnant Anthropic comme sous-traitant, avec les garanties de transfert hors UE adéquates.
- Pour un client très sensible (banque, santé) : on peut proposer le mode « pitch » ou l'anonymisation complète (sans prénom), déjà possible.

---

## 9. Multilingue

L'interface ET les débriefs existent en **français, allemand et anglais**. Argument fort pour la Suisse et pour des équipes internationales.

---

## 10. Structure de coût (pour poser vos prix)

Le coût variable réel, c'est la **consommation de l'IA** (facturée au nombre de mots traités par Anthropic). Deux leviers d'économie sont déjà en place :

- Un modèle rapide et moins cher pour la relecture.
- La **mise en cache** de la partie fixe des consignes : en rafale (plusieurs débriefs à la suite, pitchs d'équipe), on ne repaie pas le même contenu.

**Ordre de grandeur** (à affiner en mesurant, l'outil journalise déjà la consommation réelle de chaque génération) :

- Un **débrief individuel complet** : de l'ordre de quelques dizaines de centimes.
- Une **analyse d'équipe** (plus longue) : de l'ordre d'un demi-franc à environ un franc.
- Un **pitch seul** : quelques centimes.

Autrement dit, le coût technique par client est très faible devant la valeur perçue d'un débrief de coaching. Cela laisse une marge confortable, que vous vendiez :

- **à l'acte** (un prix par débrief ou par atelier d'équipe),
- **à l'abonnement / location** (accès complet pour X semaines, déjà géré par les codes à durée),
- **en formule « pitch »** à prix réduit (déjà techniquement séparée).

*Recommandation : mesurer le coût réel sur 10 débriefs types avant de figer la grille, puis fixer le prix sur la valeur (positionnement coaching premium), pas sur le coût.*

---

## 11. Pistes de commercialisation déjà supportées par l'outil

- **Deux niveaux d'offre prêts** : « accès complet » et « pitch seul » (séparation technique déjà faite).
- **Location à durée** : les codes d'accès expirent à la date choisie, idéal pour un forfait « 2 semaines », « 1 mois ».
- **Marque blanche de fait** : les livrables sont à votre charte Optimup et signés de vous.
- **Jusqu'à 20 personnes** par analyse d'équipe, en important les rapports au fur et à mesure.

---

## 12. En résumé, les 6 arguments de vente

1. **Profondeur** : un vrai regard de coach, ancré sur la méthode Optimup, pas des généralités d'IA.
2. **Fiabilité** : des calculs exacts et une lecture stable, pas une sortie différente à chaque fois.
3. **Confidentialité par conception** : aucun nom, aucune marque, aucune donnée stockée.
4. **Conformité** : RGPD / nLPD facilitées, hébergement UE, pas de base de données.
5. **Prêt à remettre** : exports PDF et Word à votre charte, en trois langues.
6. **Souplesse commerciale** : à l'acte, en location, ou en formule pitch, avec codes à durée.
