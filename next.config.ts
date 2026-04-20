/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://157.180.29.248:8090/api/:path*",
      },
      {
        source: "/uploads/:path*",
        destination: "http://157.180.29.248:8090/uploads/:path*",
      },
    ];
  },
 
};

export default nextConfig;