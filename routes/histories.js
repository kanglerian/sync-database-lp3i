const express = require('express');
const router = express.Router();
const { Applicant } = require('../models');
const { Op } = require('sequelize');
const axios = require('axios');

router.get('/count', async (req, res) => {
  try {
    let applicants = await Applicant.findAll({
      where: {
        phone: {
          [Op.not]: null,
        },
      },
    });

    let phoneNull = await Applicant.findAll({
      where: {
        phone: {
          [Op.is]: null,
        },
      },
    });


    let kategori_0 = 0;
    let kategori_1 = 0;
    let kategori_2 = 0;
    let kategori_3 = 0;
    let kategori_4 = 0;
    let kategori_5 = 0;
    let kategori_6 = 0;
    let kategori_7 = 0;
    let kategori_8 = 0;
    let kategori_9 = 0;
    let kategori_10 = 0;
    let kategori_11 = 0;
    let kategori_12 = 0;
    let kategori_error = 0;

    const promises = applicants.map(async (applicant) => {

      try {
        const response = await axios.get(`https://api.politekniklp3i-tasikmalaya.ac.id/history/count/${applicant.phone}`);
        switch (response.data.count) {
          case 0:
            kategori_0++;
            break;
          case 1:
            kategori_1++;
            break;
          case 2:
            kategori_2++;
            break;
          case 3:
            kategori_3++;
            break;
          case 4:
            kategori_4++;
            break;
          case 5:
            kategori_5++;
            break;
          case 6:
            kategori_6++;
            break;
          case 7:
            kategori_7++;
            break;
          case 8:
            kategori_8++;
            break;
          case 9:
            kategori_9++;
            break;
          case 10:
            kategori_10++;
            break;
          case 11:
            kategori_11++;
            break;
          case 12:
            kategori_12++;
            break;
          default:
            break;
        }
      } catch (error) {
        console.error(`Error fetching data for phone ${applicant.phone}:`, error.message);
        kategori_error++;
      }
    });

    await Promise.all(promises);

    const results = {
      phoneNotNull: {
        total: applicants.length,
        kategori_0,
        kategori_1,
        kategori_2,
        kategori_3,
        kategori_4,
        kategori_5,
        kategori_6,
        kategori_7,
        kategori_8,
        kategori_9,
        kategori_10,
        kategori_11,
        kategori_12,
        kategori_error,
      },
      phoneNull: {
        total: phoneNull.length,
      },
    };

    return res.json(results);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
