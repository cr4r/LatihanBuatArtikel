const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const blog = require('./models/blog')
const artikelRoute = require('./routes/blogs')
const uri = `mongodb://coba:coba123@cluster0-shard-00-00.gjw5u.mongodb.net:27017,cluster0-shard-00-01.gjw5u.mongodb.net:27017,cluster0-shard-00-02.gjw5u.mongodb.net:27017/website?ssl=true&replicaSet=atlas-glof98-shard-0&authSource=admin&retryWrites=true&w=majority`
const httpmsgs = require('http-msgs');
mongoose.connect(
    uri,
    {useUnifiedTopology: true, useNewUrlParser: true, serverSelectionTimeoutMS: 5000},
    (err)=>{
        if(err) return console.log(`Error gan\n\n${err}`);
        console.log('Database sudah terkoneksi')
    }
)
//JSON
app.use(methodOverride('_method'))
//mengambil data hasil POST oleh clien
var optionPublic = {
    etag:true,maxAge:31536000,
    redirect: true, setHeaders:function(res, path, set){
        res.set({
            'x-timestamp': Date.now(), 'cr4r':'Hai kawan'
        });
    }
}
app.use("/", express.static("public", optionPublic));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.urlencoded({ extended: false }))
app.use((req, res, next) => {res.header("Access-Control-Allow-Origin", "*"); res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); next(); });

//Supaya support file .ejs
app.set('view engine','ejs');

//Static
app.use("/", express.static("public"));

//rooting
app.get('/', async (req, res) => {
    const artikel = await blog.find().sort({ createdAt: 'desc' })
    res.render('bahan/body', { artikel:artikel, isinya:'index' })
})

app.post("/ajaxdemo",async (req, res) => {
    var data = req.body;
    console.log(data);
    httpmsgs.sendJSON(req,res, {
        from: "server"
    })
})

app.use('/', artikelRoute)

module.exports = app;
