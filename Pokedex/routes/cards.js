const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/search', async (req, res) => {
  try {
    const { name } = req.query;
    const response = await axios.get(`https://api.pokemontcg.io/v2/cards?q=name:${name}`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching data' });
  }
});
const Card = require('../models/Card');

router.post('/add', async (req, res) => {
  try {
    const cardData = req.body;
    const newCard = new Card(cardData);
    await newCard.save();
    res.json({ message: 'Card saved to collection!' });
  } catch (err) {
    res.status(500).json({ error: 'Error saving card' });
  }
});

router.get('/collection', async (req, res) => {
    try {
      const cards = await Card.find();
      res.json(cards);
    } catch (err) {
      res.status(500).json({ error: 'Error retrieving collection' });
    }
  });
  router.delete('/remove/:id', async (req, res) => {
    try {
      const cardId = req.params.id;
      await Card.findByIdAndDelete(cardId);
      res.json({ message: 'Card removed from collection.' });
    } catch (err) {
      res.status(500).json({ error: 'Error removing card.' });
    }
  });
module.exports = router;