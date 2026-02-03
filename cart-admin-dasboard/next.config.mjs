/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.clubpromfg.com",
      }
    ],
  },
};

export default nextConfig;
