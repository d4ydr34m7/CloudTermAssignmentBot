var express = require("express");
var app = express();
var axios = require("axios");
var body_parser = require("body-parser");

const rsa = require("node-rsa");
const getprivateKey = new rsa();
const getpublicKey = new rsa();


const port = 80;


app.use(body_parser.urlencoded({ extended: false }));
app.use(body_parser.json());


app.listen(port, () => {
  console.log(`port: ${port}`);
});


//https://github.com/rzcoder/node-rsa
app.post("/start", async (req, res) => {
  axios
    .post("http://44.202.179.158:8080/start", {
      banner: "B00909845",
      ip: "100.25.141.122",
    })
    .then(function (response) {
      console.log(response);
      console.log(response.data)
    })
    .catch(function (error) {
      console.log(error);
    });
});

//https://www.npmjs.com/package/node-rsa

const publicKey =
  "-----BEGIN PUBLIC KEY-----\n" +
  "MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgFc195HM14tqVl8TnkuwaQ/f1spM\n" +
  "usqf0E5p9RHevAGNpsKa1sILTOJBH3IdUVLEFsMZ2e7kd8sDKVVWKWdD83amp9Em\n" +
  "LAvgK5U6lcF/hRWGyP5hcjfjfuXeKgpgPIxF+c/3oIjHbwKFIoOBexTvOBTrzIYY\n" +
  "P9vD1fYnLpgp46k/AgMBAAE=\n" +
  "-----END PUBLIC KEY-----";
getpublicKey.importKey(publicKey);

const privateKey =
  "-----BEGIN RSA PRIVATE KEY-----\n" +
  "MIICWgIBAAKBgFc195HM14tqVl8TnkuwaQ/f1spMusqf0E5p9RHevAGNpsKa1sIL\n" +
  "TOJBH3IdUVLEFsMZ2e7kd8sDKVVWKWdD83amp9EmLAvgK5U6lcF/hRWGyP5hcjfj\n" +
  "fuXeKgpgPIxF+c/3oIjHbwKFIoOBexTvOBTrzIYYP9vD1fYnLpgp46k/AgMBAAEC\n" +
  "gYAXYhzzNt1EQErQS05SNQa2fun0bAZZdehAXiCbngEC2Zww6ZtTg/wlXhi0XDAF\n" +
  "5RXFUhUg/JkyEbLvcp6/VXTdtwYZkKqAHtYHNztgGdkFR6k7a/KjWSEqRi76RKuB\n" +
  "qhINg1zIxywFNJ+ansM4ONhhEHolDbv4AL3vIL3+ENIaIQJBAKIBkp8a0f5Czm2h\n" +
  "hoIJ94PArxIrt3bApLkLWozyUEUDc5m+1fBzA/8n3tON0oHqT7WbXnFMtX07it/h\n" +
  "iF/D2bMCQQCJzzPhn/y7pl86eO5mTOsR6gU5vfmFyzM6FJlHOv2ghan3wE4kXH3J\n" +
  "GXtFH1UD/jKjhsvQMXpbB4LITfQCiBRFAkB2JVN6OKMAHFRS20MuvnoFWZXTWJJZ\n" +
  "RjBayo7kzyn+yn+ZlfSLgDVf9QGponnsSKaMuJvtYJXSmIO0tdMwk7HFAkBrb1Gv\n" +
  "EB7j2+xZlXWl40lPifXQ8j3ZBHVHTk/ArEiWIB5Fu3Iv/rtBT9A+LxMELeQkgC3c\n" +
  "fPY6iTx4E+2rG5NRAkAB4ErpaUKxLGbAnYUMY1CxNPnv70pgAbzti4IQX3SE2Fbc\n" +
  "xIeigsElUR8+RPyna56gFNTTnFRS9c1BFRAXhMrg\n" +
  "-----END RSA PRIVATE KEY-----";
getprivateKey.importKey(privateKey);

//https://attacomsian.com/blog/nodejs-encrypt-decrypt-data-rsa
app.post("/decrypt", async (req, res) => {
  const decryptMessage = getprivateKey.decrypt(
    Buffer.from(req.body.message, "base64"),
    "utf8"
  );
  res.status(200).json({ response: decryptMessage });
});


app.post("/encrypt", async (req, res) => {
  const encodeMessage = Buffer.from(
    getpublicKey.encrypt(req.body.message),
    "binary"
  ).toString("base64");
  res.status(200).json({ response: encodeMessage });
});
