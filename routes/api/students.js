const express = require('express');
const {userById} = require("../../controllers/users");
const {makeEligible} = require('../../controllers/students');
const router = express.Router();

router.put('/eligible/:userId',makeEligible);

router.param("userId", userById);
module.exports = router;