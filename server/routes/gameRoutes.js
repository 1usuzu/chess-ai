const express = require('express');
const router = express.Router();

const { getAiMove } = require('../controllers/gameController');

router.post('/get-ai-move', getAiMove);

module.exports = router;