const express = require('express');
const router = express.Router();

// Import controller mới của chúng ta
const { getAiMove } = require('../controllers/gameController');

// Khi có request dạng POST đến địa chỉ '/get-ai-move',
// hàm getAiMove sẽ được thực thi.
router.post('/get-ai-move', getAiMove);

module.exports = router;