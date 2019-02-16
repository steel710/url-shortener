var express = require('express');
// var MongoClient = require('mongodb').MongoClient;
var bodyparse = require('body-parser');
var app = express();
var mongo = require('mongodb').MongoClient;
var address = "mongodb://localhost:27017/";

app.use(express.static('main_files'));

app.use(bodyparse.urlencoded({extended: false}));
app.use(bodyparse.json());

app.get('/',function(req,res){
    res.sendFile("index.html");
});

//To get the url from user input and store it in DB
app.post('/login',function(req,res){
    var lgurl = req.body.url;
    console.log("the long url is: "+lgurl);
    res.end(lgurl);
    
    //To connect the MongoDB database 
    mongo.connect(address,{useNewUrlParser: true}, function(err, mongo) {
        if (err) throw err;
        var dbo = mongo.db("MainDB");
        var data = {url: lgurl};
        //To find the url in the DB
        dbo.collection("URLs").find(data).toArray(function(err, result) {
            if (err){
                return err;
            }
            if(result.length > 0){
                console.log("URL is already present at id " + result[0]._id);
            }
            else{
                //To insert url into the DB
                dbo.collection("URLs").insertOne(data, function(err, res) {
                    if (err) throw err;
                    console.log("1 document inserted : " + res);
                });
            }
            mongo.close();
        });
    });

});

//For redirecting shorten url to main url
app.get('/:key',function(req, res){
    var keys = req.params.key;
    console.log(keys);
    res.redirect('https://www.google.com');
});

app.listen(8080,function(){
    console.log("Started on port 8080");
});