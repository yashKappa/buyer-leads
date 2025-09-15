const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  output: "export", // enables `next export`
  basePath: isProd ? "/your-repo-name" : "",
  assetPrefix: isProd ? "/your-repo-name/" : "",
};

module.exports = nextConfig;
