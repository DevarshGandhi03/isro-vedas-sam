export default async function handler(req, res) {
    const { path } = req.query;
    
    const response = await fetch(`https://vedas.sac.gov.in/${path}`, {
      method: req.method,
      headers: { ...req.headers },
      body: req.method !== "GET" ? JSON.stringify(req.body) : null,
    });
  
    const contentType = response.headers.get("content-type");
  
    if (contentType.includes("application/json")) {
      const jsonData = await response.json();
      res.status(response.status).json(jsonData);
    } else {
      const data = await response.text();
      res.status(response.status).send(data);
    }
  }
  