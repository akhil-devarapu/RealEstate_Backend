const db = require('../config/database');
exports.getSellerListings = (req, res) => {
  const sellerId = req.user?.id;
  const userType = req.user?.userType;

  if (userType !== 'seller') {
    return res.status(403).json({ success: false, message: 'Access denied: Not a seller' });
  }

  const sql = `SELECT 
            id, 
            title, 
            price,
            city,
            state,
            propertyType,
            propertyFor,
            bedrooms,
            bathrooms,
            area,
            DATE('now') AS postedOn,
            DATE('now', '+30 days') AS expiresOn
        FROM properties
        WHERE userId = ?
`;

  db.all(sql, [sellerId], (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Failed to fetch listings' });
    }

    res.json({ success: true, listings: rows });
  });
};

exports.getSellerLeads = (req, res) => {
  const sellerId = req.user?.id;

  const sql = `
    SELECT i.id AS leadId, i.propertyId, i.message, i.contactTime, i.isLoanRequired, 
           i.preferredDate, i.preferredTime, i.type,
           u.name AS userName, u.email, u.mobile
    FROM inquiries i
    JOIN properties p ON i.propertyId = p.id
    JOIN users u ON i.userId = u.id
    WHERE p.userId = ?
  `;

  db.all(sql, [sellerId], (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Failed to fetch leads', error: err.message });
    }

    res.json({ success: true, leads: rows });
  });
};
exports.updateLeadStatus = (req, res) => {
  const { leadId } = req.params;
  const { status, notes } = req.body;

  if (!status) {
    return res.status(400).json({ success: false, message: 'Status is required' });
  }

  const sql = `
    UPDATE inquiries
    SET status = ?, notes = ?
    WHERE id = ?
  `;

  db.run(sql, [status, notes, leadId], function(err) {
    if (err) {
      return res.status(500).json({ success: false, message: 'Failed to update lead status', error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    res.json({ success: true, message: 'Lead status updated successfully' });
  });
};
