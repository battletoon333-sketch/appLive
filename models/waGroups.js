const mongoose = require("mongoose");

// Define the schema
const WaGroupSchema = new mongoose.Schema({
    userKey: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    status: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    }
}, { timestamps: { createdAt: true, updatedAt: false } });

// Create the model
const waGroupModel = mongoose.model('WaGroup', WaGroupSchema);

// Export the model
module.exports = waGroupModel
