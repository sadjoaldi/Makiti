# Sécurité — Makiti

## Vulnérabilités connues et acceptées

Dernière revue : mai 2026

### axios (via africastalking) — 17 vulnérabilités (high/moderate/low)

**Statut : accepté, risque faible**

- **Origine** : dépendance transitive `africastalking > axios`. Axios n'est pas
  utilisé directement par Makiti.
- **Usage réel** : `africastalking` utilise axios uniquement pour appeler l'API
  officielle d'Africa's Talking (endpoint fixe et de confiance) afin d'envoyer
  les SMS d'OTP. Aucune requête axios n'est dirigée vers un serveur contrôlable
  par un tiers.
- **Pourquoi non corrigé** : `africastalking` est déjà à sa dernière version et
  verrouille une version vulnérable d'axios. Forcer un override d'axios risque
  de casser l'envoi de SMS sans bénéfice de sécurité réel dans notre contexte.
- **Surveillance** : vérifier les mises à jour d'`africastalking` régulièrement
  (`pnpm outdated africastalking`) et appliquer dès qu'une version corrige axios.

### @hono/node-server (via prisma > @prisma/dev) — moderate

**Statut : accepté, risque nul en production**

- Outil de développement Prisma uniquement. Non présent dans le build de
  production.

### postcss (via next) — moderate

**Statut : accepté, risque très faible**

- Outil de build. Non exposé au runtime en production. Sera corrigé
  automatiquement lors d'une future mise à jour de Next.js.

## Bonnes pratiques en place

- Mots de passe hashés (bcrypt), jamais loggés ni renvoyés au client.
- Codes OTP et tokens JWT jamais loggés (filtre d'exception global).
- Helmet, CORS restrictif en production, rate limiting actif.
- Validation stricte des entrées (ValidationPipe : whitelist + forbidNonWhitelisted).

## Contact sécurité

Pour signaler une vulnérabilité : alhassane.diallo.dev@gmail.com
