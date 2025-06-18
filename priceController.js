const db = require('../config/database');

// GET /api/price-trends
exports.getPriceTrends = (req, res) => {
  const { city, locality, propertyType } = req.query;

  if (!city || !locality || !propertyType) {
    return res.status(400).json({ success: false, message: "Missing required query parameters" });
  }

  console.log("👉 Querying with:", city, locality, propertyType);

  db.all(
    `SELECT * FROM price_trends
     WHERE LOWER(city) = LOWER(?) AND LOWER(locality) = LOWER(?) AND LOWER(propertyType) = LOWER(?)`,
    [city, locality, propertyType],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Database error", error: err.message });
      }

      if (!rows || rows.length === 0) {
        return res.status(404).json({ success: false, message: "No trends data found for given location" });
      }

      const row = rows[0];
      try {
        return res.json({
          success: true,
          trends: {
            city: row.city,
            locality: row.locality,
            currentAvgPrice: row.currentAvgPrice,
            priceChange: {
              percentage: row.priceChangePercentage,
              direction: row.priceChangeDirection
            },
            historicalData: JSON.parse(row.historicalData),
            forecast: {
              nextQuarter: row.forecastNextQuarter,
              recommendation: row.forecastRecommendation
            }
          }
        });
      } catch (parseError) {
        return res.status(500).json({ success: false, message: "Error parsing historical data", error: parseError.message });
      }
    }
  );
};

// GET /api/calculator/home-loan
// controllers/priceController.js

exports.calculateHomeLoan = (req, res) => {
  const { loanAmount, interestRate, tenure } = req.query;

  const P = parseFloat(loanAmount);
  const annualRate = parseFloat(interestRate);
  const years = parseInt(tenure);

  if (!P || !annualRate || !years) {
    return res.status(400).json({ success: false, message: "Missing or invalid query parameters" });
  }

  const r = annualRate / 12 / 100; // Monthly interest rate
  const n = years * 12; // Total number of payments

  const emi = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
  const totalAmount = emi * n;
  const totalInterest = totalAmount - P;

  return res.json({
    success: true,
    calculation: {
      loanAmount: P,
      interestRate: annualRate,
      tenure: years,
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalAmount: Math.round(totalAmount)
    }
  });
};
