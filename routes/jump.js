var express = require('express');
var router = express.Router();
var jump = require('../jump');

/* GET users listing. */
router.post('/', async function(req, res, next) {
    try {
        await jump.iJump(req.body.distance);
        res.send(JSON.stringify({error: 0}));
    } catch (e) {
        res.send(JSON.stringify({error: 1}));
    }
});

router.post('/f5', async function(req, res, next) {
    try {
        await jump.refreshScreencap();
        res.send(JSON.stringify({error: 0}));
    } catch (e) {
        res.send(JSON.stringify({error: 1}));
    }
});

module.exports = router;
