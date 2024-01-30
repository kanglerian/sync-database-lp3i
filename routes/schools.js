const express = require('express');
const router = express.Router();

const { School } = require('../models')

/* GET schools listing. */
router.get('/', async (req, res) => {
  let schools = await School.findAll();
  return res.json(schools);
});

router.get('/:id', async (req, res) => {
  let school = await School.findOne({
    where: {
      id: req.params.id,
    }
  });
  return res.json(school);
});

module.exports = router;
