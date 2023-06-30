/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    // serverActions: true,
  },
  images: {
    domains: [
      'localhost',
      'res.cloudinary.com',
      'via.placeholder.com',
      'images.unsplash.com',
      'lh3.googleusercontent.com',
      'ui-avatars.com',
    ],
  },
};

module.exports = nextConfig;
