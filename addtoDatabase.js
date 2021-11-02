const mongoose = require("mongoose");
const { Schema } = mongoose;
const fs = require('fs');

const articles = JSON.parse(fs.readFileSync('articles.json', 'utf8'));
// console.log(articles.articles);

// Connection URL
const url = "mongodb://localhost:27017/miniSearchDB";
mongoose.connect(url);

const articleSchema = new Schema(
    {
        keyword: String,
        filename: String,
        description: String,
        path: String
    }
);
const Article = mongoose.model("Article", articleSchema);

Article.insertMany(
    articles.articles,
    err => {
        if (err){
            console.error(err);
        } else {
            console.log("Successfully inserted docs.");
        }
        mongoose.connection.close();
    }
);
