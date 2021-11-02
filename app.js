const express = require("express");
const mongoose = require('mongoose');
const fileUpload = require("express-fileupload");
const path = require("path");
const util = require("util");
const { Schema } = mongoose;

const port = 3000;
const app = express();

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
app.use(fileUpload());

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

app.get("/upload", function(req, res){
    res.render("upload");
});

app.post("/upload", async function(req, res){
    try {
        const file = req.files.filename;
        const fileName = file.name;
        const fileSize = file.data.length;
        const md5 = file.md5; // Use hash as the file name
        const extension = path.extname(fileName);
        const filePath = `/uploads/${md5}${extension}`; 
        // console.log(filePath);

        await util.promisify(file.mv)(__dirname + filePath);
        // TODO: Send a diff success template
        res.redirect("/");
    } catch(err) {
        console.error(err);
        // TODO: Send a diff error template
        res.redirect("/");
    }
});

app.listen(port, function(){
    console.log(`App listening at http://localhost:${port}`);
});