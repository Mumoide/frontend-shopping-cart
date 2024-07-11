exports.getDollarPrice = async (req, res) => {
    try {
        const fetch = await import('node-fetch').then(mod => mod.default);
        const apiKey = process.env.CMF_API_KEY;
        const response = await fetch(`https://api.cmfchile.cl/api-sbifv3/recursos_api/dolar/2024?apikey=${apiKey}&formato=json`);
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching dollar price:", error);
        res.status(500).json({ message: "Server error fetching dollar price." });
    }
};
