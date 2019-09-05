const express = require('express');
const router = express.Router();
const {
    getAllProjects,
    findByStudentId,
    assignSupervisor,
    generateAcceptanceLetter
} = require('../controllers/projects');
const {requireSignin} = require('../controllers/auth');

router.get('/by/:byStudentId',(req,res)=>{
    res.json(req.project);
});
router.get('/all',getAllProjects);
router.put('/supervisor/assign',assignSupervisor);
router.put('/generate/acceptanceLetter',generateAcceptanceLetter)
router.param('byStudentId',findByStudentId);
module.exports = router;