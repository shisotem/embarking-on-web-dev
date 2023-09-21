const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('all shelters');
});

router.post('/', (req, res) => {
    res.send('create shelter');
});

router.get('/:id', (req, res) => {
    res.send('view shelter');
});

router.get('/:id/edit', (req, res) => {
    res.send('edit shelter');
});

module.exports = router;