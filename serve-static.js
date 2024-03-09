const express = require('express');
const path = require('path');

function serveStatic(app) {
    // Serve static files from the frontend directory
    const frontendPath = path.resolve(__dirname, '../frontend');
    app.use(express.static(frontendPath));

    // Fallback to index.html for all other routes
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(frontendPath, 'index.html'));
    });
}

module.exports = serveStatic;