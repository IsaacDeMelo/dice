const mongoose = require('mongoose');

const rollSchema = new mongoose.Schema({
  player: { type: String, required: true },
  value: { type: Number, required: true },
  horario: { type: String, required: true },
}, {
  timestamps: true
});

module.exports = mongoose.model('Roll', rollSchema);
