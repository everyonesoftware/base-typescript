// Copied from https://janessagarrow.com/blog/typescript-and-esbuild/

const { build } = require("esbuild");
const { dependencies, engines, peerDependencies } = require("./package.json");
const { Generator } = require('npm-dts');

const entryPoint = "sources/index.ts";
const outputsPackageFolder = "outputs/package";

new Generator({
  entry: entryPoint,
  output: `${outputsPackageFolder}/index.d.ts`,
}).generate();

const external = [];
if (dependencies)
{
  external.push(...Object.keys(dependencies));
}
if (engines)
{
  external.push(...Object.keys(engines));
}
if (peerDependencies)
{
  external.push(...Object.keys(peerDependencies));
}

const sharedConfig = {
  entryPoints: [entryPoint],
  bundle: true,
  minify: true,
  external: external,
  sourcemap: "inline",
};

build({
  ...sharedConfig,
  platform: "node", // for CommonJS
  outfile: `${outputsPackageFolder}/index.js`,
});

build({
  ...sharedConfig,
  outfile: `${outputsPackageFolder}/index.esm.js`,
  platform: "neutral", // for ESM
  format: "esm",
});