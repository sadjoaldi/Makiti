import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.44"],
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default withSentryConfig(nextConfig, {
  // Org et projet Sentry
  org: "makiti-dd",
  project: "javascript-nextjs",

  // Désactive les logs verbeux du build
  silent: !process.env.CI,

  // Upload des source maps uniquement si le token est présent
  // (sinon le build ne casse pas en local)
  widenClientFileUpload: true,

  // Masque les source maps du bundle client (sécurité)
  sourcemaps: {
    disable: !process.env.SENTRY_AUTH_TOKEN,
  },

  // Désactive la télémétrie Sentry
  telemetry: false,

  // Tunnel pour contourner les ad-blockers (optionnel)
  tunnelRoute: "/monitoring",
});
