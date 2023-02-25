const express = require('express');
const myApp = express();
var axios = require("axios");
const AWS = require("aws-sdk");
const AmazonS3URI = require("amazon-s3-uri");
const port=80;

const ec2Ip = "54.84.175.104";
const bannerId = "B00909845";

const s3 = new AWS.S3({
    aws_access_key_id: "ASIAW5OWUUL3C7IG6VPQ",
    aws_secret_access_key: "/w7kqUfrOWFg7GkBWsB70kWTwx26nTytfNoFioja",
    aws_session_token:
      "FwoGZXIvYXdzEIz//////////wEaDBNuhhPOVmS/Ghhx5CLAAdiaOweCwGQniaxmC6XCOGqPfyLJ2uRS/wiQCQJjIsEsZ2/zlbhXmiEwW8Pxuyz2mPAbUELAA8WE9TcInbZ6UpzPXtAsesJzfggmfbGDhoBEV282uGkaMJDJ4Bd1lPcZsRwljCy4bvdt+xn2su9Yt4ShekLC0BNTXRnmkZ2l/QNSuBqgcLzXs+jVKXZ46YWdnia88xT9VliMMcULG520rhO8BSNS4tSGPndWJsLTo2Ma5BS/WQkJmMjIGN9BsKuItyiQ9eWfBjItJwLYeMgoponiXJXlWpM4Vu8OJJSyiveb3wOyOwb0N8fI9X84nrbcYJslKqoo",
  });


myApp.use(express.json());

const jsonToSend={
    banner: bannerId,
    ip:ec2Ip,
};

myApp.get("/start", async (req, res) => {
     try {
      var responseBody = await axios.post("http://52.91.127.198:8080/start", jsonToSend);
      console.log(responseBody)
      return res.status(200).json({ success: "true", message: "Started" });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error." });
    }
  });


//https://www.zeolearn.com/magazine/uploading-files-to-aws-s3-using-nodejs
//https://flaviocopes.com/node-aws-s3-upload-image/
const uploadToBucket = async (input_text) => {
    var s3_uri = null;
    const params = {
      Bucket: "assg2bucket",
      Key: "test.txt",
      Body: input_text,
    };
    var loc = await s3
      .upload(params, function (s3Err, data) {
        if (s3Err) throw s3Err;
      })
      .promise();
    s3_uri = loc.Location; 
    return s3_uri;
  };
  
  //my app's response to storedata
  myApp.post("/storedata", async (req, res) => {
    var input_data = req.body.data;
    var s3_uri = await uploadToBucket(input_data);
    var response = {
      s3uri: s3_uri,
    };
    return res.status(200).send(response);
  });
  
  myApp.listen(port, () => {});


//https://stackoverflow.com/questions/34056133/append-string-to-a-text-file-nodejs-in-aws-lambda
myApp.post("/appenddata", async (req, res) => {
    var paramsToFetch = {
        Bucket: "assg2bucket",
        Key: "test.txt",
    };

    s3.getObject(paramsToFetch, function(err, data){
        if(err){
            console.log(err);
            console.log("Error fetching bucket "+ paramsToFetch.Bucket);
        }
        else{
            console.log(data)
            var dataFromFile = data.Body.toString('utf-8');
            dataFromFile += req.body.data;
            res.status(200).send("Data appended to file in bucket");
        }

        var params= {
            Bucket: "assg2bucket",
            Key: "test.txt",
            Body: dataFromFile,
          };

          s3.putObject(params, function(err, data) {
            if (err) {
                console.log(err);
                console.log("Error uploading to  bucket "+ params.Bucket);
            } else {
                console.log("Appended data uploaded successfully");
            }
});
    })

})

//https://github.com/frantz/amazon-s3-uri
//https://stackoverflow.com/questions/27753411/how-do-i-delete-an-object-on-aws-s3-using-javascript
myApp.post("/deletefile", async (req, res) => {
    var reqData =AmazonS3URI(req.body.s3uri);
    var s3params = {
        Bucket: reqData.bucket,
        Key: reqData.key,
      };

      s3.deleteObject(s3params, function(err, data) {
        if (err)
         console.log(err);  
        else    
         console.log("Object deleted from bucket");  
         res.status(200).send("Success!");               
      });
})