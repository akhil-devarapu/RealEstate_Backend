// controllers/searchController.js

const db = require('../config/database');

exports.suggestLocations = (req, res) => {
  const { query, type } = req.query;

  if (!query || !type) {
    return res.status(400).json({ success: false, message: 'Query and type are required' });
  }

  let column;
  if (type === 'city') column = 'city';
  else if (type === 'locality') column = 'location';
  else if (type === 'project') column = 'projectName'; // ensure this field exists
  else {
    return res.status(400).json({ success: false, message: 'Invalid type' });
  }

  const sql = `SELECT DISTINCT ${column} as name, id, city FROM properties WHERE ${column} LIKE ? LIMIT 10`;

  db.all(sql, [`%${query}%`], (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error', error: err.message });
    }

    const suggestions = rows.map((row) => ({
      id: row.id,
      name: row.name,
      type,
      city: row.city,
      matchedOn: query
    }));

    res.json({ success: true, suggestions });
  });
};
// controllers/searchController.js

exports.mapSearchProperties = (req, res) => {
  const { bounds, filters } = req.body;

  if (!bounds || !bounds.northEast || !bounds.southWest) {
    return res.status(400).json({ success: false, message: 'Bounds are required' });
  }

  const { northEast, southWest } = bounds;
  const { propertyFor, propertyType, budgetMax } = filters || {};

  let query = `SELECT * FROM properties WHERE 
    latitude BETWEEN ? AND ? AND 
    longitude BETWEEN ? AND ?`;
  let params = [southWest.lat, northEast.lat, southWest.lng, northEast.lng];

  if (propertyFor) {
    query += ' AND propertyFor = ?';
    params.push(propertyFor);
  }

  if (propertyType) {
    query += ' AND propertyType = ?';
    params.push(propertyType);
  }

  if (budgetMax) {
    query += ' AND price <= ?';
    params.push(budgetMax);
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error', error: err.message });
    }

    res.json({ success: true, properties: rows });
  });
};
exports.scheduleVisit = (req, res) => {
    const propertyId = req.params.id;
    const userId = req.user.id;
    const { preferredDate, preferredTime, message } = req.body;

    if (!preferredDate || !preferredTime) {
        return res.status(400).json({ success: false, message: 'Date and time are required' });
    }

    const query = `
        INSERT INTO site_visits (userId, propertyId, preferredDate, preferredTime, message)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.run(query, [userId, propertyId, preferredDate, preferredTime, message], function(err) {
        if (err) {
            return res.status(500).json({ success: false, message: 'Failed to schedule visit' });
        }

        res.json({
            success: true,
            message: 'Visit scheduled successfully',
            visitId: this.lastID
        });
    });
};

