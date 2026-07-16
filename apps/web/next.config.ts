import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@storytime/validators", "@storytime/config"],
};

export default nextConfig;
