const db = require('../config/database');

// POST /api/broker/register
exports.registerBroker = (req, res) => {
  const { firmName, reraNumber, experience, specialization, operatingAreas, description } = req.body;

  if (!firmName || !reraNumber || !experience || !specialization || !operatingAreas) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  const query = `
    INSERT INTO brokers (firmName, reraNumber, experience, specialization, operatingAreas, description)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const params = [
    firmName,
    reraNumber,
    experience,
    JSON.stringify(specialization),
    JSON.stringify(operatingAreas),
    description
  ];

  db.run(query, params, function (err) {
    if (err) {
      console.error('Error registering broker:', err.message);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    return res.status(201).json({
      success: true,
      message: 'Broker registered successfully',
      brokerId: this.lastID
    });
  });
};
exports.findBrokers = (req, res) => {
  const { city, locality, propertyType, rating } = req.query;

  const query = `SELECT * FROM brokers`;
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error fetching brokers:', err.message);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    const filtered = rows.filter(broker => {
      const areas = JSON.parse(broker.operatingAreas || '[]');
      const specs = JSON.parse(broker.specialization || '[]');

      const matchCity = !city || areas.includes(city);
      const matchLocality = !locality || areas.includes(locality);
      const matchType = !propertyType || specs.includes(propertyType);
      const matchRating = !rating || (broker.rating && broker.rating >= parseFloat(rating));

      return matchCity && matchLocality && matchType && matchRating;
    });

    return res.json({ success: true, brokers: filtered });
  });
};