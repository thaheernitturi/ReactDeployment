import fs from "fs";
import path from "path"

export const getallfiles = (folderPath: string)=>{
    let response:string[]=[];
    const allFileAndFolders=fs.readdirSync(folderPath);allFileAndFolders.forEach((file)=>{

        const fullFilePath=path.join(folderPath,file);
        if(fs.statSync(fullFilePath).isDirectory()){
            response=response.concat(getallfiles(fullFilePath))
        }
        else{
            response.push(fullFilePath);
        }
    });
    return response;
}