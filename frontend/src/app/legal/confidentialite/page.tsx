export default function ConfidentialitePage() {
  return (
    <article className="space-y-6">
      <div>
        <h1 className="text-2xl font-black mb-2">
          Politique de Confidentialité
        </h1>
        <p className="text-sm text-muted-foreground">
          Dernière mise à jour : mai 2026
        </p>
      </div>

      <section className="space-y-2">
        <h2 className="text-lg font-bold">1. Données collectées</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Lors de votre inscription et de l&apos;utilisation de Makiti, nous
          collectons : votre prénom et nom, votre adresse email, votre numéro de
          téléphone, votre ville et quartier, ainsi que les informations et
          photos liées aux annonces que vous publiez.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-bold">2. Utilisation des données</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Vos données sont utilisées pour : créer et gérer votre compte,
          vérifier votre identité par SMS, afficher vos annonces, permettre aux
          acheteurs de vous contacter, et assurer le bon fonctionnement et la
          sécurité de la plateforme. Votre numéro de téléphone est visible par
          les utilisateurs intéressés par vos annonces.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-bold">3. Partage des données</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Nous ne vendons pas vos données personnelles. Certaines données sont
          traitées par nos prestataires techniques uniquement pour faire
          fonctionner le service : l&apos;hébergement des images (Cloudinary) et
          l&apos;envoi de SMS de vérification (Africa&apos;s Talking). Ces
          prestataires n&apos;utilisent vos données que pour ces finalités.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-bold">4. Conservation des données</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Vos données sont conservées tant que votre compte est actif. Les
          annonces vendues ou archivées sont automatiquement supprimées après
          une période définie. Vous pouvez demander la suppression de votre
          compte et de vos données à tout moment.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-bold">5. Vos droits</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Vous pouvez à tout moment accéder à vos données, les modifier depuis
          votre profil, ou demander leur suppression en nous contactant. Pour
          toute demande relative à vos données personnelles, écrivez-nous à{" "}
          <a
            href="mailto:alhassane.diallo.dev@gmail.com"
            className="text-primary font-medium"
          >
            alhassane.diallo.dev@gmail.com
          </a>
          .
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-bold">6. Sécurité</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Vos mots de passe sont chiffrés et ne sont jamais stockés en clair.
          Nous mettons en œuvre des mesures techniques pour protéger vos
          données, mais aucun système n&apos;étant infaillible, nous ne pouvons
          garantir une sécurité absolue.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-bold">7. Stockage local</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Makiti utilise le stockage local de votre navigateur pour vous garder
          connecté et mémoriser certaines préférences. Ces informations restent
          sur votre appareil et ne sont pas utilisées à des fins publicitaires.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-bold">8. Contact</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Pour toute question concernant cette politique, contactez-nous à{" "}
          <a
            href="mailto:alhassane.diallo.dev@gmail.com"
            className="text-primary font-medium"
          >
            alhassane.diallo.dev@gmail.com
          </a>
          .
        </p>
      </section>
    </article>
  );
}
