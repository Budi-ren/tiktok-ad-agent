// "AGENT BUILDS" — entry for the make.fun bounty "Bring the humans with a TikTok ad"
// (bring-the-humans-03). Node 22, standard library only.
//
// What this program does: it hands in the entry. The entry itself is the TikTok
// video — an original vertical ad for make.fun that this repo's agent made in its
// recorded session (a terminal that types itself, builds a game and wins a prize),
// posted publicly on TikTok from @approximatelly with the bounty's line and the
// account's play code in its caption. VIDEO.json names that video's address, and
// this program copies it to /output/VIDEO.json, where the gate reads it.
//
// The video is not in this repository: it lives on TikTok, and its address is what
// is handed in. The brand badge and the referral end card the ad uses come from
// make.fun's press pack (https://make.fun/press/manifest.json), fetched when the
// ad was made; this repository holds no copy of them.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR stand
// in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const VIDEO_FILE = 'VIDEO.json';

const videoPath = join(BOT_DIR, VIDEO_FILE);
if (!existsSync(videoPath)) {
  console.error(`No ${VIDEO_FILE} in ${BOT_DIR}: the video's address is missing.`);
  process.exit(1);
}

let video: unknown;
try {
  video = JSON.parse(readFileSync(videoPath, 'utf8'));
} catch (err) {
  console.error(`${VIDEO_FILE} is not valid JSON: ${(err as Error).message}`);
  process.exit(1);
}

const url =
  video !== null && typeof video === 'object'
    ? (video as Record<string, unknown>).url
    : undefined;
if (typeof url !== 'string' || !url.startsWith('https://www.tiktok.com/@')) {
  console.error(
    `${VIDEO_FILE} must name a TikTok video address, got: ${JSON.stringify(url)}`,
  );
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  copyFileSync(videoPath, join(OUTPUT_DIR, VIDEO_FILE));
} catch (err) {
  console.error(`Could not copy ${VIDEO_FILE} to ${OUTPUT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}

console.log(`Entry handed in: ${url}`);
console.log(`${VIDEO_FILE} written to ${join(OUTPUT_DIR, VIDEO_FILE)}`);
