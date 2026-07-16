import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { performance } from "node:perf_hooks";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, "../../..");
const evidencePath = join(repositoryRoot, ".omx", "evidence", "st-012-composition-spike.json");
const ffmpeg = process.env.FFMPEG_PATH || "ffmpeg";
const ffprobe = process.env.FFPROBE_PATH || "ffprobe";
const expectedDurationSeconds = 6;
const durationToleranceSeconds = 0.08;

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function run(executable, args, label) {
  const startedAt = performance.now();
  const result = spawnSync(executable, args, {
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
    windowsHide: true,
  });
  const wallMs = performance.now() - startedAt;

  if (result.error) {
    throw new Error(`${label} could not start: ${result.error.message}`);
  }

  if (result.status !== 0) {
    const diagnostic = (result.stderr || result.stdout || "no diagnostic output").trim();
    throw new Error(`${label} failed with exit code ${result.status}: ${diagnostic}`);
  }

  return { stdout: result.stdout, stderr: result.stderr, wallMs };
}

function sha256(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function directoryBytes(path) {
  return readdirSync(path, { withFileTypes: true }).reduce((total, entry) => {
    const entryPath = join(path, entry.name);
    return total + (entry.isDirectory() ? directoryBytes(entryPath) : statSync(entryPath).size);
  }, 0);
}

function ffmpegVersion(executable) {
  return run(executable, ["-version"], `${executable} version`).stdout.split(/\r?\n/, 1)[0];
}

function generateTrack({ destination, videoSource, audioFrequency }) {
  return run(
    ffmpeg,
    [
      "-hide_banner",
      "-loglevel",
      "error",
      "-y",
      "-f",
      "lavfi",
      "-i",
      videoSource,
      "-f",
      "lavfi",
      "-i",
      `sine=frequency=${audioFrequency}:sample_rate=48000:duration=3`,
      "-map",
      "0:v:0",
      "-map",
      "1:a:0",
      "-c:v",
      "libx264",
      "-preset",
      "veryfast",
      "-crf",
      "18",
      "-pix_fmt",
      "yuv420p",
      "-r",
      "30",
      "-g",
      "30",
      "-keyint_min",
      "30",
      "-sc_threshold",
      "0",
      "-threads",
      "1",
      "-c:a",
      "aac",
      "-b:a",
      "128k",
      "-ar",
      "48000",
      "-ac",
      "2",
      "-shortest",
      "-map_metadata",
      "-1",
      "-metadata",
      "creation_time=1970-01-01T00:00:00Z",
      "-fflags",
      "+bitexact",
      "-flags:v",
      "+bitexact",
      "-flags:a",
      "+bitexact",
      destination,
    ],
    `generate ${destination}`,
  );
}

function compose(sourcePaths, ledger, destination) {
  const sourceEntries = Object.entries(sourcePaths);
  const filters = ledger.events.flatMap((event, index) => {
    const sourceIndex = sourceEntries.findIndex(
      ([participant]) => participant === event.participant,
    );
    assert(sourceIndex >= 0, `Ledger references missing source ${event.participant}`);
    const startSeconds = event.sourceStartMs / 1000;
    const durationSeconds = event.durationMs / 1000;

    return [
      `[${sourceIndex}:v]trim=start=${startSeconds}:duration=${durationSeconds},setpts=PTS-STARTPTS,scale=1280:720:flags=bilinear[v${index}]`,
      `[${sourceIndex}:a]atrim=start=${startSeconds}:duration=${durationSeconds},asetpts=PTS-STARTPTS[a${index}]`,
    ];
  });
  const concatInputs = ledger.events.map((_, index) => `[v${index}][a${index}]`).join("");
  filters.push(`${concatInputs}concat=n=${ledger.events.length}:v=1:a=1[vout][aout]`);
  const filterGraph = filters.join(";");
  const inputArgs = sourceEntries.flatMap(([, path]) => ["-i", path]);

  return run(
    ffmpeg,
    [
      "-hide_banner",
      "-loglevel",
      "info",
      "-benchmark",
      "-y",
      ...inputArgs,
      "-filter_complex",
      filterGraph,
      "-map",
      "[vout]",
      "-map",
      "[aout]",
      "-c:v",
      "libx264",
      "-preset",
      "veryfast",
      "-crf",
      "20",
      "-pix_fmt",
      "yuv420p",
      "-r",
      "30",
      "-g",
      "60",
      "-keyint_min",
      "60",
      "-sc_threshold",
      "0",
      "-threads",
      "1",
      "-c:a",
      "aac",
      "-b:a",
      "160k",
      "-ar",
      "48000",
      "-ac",
      "2",
      "-movflags",
      "+faststart",
      "-map_metadata",
      "-1",
      "-metadata",
      "creation_time=1970-01-01T00:00:00Z",
      "-fflags",
      "+bitexact",
      "-flags:v",
      "+bitexact",
      "-flags:a",
      "+bitexact",
      destination,
    ],
    `compose ${destination}`,
  );
}

function parseBenchmark(stderr) {
  const match = stderr.match(/bench:\s+utime=([\d.]+)s\s+stime=([\d.]+)s\s+rtime=([\d.]+)s/);
  assert(match, "FFmpeg did not report parseable CPU and wall-time benchmark data");
  return {
    userCpuSeconds: Number(match[1]),
    systemCpuSeconds: Number(match[2]),
    realSeconds: Number(match[3]),
  };
}

function probe(path) {
  const result = run(
    ffprobe,
    [
      "-v",
      "error",
      "-show_entries",
      "format=duration,size,format_name:stream=index,codec_type,codec_name,width,height,sample_rate,channels",
      "-of",
      "json",
      path,
    ],
    `probe ${path}`,
  );

  return JSON.parse(result.stdout);
}

function verifySource(path) {
  const mediaProbe = probe(path);
  const video = mediaProbe.streams.find((stream) => stream.codec_type === "video");
  const audio = mediaProbe.streams.find((stream) => stream.codec_type === "audio");
  assert(video, `Source ${path} has no video stream`);
  assert(audio, `Source ${path} has no audio stream`);
  assert(video.codec_name === "h264", `Source ${path} is not H.264`);
  assert(audio.codec_name === "aac", `Source ${path} is not AAC`);
  assert(video.width <= 1280 && video.height <= 720, `Source ${path} exceeds 1280x720`);

  return {
    durationSeconds: Number(mediaProbe.format.duration),
    video: { codec: video.codec_name, width: video.width, height: video.height },
    audio: {
      codec: audio.codec_name,
      sampleRate: Number(audio.sample_rate),
      channels: audio.channels,
    },
  };
}

function verifyOutput(path) {
  const mediaProbe = probe(path);
  const videoStreams = mediaProbe.streams.filter((stream) => stream.codec_type === "video");
  const audioStreams = mediaProbe.streams.filter((stream) => stream.codec_type === "audio");
  const durationSeconds = Number(mediaProbe.format.duration);

  assert(videoStreams.length === 1, `Expected one video stream, found ${videoStreams.length}`);
  assert(audioStreams.length === 1, `Expected one audio stream, found ${audioStreams.length}`);
  assert(
    videoStreams[0].codec_name === "h264",
    `Expected H.264, found ${videoStreams[0].codec_name}`,
  );
  assert(videoStreams[0].width === 1280, `Expected width 1280, found ${videoStreams[0].width}`);
  assert(videoStreams[0].height === 720, `Expected height 720, found ${videoStreams[0].height}`);
  assert(audioStreams[0].codec_name === "aac", `Expected AAC, found ${audioStreams[0].codec_name}`);
  assert(
    Math.abs(durationSeconds - expectedDurationSeconds) <= durationToleranceSeconds,
    `Expected duration ${expectedDurationSeconds}s ±${durationToleranceSeconds}s, found ${durationSeconds}s`,
  );

  run(
    ffmpeg,
    [
      "-hide_banner",
      "-loglevel",
      "error",
      "-xerror",
      "-i",
      path,
      "-map",
      "0:v:0",
      "-map",
      "0:a:0",
      "-f",
      "null",
      "-",
    ],
    `decode ${path}`,
  );

  return {
    durationSeconds,
    formatName: mediaProbe.format.format_name,
    video: {
      codec: videoStreams[0].codec_name,
      width: videoStreams[0].width,
      height: videoStreams[0].height,
    },
    audio: {
      codec: audioStreams[0].codec_name,
      sampleRate: Number(audioStreams[0].sample_rate),
      channels: audioStreams[0].channels,
    },
  };
}

const scratchPath = mkdtempSync(join(tmpdir(), "storytime-st-012-"));
let evidence;

try {
  const trackAPath = join(scratchPath, "participant-a.mp4");
  const trackBPath = join(scratchPath, "participant-b.mp4");
  const ledgerPath = join(scratchPath, "ordered-ledger.json");
  const primaryOutputPath = join(scratchPath, "replay-primary.mp4");
  const repeatedOutputPath = join(scratchPath, "replay-repeat.mp4");
  const ledger = {
    schemaVersion: 1,
    events: [
      {
        sequence: 1,
        participant: "participant-a",
        sourceStartMs: 0,
        durationMs: 3000,
        replayStartMs: 0,
      },
      {
        sequence: 2,
        participant: "participant-b",
        sourceStartMs: 0,
        durationMs: 3000,
        replayStartMs: 3000,
      },
    ],
  };

  const isOrdered = ledger.events.every(
    (event, index) =>
      event.sequence === index + 1 &&
      event.replayStartMs ===
        ledger.events.slice(0, index).reduce((total, previous) => total + previous.durationMs, 0),
  );
  assert(isOrdered, "Synthetic ledger events are not contiguous and ordered");
  writeFileSync(ledgerPath, `${JSON.stringify(ledger, null, 2)}\n`, "utf8");

  generateTrack({
    destination: trackAPath,
    videoSource: "testsrc2=size=640x360:rate=30:duration=3",
    audioFrequency: 440,
  });
  generateTrack({
    destination: trackBPath,
    videoSource:
      "color=c=0x2E5D62:size=640x360:rate=30:duration=3,drawgrid=width=80:height=80:thickness=4:color=0xE4A853@0.8",
    audioFrequency: 660,
  });

  const trackAHash = sha256(trackAPath);
  const trackBHash = sha256(trackBPath);
  assert(trackAHash !== trackBHash, "Synthetic source tracks must be checksum-distinct");
  const trackAVerification = verifySource(trackAPath);
  const trackBVerification = verifySource(trackBPath);
  const sourcePaths = {
    "participant-a": trackAPath,
    "participant-b": trackBPath,
  };

  const primaryComposition = compose(sourcePaths, ledger, primaryOutputPath);
  const repeatedComposition = compose(sourcePaths, ledger, repeatedOutputPath);
  const primaryOutputHash = sha256(primaryOutputPath);
  const repeatedOutputHash = sha256(repeatedOutputPath);
  assert(
    primaryOutputHash === repeatedOutputHash,
    `Determinism failure: ${primaryOutputHash} !== ${repeatedOutputHash}`,
  );

  const verification = verifyOutput(primaryOutputPath);
  verifyOutput(repeatedOutputPath);
  const outputBytes = statSync(primaryOutputPath).size;
  const scratchBytesBeforeCleanup = directoryBytes(scratchPath);
  const benchmark = parseBenchmark(primaryComposition.stderr);
  const repeatedBenchmark = parseBenchmark(repeatedComposition.stderr);

  evidence = {
    schemaVersion: 1,
    workPackage: "ST-012",
    syntheticOnly: true,
    generatedAt: new Date().toISOString(),
    toolchain: {
      node: process.version,
      ffmpeg: ffmpegVersion(ffmpeg),
      ffprobe: ffmpegVersion(ffprobe),
    },
    ledger: {
      ordered: isOrdered,
      eventCount: ledger.events.length,
      durationMs: ledger.events.reduce((total, event) => total + event.durationMs, 0),
      sha256: sha256(ledgerPath),
    },
    sources: [
      {
        id: "participant-a",
        bytes: statSync(trackAPath).size,
        sha256: trackAHash,
        video: "testsrc2 640x360@30fps",
        audio: "440Hz stereo AAC",
        verification: trackAVerification,
      },
      {
        id: "participant-b",
        bytes: statSync(trackBPath).size,
        sha256: trackBHash,
        video: "teal grid 640x360@30fps",
        audio: "660Hz stereo AAC",
        verification: trackBVerification,
      },
    ],
    output: {
      fileName: "replay-primary.mp4",
      bytes: outputBytes,
      sha256: primaryOutputHash,
      ...verification,
      decodeVerified: true,
    },
    determinism: {
      repeatedEncodeSha256: repeatedOutputHash,
      checksumsMatch: true,
    },
    performance: {
      composeWallMs: Number(primaryComposition.wallMs.toFixed(2)),
      repeatedComposeWallMs: Number(repeatedComposition.wallMs.toFixed(2)),
      ffmpeg: benchmark,
      repeatedFfmpeg: repeatedBenchmark,
      realtimeFactor: Number((expectedDurationSeconds / benchmark.realSeconds).toFixed(2)),
    },
    scratch: {
      retainedBytesBeforeCleanup: scratchBytesBeforeCleanup,
      cleaned: false,
      remainingEntries: null,
    },
  };
} finally {
  rmSync(scratchPath, { recursive: true, force: true });
}

assert(evidence, "Composition spike did not produce evidence");
evidence.scratch.cleaned = !existsSync(scratchPath);
evidence.scratch.remainingEntries = existsSync(scratchPath) ? readdirSync(scratchPath).length : 0;
assert(evidence.scratch.cleaned, "Scratch directory was not removed");

mkdirSync(dirname(evidencePath), { recursive: true });
writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`, "utf8");
console.log(JSON.stringify(evidence, null, 2));
