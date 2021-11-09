const express = require("express");
const mongoose = require('mongoose');
const fileUpload = require("express-fileupload");
const path = require("path");
const util = require("util");
const Article = require("./article.js");

const port = 3000;
const app = express();

// Connection URL
const url = "mongodb://localhost:27017/miniSearchDB";
mongoose.connect(url).catch(err => console.error(err));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(fileUpload());

app.get("/", function(req, res){
    res.render("index");
});

app.get("/search", function(req, res){
    // console.log(req.query.q);
    Article.find({ $text: { $search: req.query.q }}, { score: { $meta: "textScore" } })
    .sort("score")
    .exec(function(err, articles){
        if (err) {
            console.error(err);
            res.redirect("/");
        } else {
            // console.log(articles);
            res.render("results", { articles: articles, query: req.query.q });
        }
    });
});

app.post("/keywords", function(req, res){
    // console.log(req.body);
    const query = req.body.q;
    if (query) {
        Article.find({ keyword: { $regex: new RegExp(`^${query}.*`, "i") }}, function(err, articles){
            if (err) {
                console.error(err);
                res.send([]);
            } else {
                // console.log(articles);
                // Only get the keywords in a list
                articles = articles.map((article) => article.keyword);
                // Remove duplicate keywords
                articles = articles.filter((keyword, index) => articles.indexOf(keyword) === index);
                res.send(articles.slice(0, 10));
            }
        });
    } else {
        res.send([]);
    }
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

app.get("/upload", function(req, res){
    res.render("upload");
});

app.post("/upload", async function(req, res){
    try {
        if (!(req.body.filename && req.body.keyword)) {
            throw Error("Missing filename / keyword.");
        }
        const file = req.files.filename;
        const fileName = file.name;
        const fileSize = file.data.length;
        const md5 = file.md5; // Use hash as the file name
        const extension = path.extname(fileName);
        const filePath = `/uploads/${md5}${extension}`; 
        // console.log(filePath);

        await util.promisify(file.mv)(__dirname + filePath);
        // Add to database
        const newFileEntry = new Article({ ...req.body, path: filePath });
        newFileEntry.save();
        res.sendFile(__dirname + "/templates/success.html");
    } catch(err) {
        console.error(err);
        res.sendFile(__dirname + "/templates/failure.html");
    }
});

app.listen(port, function(){
    console.log(`App listening at http://localhost:${port}`);
});