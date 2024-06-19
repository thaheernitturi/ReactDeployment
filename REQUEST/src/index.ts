import express from "express";
import { S3 } from "aws-sdk";

const s3 = new S3({
    accessKeyId:"46c27972be2a7ec170e489045c7209d6",
    secretAccessKey:"7f9e421c007cdaa7cb7921e80d06824337f3c71349d1b80f9b68cffcf957cfa6",
    endpoint:"https://174e4b501d7a8a41dcf5a1b2ea9856cc.r2.cloudflarestorage.com"
})

const app = express();

app.get("/*", async (req, res) => {
    
    const host = req.hostname;

    const id = host.split(".")[0];
    const filePath = req.path;

    const contents = await s3.getObject({
        Bucket: "reactdeploy",
        Key: `dist/${id}${filePath}`
    }).promise();
    
    const type = filePath.endsWith("html") ? "text/html" : filePath.endsWith("css") ? "text/css" : "application/javascript"
    res.set("Content-Type", type);

    res.send(contents.Body);
})

app.listen(3001);