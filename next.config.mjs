/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  eslint: {
    // הבדיקה רצה בנפרד (npm run lint / gates.sh) עם eslint.config.mjs שלנו -
    // לא כחלק מ-next build, כדי לא להיות תלויים בתאימות eslint-config-next לגרסת ESLint.
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
