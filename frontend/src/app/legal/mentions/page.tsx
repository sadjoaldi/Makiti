export default function MentionsPage() {
  return (
    <article className="prose-legal space-y-6">
      <div>
        <h1 className="text-2xl font-black mb-2">Mentions légales</h1>
        <p className="text-sm text-muted-foreground">
          Dernière mise à jour : mai 2026
        </p>
      </div>

      <section className="space-y-2">
        <h2 className="text-lg font-bold">Éditeur du site</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Le site et l&apos;application Makiti sont édités par Alhassane Diallo,
          agissant en nom propre. Pour toute question, vous pouvez contacter
          l&apos;éditeur à l&apos;adresse suivante :{" "}
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
        <h2 className="text-lg font-bold">Hébergement</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Le site est hébergé sur un serveur dédié. Les informations relatives à
          l&apos;hébergeur peuvent être obtenues sur demande auprès de
          l&apos;éditeur.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-bold">Objet du service</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Makiti est une plateforme de petites annonces permettant à ses
          utilisateurs de publier et consulter des annonces de biens et services
          en Guinée. Makiti agit en tant qu&apos;intermédiaire technique et
          n&apos;est pas partie aux transactions conclues entre utilisateurs.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-bold">Propriété intellectuelle</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          La marque Makiti, le logo, la charte graphique et l&apos;ensemble des
          éléments du site sont la propriété de l&apos;éditeur. Toute
          reproduction sans autorisation est interdite. Les contenus publiés par
          les utilisateurs (textes, photos d&apos;annonces) restent la propriété
          de leurs auteurs.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-bold">Contact</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Pour toute question concernant le site, son fonctionnement ou pour
          signaler un contenu, contactez-nous à{" "}
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
