const db = require('../config/database');

exports.createAlert = (req, res) => {
  const { name, filters, frequency } = req.body;

  if (!name || !filters || !frequency) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  const {
    propertyFor,
    propertyType,
    city,
    localities,
    bedrooms,
    budgetMax
  } = filters;

  const sql = `
    INSERT INTO alerts (
      name, propertyFor, propertyType, city,
      localities, bedrooms, budgetMax, frequency
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(sql, [
    name,
    propertyFor || null,
    propertyType || null,
    city || null,
    JSON.stringify(localities || []),
    JSON.stringify(bedrooms || []),
    budgetMax || null,
    frequency
  ], function (err) {
    if (err) {
      console.error('Error saving alert:', err);
      return res.status(500).json({ success: false, message: 'Failed to save alert', error: err.message });
    }

    return res.status(201).json({
      success: true,
      message: 'Alert created successfully',
      alertId: this.lastID
    });
  });
};
exports.getAlerts = (req, res) => {
  const sql = `SELECT * FROM alerts ORDER BY createdAt DESC`;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Error fetching alerts:", err.message);
      return res.status(500).json({ success: false, message: 'Failed to fetch alerts', error: err.message });
    }

    // Parse JSON fields (localities, bedrooms)
    const alerts = rows.map(alert => ({
      ...alert,
      localities: JSON.parse(alert.localities || '[]'),
      bedrooms: JSON.parse(alert.bedrooms || '[]')
    }));

    return res.json({
      success: true,
      alerts
    });
  });
};

