# Drive Go!

Drive Go! est une application mobile de covoiturage et de réservation de trajets. Le projet contient actuellement le frontend, développé avec React Native et Expo, et une version web.

## Structure

- `app/` : écrans et navigation déclarative avec Expo Router. Les groupes `(auth)`, `(onboarding)`, `(passenger)` et `(driver)` organisent les parcours selon l’authentification et le rôle.
- `src/components/` : composants réutilisables, dont les éléments d’interface et les cartes.
- `src/features/` : logique par domaine, notamment l’authentification, les trajets, le profil et la localisation.
- `src/services/` : services d’accès aux données, client HTTP préparé pour une future API et données simulées.
- `src/store/` et les stores des fonctionnalités : état partagé et persistance côté frontend.
- `src/theme/` : palette, typographie, espacements et styles du thème.
- `src/i18n/` : traductions française, anglaise et arabe.
- `assets/` : logos, icônes, images et animations.

## Logique et fonctionnement actuel

Au démarrage, l’application restaure les paramètres et la session locale, puis dirige l’utilisateur vers l’onboarding, la connexion, l’espace passager, le tableau de bord chauffeur ou l’écran de validation chauffeur selon son état et son rôle.

Les services utilisent actuellement des données simulées par défaut (`EXPO_PUBLIC_USE_MOCKS=true`). Les parcours et écrans frontend sont en place à des degrés différents ; certaines pages sont encore provisoires et indiquent qu’elles seront disponibles ultérieurement. La localisation et les cartes sont intégrées. Sur le web, la carte utilise une iframe OpenStreetMap ; sur mobile, elle utilise `react-native-maps`.

**Aucun backend n’est implémenté dans ce projet.** Un client HTTP et une URL d’API configurable sont prévus pour connecter le frontend à un backend qui reste à développer.

## Technologies principales

- React Native, React, TypeScript et Expo
- Expo Router pour la navigation
- Zustand pour l’état partagé et TanStack Query pour les requêtes
- React Hook Form et Zod pour les formulaires et la validation
- `react-native-maps` et Expo Location pour les cartes et la géolocalisation
- i18next et React Native StyleSheet pour les traductions et les styles

## Démarrage

```bash
npm install
npm start
```

Scripts de vérification :

```bash
npm run typecheck
npm run lint
```
