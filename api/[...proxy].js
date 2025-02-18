export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }
  
    const { path } = req.query;
  
    try {
      const response = await fetch(`https://vedas.sac.gov.in/${path}`, {
        method: req.method,
        headers: { "Content-Type": "application/json" },
      });
  
      const data = await response.text();
      res.status(response.status).send(data);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  