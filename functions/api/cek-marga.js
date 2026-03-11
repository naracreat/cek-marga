export async function onRequestGet(context) {
  const { request } = context;
  const url = new URL(request.url);
  const nama = (url.searchParams.get("nama") || "").trim().toLowerCase();

  if (!nama) {
    return Response.json(
      { found: false, error: "Nama wajib diisi" },
      { status: 400 }
    );
  }

  const data = [
    {
      aliases: ["yahya"],
      chinese_name: "Xiao",
      hanzi: "萧",
      reason: "Bunyinya terasa ringan, tajam, dan cocok dengan karakter nama Yahya.",
      vibe: "elegan, tenang, klasik"
    },
    {
      aliases: ["ahmad", "muhammad", "mohammad"],
      chinese_name: "Han",
      hanzi: "韩",
      reason: "Terdengar kuat, formal, dan punya nuansa tegas yang cocok dengan nama Ahmad.",
      vibe: "tegas, maskulin, terhormat"
    },
    {
      aliases: ["ali"],
      chinese_name: "Li",
      hanzi: "李",
      reason: "Bunyi Ali sangat dekat dan mudah dipasangkan dengan Li.",
      vibe: "ringkas, kuat, klasik"
    },
    {
      aliases: ["rizky", "rizki", "rezeki"],
      chinese_name: "Lin",
      hanzi: "林",
      reason: "Nama ini terasa lembut dan modern, cocok dipadukan dengan Lin.",
      vibe: "ramah, modern, halus"
    },
    {
      aliases: ["fajar"],
      chinese_name: "Fang",
      hanzi: "方",
      reason: "Nuansa nama Fajar terasa terang dan bersih, selaras dengan karakter Fang.",
      vibe: "cerah, bersih, cerdas"
    },
    {
      aliases: ["budi"],
      chinese_name: "Bao",
      hanzi: "鲍",
      reason: "Nama Budi punya kesan hangat dan membumi, cocok dengan Bao.",
      vibe: "hangat, dewasa, sederhana"
    },
    {
      aliases: ["andi", "andy"],
      chinese_name: "An",
      hanzi: "安",
      reason: "Bunyi awalnya dekat, dan An memberi kesan sederhana tapi enak didengar.",
      vibe: "tenang, simpel, rapi"
    },
    {
      aliases: ["kevin"],
      chinese_name: "Kai",
      hanzi: "凯",
      reason: "Kevin terasa modern dan ringan, cocok dengan Kai yang pendek dan keren.",
      vibe: "modern, keren, muda"
    },
    {
      aliases: ["adrian"],
      chinese_name: "Yan",
      hanzi: "严",
      reason: "Adrian punya bunyi akhir yang pas dengan nuansa nama Yan.",
      vibe: "rapi, elegan, pintar"
    },
    {
      aliases: ["dimas"],
      chinese_name: "Ding",
      hanzi: "丁",
      reason: "Dimas punya ritme yang cocok dengan nama pendek dan tegas seperti Ding.",
      vibe: "tegas, simple, kuat"
    },
    {
      aliases: ["putri"],
      chinese_name: "Mei",
      hanzi: "梅",
      reason: "Putri terasa lembut dan anggun, cocok dengan Mei.",
      vibe: "anggun, lembut, manis"
    },
    {
      aliases: ["siti"],
      chinese_name: "Xi",
      hanzi: "席",
      reason: "Siti punya bunyi yang ringan dan pas dipadukan dengan Xi.",
      vibe: "halus, lembut, rapi"
    },
    {
      aliases: ["amelia", "amel"],
      chinese_name: "Ming",
      hanzi: "明",
      reason: "Amelia terasa cerah dan cantik, cocok dengan kesan nama Ming.",
      vibe: "cerah, elegan, feminin"
    },
    {
      aliases: ["nabila"],
      chinese_name: "Na",
      hanzi: "娜",
      reason: "Nama Nabila punya bunyi awal yang sangat cocok dengan Na.",
      vibe: "cantik, ringan, modern"
    },
    {
      aliases: ["zahra"],
      chinese_name: "Zhen",
      hanzi: "甄",
      reason: "Zahra terasa kuat tapi cantik, cocok dengan Zhen yang berkelas.",
      vibe: "berkelas, feminin, kuat"
    }
  ];

  const keyword = normalize(nama);

  const match = data.find((item) =>
    item.aliases.some((alias) => normalize(alias) === keyword)
  );

  if (!match) {
    return Response.json({ found: false, query: nama });
  }

  return Response.json({
    found: true,
    query: nama,
    ...match
  });
}

function normalize(value) {
  return value.toLowerCase().replace(/\s+/g, "");
}
