const express   = require('express');
const router    = express.Router();
const fs        = require('fs');
const { exec }  = require('child_process');
const bodyParser = require('body-parser');
const hbs=require('hbs')
require('dotenv/config')
const path=require('path')
const aws=require('aws-sdk')
var s3=new aws.S3({
    accessKeyId:process.env.AWS_ID,
    secretAccessKey:process.env.AWS_SECRET
});
var params={Bucket:process.env.AWS_BUCKET_NAME}
const app = express();
const viewPath = path.join(__dirname,"/views");
//app.set('view engine', 'ejs');
app.set('view engine', 'hbs');
app.set('views', viewPath);
console.log(viewPath)
app.use(bodyParser.urlencoded({ extended: true })); 
router.post('/upload', function(req, res) {
s3.listObjects(params,function(err,data){
    if(err)
    {
        console.log(err)
    }
    else{
        const {Contents}=data;
        var demo=[]
        //console.log(Contents)
        Contents.forEach(e=>{
            demo.push("https://prem-bucket-panwala.s3.us-east-2.amazonaws.com/"+e.Key)
            //console.log("https://prem-bucket-panwala.s3.us-east-2.amazonaws.com/"+e.Key)
        })
        console.log(demo)
        res.render('disp',{name:demo})
    
        
    }
})
})


router.get('/demo', function(req, res) {
    //console.log(req.body.co)
    res.sendFile(__dirname + '/prem.html')
})
router.post('/final', function(req, res) {
    console.log(req.body.fname)
    s3.listObjects(params,function(err,data){
        if(err)
        {
            console.log(err)
        }
        else{
            const {Contents}=data;
            var demo="https://prem-bucket-panwala.s3.us-east-2.amazonaws.com/"+Contents[req.body.fname].Key
          //console.log(Contents[1].Key)
          console.log(demo)
          res.render('index',{name:demo})
            // Contents.forEach(e=>{
            //     demo.push("https://prem-bucket-panwala.s3.us-east-2.amazonaws.com/"+e.Key)
            //     //console.log("https://prem-bucket-panwala.s3.us-east-2.amazonaws.com/"+e.Key)
            // })
            // console.log(demo)
            // res.render('disp',{name:demo})
        
            
        }
    })
})
// Set ejs template engine


router.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
});




app.use(router);



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});