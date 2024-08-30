/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEXTAUTH_SECRET: "hNvYJxherm9EBhejiCijk9pWzWi3dvn4sQ/hxORTMho=",
      },

     images: {
      remotePatterns: [
        {
          hostname: "www.facebook.com",
        },
      ],
    },
};

export default nextConfig;
