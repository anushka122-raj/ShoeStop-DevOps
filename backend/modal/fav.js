const mongoose = require('mongoose');

const favSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    image: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

favSchema.index({ user: 1, title: 1 }, { unique: true });

const fav = mongoose.model('favs', favSchema);

module.exports = fav;