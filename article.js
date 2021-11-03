const mongoose = require('mongoose');
const { Schema } = mongoose;

const articleSchema = new Schema(
    {
        keyword: String,
        filename: String,
        description: String,
        path: String
    }
);
module.exports = mongoose.model("Article", articleSchema);