export default function CguPage() {
  return (
    <article className="space-y-6">
      <div>
        <h1 className="text-2xl font-black mb-2">
          Conditions Générales d&apos;Utilisation
        </h1>
        <p className="text-sm text-muted-foreground">
          Dernière mise à jour : mai 2026
        </p>
      </div>

      <section className="space-y-2">
        <h2 className="text-lg font-bold">1. Objet</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Les présentes conditions régissent l&apos;utilisation de la plateforme
          Makiti. En créant un compte ou en utilisant le service, vous acceptez
          sans réserve les présentes conditions.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-bold">2. Accès au service</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          L&apos;utilisation de Makiti pour publier des annonces est réservée
          aux personnes âgées d&apos;au moins 18 ans. La consultation des
          annonces est libre. La création d&apos;un compte nécessite un numéro
          de téléphone valide pour la vérification.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-bold">3. Rôle de Makiti</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Makiti est un intermédiaire technique mettant en relation acheteurs et
          vendeurs. Makiti n&apos;intervient pas dans les transactions, ne
          garantit pas la qualité, la conformité ou l&apos;existence des biens
          proposés, et n&apos;est pas responsable des litiges entre
          utilisateurs. Les échanges et paiements se font directement entre les
          parties, sous leur seule responsabilité.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-bold">4. Obligations des utilisateurs</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Vous vous engagez à publier des annonces véridiques, à ne pas tromper
          les autres utilisateurs, à respecter la loi et à fournir des
          informations exactes. Vous êtes seul responsable du contenu que vous
          publiez.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-bold">5. Produits et contenus interdits</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Il est strictement interdit de publier des annonces concernant : armes
          et munitions, drogues et substances illicites, contrefaçons, produits
          volés, animaux protégés, contenus à caractère sexuel ou
          pornographique, documents officiels falsifiés, ainsi que tout bien ou
          service contraire à la loi guinéenne. Cette liste n&apos;est pas
          exhaustive.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-bold">6. Modération</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Makiti se réserve le droit de supprimer toute annonce et de suspendre
          ou supprimer tout compte ne respectant pas les présentes conditions,
          sans préavis ni justification. Les utilisateurs peuvent signaler toute
          annonce abusive via la fonction prévue à cet effet.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-bold">7. Responsabilité</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Makiti met tout en œuvre pour assurer la disponibilité du service mais
          ne garantit pas un fonctionnement sans interruption. Makiti ne saurait
          être tenu responsable des dommages résultant de l&apos;utilisation du
          service, des transactions entre utilisateurs ou de
          l&apos;indisponibilité temporaire de la plateforme.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-bold">8. Modification des conditions</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Makiti peut modifier les présentes conditions à tout moment. Les
          utilisateurs seront informés des modifications importantes.
          L&apos;utilisation continue du service vaut acceptation des conditions
          mises à jour.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-bold">9. Contact</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Pour toute question relative aux présentes conditions, contactez-nous
          à{" "}
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
