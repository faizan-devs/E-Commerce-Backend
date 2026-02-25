const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have Name'],
        unique: true,
    },
    rating: {
        type: Number,
        default: 3,
    },
    price: {
        type: Number,
        required: [true, 'A tour must have Price'],
    },
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
