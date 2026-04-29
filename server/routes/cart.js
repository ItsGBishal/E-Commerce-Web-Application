const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, (req, res) => {
  res.json({
    message: 'Cart is managed on the client with React Context',
    items: []
  });
});

module.exports = router;
