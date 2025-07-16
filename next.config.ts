import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  nodeMiddleware: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: `/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/**`,
      }
    ]
  }
};

export default nextConfig;
