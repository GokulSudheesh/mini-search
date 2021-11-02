const express = require("express");

const port = 3000;
const app = express();
const mongoose = require('mongoose');
const { Schema } = mongoose;

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

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function(req, res){
    res.render("index");
});

app.get("/search", function(req, res){
    // console.log(req.query.q);
    Article.find({ $text: { $search: req.query.q }}, function(err, articles){
        if (err) {
            console.error(err);
            res.redirect("/");
        } else {
            // console.log(articles);
            res.render("results", { articles: articles });
        }
    });
});

app.get("/view/:id", function(req, res){
    // console.log(req.params.id);
    Article.findById({ _id: req.params.id }, function(err, article){
        if (err) {
            console.error(err);
            res.redirect("/");
        } else {
            res.sendFile(__dirname + article.path);
        }
    });
});

app.get("/download/:id", function(req, res){
    // console.log(req.params.id);
    Article.findById({ _id: req.params.id }, function(err, article){
        if (err) {
            console.error(err);
            res.redirect("/");
        } else {
            res.download(__dirname + article.path);
        }
    });
});

app.listen(port, function(){
    console.log(`App listening at http://localhost:${port}`);
});