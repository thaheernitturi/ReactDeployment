import {S3} from "aws-sdk";
import fs from "fs";
import path from "path";

const s3=new S3({
    accessKeyId:"46c27972be2a7ec170e489045c7209d6",
    secretAccessKey:"7f9e421c007cdaa7cb7921e80d06824337f3c71349d1b80f9b68cffcf957cfa6",
    endpoint:"https://174e4b501d7a8a41dcf5a1b2ea9856cc.r2.cloudflarestorage.com"
})

export async function downloadFolder(folderPath:string){
    console.log(folderPath);
    const allFiles=await s3.listObjectsV2({
        Bucket:"reactdeploy",
        Prefix:folderPath
    }).promise();

    const allPromises=allFiles.Contents?.map(async({Key})=>{
        return new Promise(async(resolve)=>{
            if(!Key){
                resolve("hello1");
                return;
            }
            const finalOutputPath=path.join(__dirname,Key);
            const dirname=path.dirname(finalOutputPath);
            if(!fs.existsSync(dirname)){
                fs.mkdirSync(dirname,{recursive:true})
            }
            const outputStream=fs.createWriteStream(finalOutputPath);
            s3.getObject({
                Bucket:"reactdeploy",
                Key:Key
            }).createReadStream().pipe(outputStream).on("finish",()=>{
                resolve("helllo2");
            })
        })
    })||[]
    console.log("awating");
    await Promise.all(allPromises?.filter(x=>x!==undefined));
}

export function copyFinalDist(id: string) {
    const folderPath = path.join(__dirname, `output/${id}/dist`);
    const allFiles = getAllFiles(folderPath);
    allFiles.forEach(file => {
        uploadFile(`dist/${id}/` + file.slice(folderPath.length + 1), file);
    })
}


const getAllFiles=(folderPath:string)=>{
    let response:string[]=[];
    const allFilesAndFolders = fs.readdirSync(folderPath);allFilesAndFolders.forEach(file => {
        const fullFilePath = path.join(folderPath, file);
        if (fs.statSync(fullFilePath).isDirectory()) {
            response = response.concat(getAllFiles(fullFilePath))
        } else {
            response.push(fullFilePath);
        }
    });
    return response;
}


const uploadFile = async (fileName: string, localFilePath: string) => {
    const fileContent = fs.readFileSync(localFilePath);
    const response = await s3.upload({
        Body: fileContent,
        Bucket: "reactdeploy",
        Key: fileName,
    }).promise();
    console.log(response);
}