const express = require('express');
const router = express.Router();
const {
    marksDistribution
} = require('../controllers/users');
const {requireSignin} = require('../controllers/auth');

router.put('/chairman/settings/marksDistribution',marksDistribution);
module.exports = router;