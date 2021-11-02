### Mini Search

Search for articles and stuff.

### Insert documents to collection:

```
node addtoDatabase.js
```

### Create index:
```
db.articles.createIndex({keywords: "text", filename: "text"});
```

### Search:
```
db.articles.find({$text: {$search: "quantum"}});
```