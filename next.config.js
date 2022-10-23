/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  experimental: {
    images: {
      allowFutureImage: true,
    },
  },
}

module.exports = nextConfig
