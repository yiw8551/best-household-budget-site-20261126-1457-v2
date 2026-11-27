// HomeTally's hand-in program (Node 22, standard library only).
//
// The site itself is the static app/ folder beside this file — plain HTML,
// CSS and JavaScript a browser opens with no build step and no network.
// This program delivers it: it copies app/ and screenshots/ into the
// output directory and writes the dossier the judge reads, using the
// kit's vendored library exactly as shipped (the scorer rebuilds the
// dossier with its own copy of that library and compares the two byte
// for byte, so neither the library nor its limits may be tinkered with).
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoDir = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outputDir, { recursive: true });
cpSync(join(repoDir, 'app'), join(outputDir, 'app'), { recursive: true });

const shotsDir = join(repoDir, 'screenshots');
if (existsSync(shotsDir)) {
  mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
  cpSync(shotsDir, join(outputDir, 'screenshots'), { recursive: true });
}

// The scorer's own caps: at most 4 screenshots of 256 KiB each, at most
// 993 entries and 16 MiB under app/, and the dossier text capped so the
// judge's outline stays the size the bounty promises.
const dossier = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
writeFileSync(join(outputDir, 'dossier.json'), dossier);
console.log('HomeTally handed in: app/ and screenshots/ copied to ' + outputDir + ', dossier written beside them.');
