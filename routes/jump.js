var express = require('express');
var router = express.Router();
var jump = require('../jump');

router.post('/', async function(req, res, next) {
    try {
        await jump.iJump(req.body.distance);
        res.json({error: 0});
    } catch (e) {
        res.json({error: 1});
    }
});

router.post('/getscreencap', async function(req, res, next) {
    try {
        await jump.refreshScreencap();
        res.json({error: 0});
    } catch (e) {
        res.json({error: 1});
    }
});

module.exports = router;
