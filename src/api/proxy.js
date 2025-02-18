export default async function handler(req, res) {
    // Set CORS headers to allow any origin
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  
    // Handle preflight OPTIONS request
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }
  
    const { path } = req.query;
    
    try {
      const response = await fetch(`https://vedas.sac.gov.in/${path}`, {
        method: req.method,
        headers: { ...req.headers },
        body: req.method !== "GET" ? JSON.stringify(req.body) : null,
      });
  
      const contentType = response.headers.get("content-type");
  
      if (contentType && contentType.includes("application/json")) {
        const jsonData = await response.json();
        res.status(response.status).json(jsonData);
      } else {
        const data = await response.text();
        res.status(response.status).send(data);
      }
    } catch (error) {
      console.error("Proxy error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  