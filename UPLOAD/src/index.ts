import  express  from "express";
import cors from "cors";
import simpleGit from "simple-git";//for spawn.. interface for running git commands in any node.js application
import {generate} from "./gene";
import { getallfiles } from "./file";
import path from  "path";
import { uploadfile } from "./aws";
import { createClient } from "redis";
const publisher=createClient();
publisher.connect();
const app=express();

app.use(cors())//use-middleware
app.use(express.json());//for understanding the json format of the body 

app.post("/deploy",async (req,res)=>{
    const repoUrl =req.body.repoUrl;
    console.log(repoUrl);
    const id =generate();
    await simpleGit().clone(repoUrl,path.join(__dirname,`./output/${id}`));
    const files=getallfiles(path.join(__dirname,`./output/${id}`));
    files.forEach(async file=>{
        await uploadfile(file.slice(__dirname.length+1),file);
    })
    publisher.lPush("build-queue",id);
    console.log(files)
    res.json({
        id: id
    })
})
app.listen(3001);