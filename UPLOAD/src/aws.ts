import {S3} from "aws-sdk";
import fs from "fs"
const s3=new S3({
    accessKeyId:"46c27972be2a7ec170e489045c7209d6",
    secretAccessKey:"7f9e421c007cdaa7cb7921e80d06824337f3c71349d1b80f9b68cffcf957cfa6",
    endpoint:"https://174e4b501d7a8a41dcf5a1b2ea9856cc.r2.cloudflarestorage.com"
})

export const uploadfile=async(filename:string,localfilepath:string)=>{
    console.log("called");
    var re=/\\/gi
    filename=filename.replace(re,"/");
    const fileContent=fs.readFileSync(localfilepath);
    const response=s3.upload({
        Body: fileContent,
        Bucket:"reactdeploy",
        Key:filename,
    }).promise();
    console.log(response);
}