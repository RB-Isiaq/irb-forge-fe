import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // StrictMode double-invokes effects in development, causing duplicate API
  // calls on every mount. Disable it here; production builds never use
  // StrictMode's double-invoke behaviour regardless.
  reactStrictMode: false,
};

export default nextConfig;
