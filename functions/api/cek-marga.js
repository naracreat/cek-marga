export async function onRequestGet(context) {
  const { request } = context;
  const url = new URL(request.url);
  const rawNama = (url.searchParams.get("nama") || "").trim();

  if (!rawNama) {
    return Response.json(
      { found: false, error: "Nama wajib diisi" },
      { status: 400 }
    );
  }

  const dataUrl = new URL("/data/names.json", request.url);
  const dataRes = await fetch(dataUrl.toString());

  if (!dataRes.ok) {
    return Response.json(
      {
        found: false,
        error: "File data/names.json tidak ditemukan"
      },
      { status: 500 }
    );
  }

  const profiles = await dataRes.json();

  const analysis = analyzeName(rawNama);
  const ranked = profiles
    .map((profile) => ({
      ...profile,
      score: scoreProfile(profile, analysis)
    }))
    .sort((a, b) => b.score - a.score);

  const best = ranked[0];

  if (!best) {
    return Response.json(
      { found: false, error: "Tidak ada profile nama" },
      { status: 500 }
    );
  }

  const alternatives = ranked.slice(1, 3).map((item) => ({
    full_name_pinyin: item.full_name_pinyin,
    full_name_hanzi: item.full_name_hanzi,
    vibe: item.vibe
  }));

  return Response.json({
    found: true,
    query: rawNama,
    analysis,
    surname_pinyin: best.surname_pinyin,
    surname_hanzi: best.surname_hanzi,
    given_name_pinyin: best.given_name_pinyin,
    given_name_hanzi: best.given_name_hanzi,
    full_name_pinyin: best.full_name_pinyin,
    full_name_hanzi: best.full_name_hanzi,
    vibe: best.vibe,
    aura: best.aura,
    description_long: best.description_long,
    alternatives
  });
}

function analyzeName(rawNama) {
  const nama = normalize(rawNama);
  const first = nama.charAt(0);
  const length = nama.length;
  const vowels = countVowels(nama);
  const syllableEstimate = estimateSyllables(nama);

  const feminineHints = [
    "a", "ia", "ya", "na", "la", "ni", "ti", "sha", "ira", "nisa", "bella", "putri", "amel", "siti", "zahra", "nabila"
  ];

  const masculineHints = [
    "an", "ar", "ad", "ri", "ky", "fi", "ham", "mad", "dan", "yan", "wan", "fan", "din", "rul", "yah"
  ];

  let genderTone = "neutral";
  const lower = nama;

  if (feminineHints.some((hint) => lower.includes(hint))) {
    genderTone = "female";
  }

  if (masculineHints.some((hint) => lower.includes(hint))) {
    genderTone = genderTone === "female" ? "neutral" : "male";
  }

  let soundTag = "balanced";

  if (/[xyz]/.test(lower) || lower.startsWith("zh") || lower.startsWith("sy")) {
    soundTag = "soft_sharp";
  } else if (/[kgcq]/.test(first)) {
    soundTag = "bright_clear";
  } else if (/[bmuow]/.test(first)) {
    soundTag = "round_warm";
  } else if (/[hrtd]/.test(first)) {
    soundTag = "hard_clear";
  } else if (vowels >= 3) {
    soundTag = "soft_flow";
  }

  let styleTag = "classic_balanced";

  if (genderTone === "female" && soundTag === "soft_flow") {
    styleTag = "graceful_bright";
  } else if (genderTone === "female" && soundTag === "soft_sharp") {
    styleTag = "mystic_elegant";
  } else if (genderTone === "female" && vowels >= 3) {
    styleTag = "spiritual_pure";
  } else if (genderTone === "male" && soundTag === "soft_sharp") {
    styleTag = "cold_noble";
  } else if (genderTone === "male" && soundTag === "bright_clear") {
    styleTag = "heroic_bright";
  } else if (genderTone === "male" && soundTag === "hard_clear") {
    styleTag = "formal_strong";
  } else if (genderTone === "male" && soundTag === "round_warm") {
    styleTag = "earthy_warm";
  } else if (genderTone === "male" && vowels <= 2 && length >= 6) {
    styleTag = "shadow_mysterious";
  } else if (soundTag === "soft_flow") {
    styleTag = genderTone === "female" ? "gentle_classic" : "scholar_refined";
  }

  let firstLetterGroup = first || "default";

  if (!"abcdefghijklmnopqrstuvwxyz".includes(first)) {
    firstLetterGroup = "default";
  }

  let lengthTag = "medium";
  if (length <= 4) lengthTag = "short";
  if (length >= 8) lengthTag = "long";

  return {
    normalized: nama,
    firstLetterGroup,
    lengthTag,
    soundTag,
    styleTag,
    genderTone,
    vowels,
    syllableEstimate
  };
}

function scoreProfile(profile, analysis) {
  let score = 0;

  if (profile.style_tag === analysis.styleTag) score += 40;
  if (profile.sound_tag === analysis.soundTag) score += 22;
  if (profile.gender_tone === analysis.genderTone) score += 18;
  if (profile.first_letter_group === analysis.firstLetterGroup) score += 12;
  if (profile.length_tag === analysis.lengthTag) score += 8;

  if (profile.first_letter_group === "default") score += 4;
  if (profile.first_letter_group === "default_female" && analysis.genderTone === "female") score += 10;

  if (analysis.genderTone === "neutral") {
    score += 6;
  }

  return score;
}

function normalize(value) {
  return String(value)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z]/g, "");
}

function countVowels(value) {
  const match = value.match(/[aiueo]/g);
  return match ? match.length : 0;
}

function estimateSyllables(value) {
  const match = value.match(/[aiueo]+/g);
  return match ? match.length : 1;
    }
