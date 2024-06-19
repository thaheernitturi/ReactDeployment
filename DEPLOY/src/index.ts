import {createClient,commandOptions } from "redis";
import { copyFinalDist, downloadFolder} from "./aws";
import { build} from "./utils";
const subscriber= createClient();
subscriber.connect();

async function main() {
    while(1){
        const response=await subscriber.brPop(
            commandOptions({isolated:true}),
            'build-queue',
            0
        );
        console.log(response);
        var res=JSON.stringify(response)
        const id=JSON.parse(res).element;
        await downloadFolder(`output/${id}`)
       console.log("downloded")
       await build(id);
        copyFinalDist(id);
        
    }
}
main();