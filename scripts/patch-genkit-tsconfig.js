const fs = require('fs');
const path = require('path');

const target = path.join(__dirname, '..', 'node_modules', 'genkit', 'tsconfig.json');
const desired = {
  include: ["src/**/*", "lib/**/*", "dist/**/*", "types/**/*", "index.d.ts"],
  exclude: [],
  compilerOptions: {
    target: "ES2017",
    module: "ESNext",
    moduleResolution: "bundler",
    esModuleInterop: true,
    resolveJsonModule: true,
    lib: ["es2022", "DOM"]
  }
};

try {
  if (fs.existsSync(target)) {
    fs.writeFileSync(target, JSON.stringify(desired, null, 2) + '\n', 'utf8');
    console.log('Patched genkit tsconfig at', target);
  } else {
    console.warn('genkit tsconfig not found, skipping patch');
  }
} catch (err) {
  console.error('Failed to patch genkit tsconfig:', err);
  process.exitCode = 1;
}
