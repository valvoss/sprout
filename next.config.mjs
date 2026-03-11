/** @type {import('next').NextConfig} */
const nextConfig = {
  // basePath removed for Vercel deployment (was "/sprout" for GitHub Pages)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.prod.website-files.com',
      },
    ],
  },
};

export default nextConfig;
