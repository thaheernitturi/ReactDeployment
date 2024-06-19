const max=7;

export function generate(){
    let ans="";
    const subset="12356789qwertyuiopasdfghjklzxcvbnm";
    for(let i=0; i<max;i++){
        ans+=subset[Math.floor(Math.random()*subset.length)];
    }
    return ans;
}