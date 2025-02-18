export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: "No URL provided" });
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    const data = await response.blob();
    res.setHeader("Content-Type", "image/png"); // Adjust based on the content type
    res.send(Buffer.from(await data.arrayBuffer()));
  } catch (error) {
    res.status(500).json({ error: "Error fetching the image" });
  }
}
