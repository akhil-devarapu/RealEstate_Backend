const db = require('../config/database');
exports.addFavorite = (req, res) => {
    const propertyId = req.params.propertyId;
    const userId = 1;

    if (!propertyId) {
        return res.status(400).json({ success: false, message: "Property ID is required" });
    }

    const query = `INSERT INTO favorites (userId, propertyId) VALUES (?, ?)`;

    db.run(query, [userId, propertyId], function(err) {
        if (err) {
            return res.status(500).json({ success: false, message: "Failed to add to favorites" });
        }

        res.json({ success: true, message: "Property added to favorites" });
    });
};
exports.getFavorites = (req, res) => {
    // ⚠️ TEMPORARY: Use hardcoded userId
    const userId = 1;

    const query = `
        SELECT properties.*
        FROM properties
        JOIN favorites ON properties.id = favorites.propertyId
        WHERE favorites.userId = ?
    `;

    db.all(query, [userId], (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Failed to fetch favorite properties', error: err.message });
        }

        res.json({ success: true, favorites: rows });
    });
};
exports.compareProperties = (req, res) => {
    const { propertyIds } = req.body;

    if (!propertyIds || !Array.isArray(propertyIds) || propertyIds.length === 0) {
        return res.status(400).json({ success: false, message: 'propertyIds array is required' });
    }

    const placeholders = propertyIds.map(() => '?').join(',');
    const query = `
        SELECT id, title, price, area, bedrooms, amenities, pros, cons
        FROM properties
        WHERE id IN (${placeholders})
    `;

    db.all(query, propertyIds, (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Failed to fetch properties', error: err.message });
        }

        const formatted = rows.map(row => ({
            id: row.id,
            title: row.title,
            price: row.price,
            area: row.area,
            bedrooms: row.bedrooms,
            amenities: JSON.parse(row.amenities || '[]'),
            pros: JSON.parse(row.pros || '[]'),
            cons: JSON.parse(row.cons || '[]')
        }));

        res.json({
            success: true,
            comparison: {
                properties: formatted
            }
        });
    });
};

