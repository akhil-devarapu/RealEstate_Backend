const db = require('../config/database');

exports.addProject = (req, res) => {
    const user = req.user;

  // Ensure only builders can add a project
  if (user.userType !== 'builder') {
    return res.status(403).json({ success: false, message: 'Only builders are allowed to add projects' });
  }
    const {
        projectName, builderName, projectType, location,
        projectDetails, unitTypes, amenities, approvals, specifications
    } = req.body;

    const locationStr = JSON.stringify(location);
    const projectDetailsStr = JSON.stringify(projectDetails);
    const unitTypesStr = JSON.stringify(unitTypes);
    const amenitiesStr = JSON.stringify(amenities);
    const approvalsStr = JSON.stringify(approvals);
    const specificationsStr = JSON.stringify(specifications);

    const query = `
        INSERT INTO projects (
            projectName, builderName, projectType, location,
            projectDetails, unitTypes, amenities, approvals, specifications
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(query, [
        projectName, builderName, projectType, locationStr,
        projectDetailsStr, unitTypesStr, amenitiesStr, approvalsStr, specificationsStr
    ], function(err) {
        if (err) {
            return res.status(500).json({ success: false, message: 'Failed to add project', error: err.message });
        }

        res.status(201).json({ success: true, message: 'Project added successfully', projectId: this.lastID });
    });
};
exports.getProjectById = (req, res) => {
    const projectId = req.params.id;

    db.get(`SELECT * FROM projects WHERE id = ?`, [projectId], (err, row) => {
        if (err || !row) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        // Parse JSON fields
        row.location = JSON.parse(row.location);
        row.projectDetails = JSON.parse(row.projectDetails);
        row.unitTypes = JSON.parse(row.unitTypes);
        row.amenities = JSON.parse(row.amenities);
        row.approvals = JSON.parse(row.approvals);
        row.specifications = JSON.parse(row.specifications);

        res.json({ success: true, project: row });
    });
};
exports.getUnitsByProjectId = (req, res) => {
    const projectId = req.params.id;

    db.get(`SELECT unitTypes FROM projects WHERE id = ?`, [projectId], (err, row) => {
        if (err || !row) {
            return res.status(404).json({ success: false, message: 'Project or units not found' });
        }

        const units = JSON.parse(row.unitTypes);
        res.json({ success: true, units });
    });
};