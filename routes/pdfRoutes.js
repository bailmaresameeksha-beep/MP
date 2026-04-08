const express = require('express');
const { uploadPDF } = require('../controllers/pdfController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);
router.post('/upload', uploadPDF);

module.exports = router;
