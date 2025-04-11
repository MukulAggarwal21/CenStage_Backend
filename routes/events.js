const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// Get all events (with optional date range filtering)
router.get('/', async (req, res) => {
  try {
    let query = {};
    
    // Apply date range filter if provided
    if (req.query.startDate && req.query.endDate) {
      query = {
        $or: [
          { 
            startTime: { 
              $gte: new Date(req.query.startDate),
              $lte: new Date(req.query.endDate)
            }
          },
          {
            endTime: {
              $gte: new Date(req.query.startDate),
              $lte: new Date(req.query.endDate)
            }
          },
          {
            startTime: { $lte: new Date(req.query.startDate) },
            endTime: { $gte: new Date(req.query.endDate) }
          }
        ]
      };
    }
    
    const events = await Event.find(query).sort({ startTime: 1 });
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new event
router.post('/', async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    const event = await newEvent.save();
    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update an event
router.put('/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id, 
      req.body,
      { new: true }
    );
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete an event
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.json({ message: 'Event deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;