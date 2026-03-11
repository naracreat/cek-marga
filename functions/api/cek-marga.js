export async function onRequestGet(context) {
  const { request } = context;
  const url = new URL(request.url);
  const nama = (url.searchParams.get("nama") || "").trim().toLowerCase();

  const data = [
    {
      aliases: ["tan"],
      marga_hanzi: "陈",
      marga_pinyin: "Chen"
    },
    {
      aliases: ["lim", "liem"],
      marga_hanzi: "林",
      marga_pinyin: "Lin"
    },
    {
      aliases: ["ong"],
      marga_hanzi: "王",
      marga_pinyin: "Wang"
    },
    {
      aliases: ["tjoa"],
      marga_hanzi: "蔡",
      marga_pinyin: "Cai"
    },
    {
      aliases: ["lie"],
      marga_hanzi: "李",
      marga_pinyin: "Li"
    }
  ];

  const keyword = nama.replace(/\s+/g, "");

  const match = data.find((item) =>
    item.aliases.some((alias) => alias === keyword)
  );

  if (!match) {
    return Response.json({ found: false });
  }

  return Response.json({
    found: true,
    ...match
  });
}
