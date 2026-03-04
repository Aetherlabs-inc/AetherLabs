/** @type {import('next').NextConfig} */
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.aetherlabs.art';
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/v/:path*',
        destination: `${APP_URL}/v/:path*`,
        permanent: false,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname:
          "amplify-bandumanamperi-rasho-storagebucketfbc61555-uw8fibpbuvkr.s3.ca-central-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "flowbite.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "tailwindui.com",
      },
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "www.w3schools.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
};

export default nextConfig;
