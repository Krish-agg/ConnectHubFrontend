import moment from "moment";

const fileFormat=(url="")=>{
    const fileExtention=url.split((".")).pop();
    if(fileExtention==="mp4" || fileExtention==="webm" || fileExtention==="ogg")return "video";
    if(fileExtention==="mp3" || fileExtention==="wav" )return "audio";
    if(fileExtention==="jpg" || fileExtention==="jpeg" || fileExtention==="gif" || fileExtention==="png")return "image";
    return "file";
} 

const tranformImage=(url="",width=100)=>{
    const newUrl=url.replace("upload/",`upload/dpr_auto/w_${width}/`)

    return newUrl;


};
export const getLast7Days=()=>{
    const currentDate=moment();
    const last7days=[];
    for(let i=0;i<7;i++){
        last7days.unshift(currentDate.format("dddd"));
        currentDate.subtract(1,"days");
    }
    return last7days;
};

const getOrSaveFromStorage=({key,value,get})=>{
    if(get)return localStorage.getItem(key)
        ?JSON.parse(localStorage.getItem(key)):null;
    else localStorage.setItem(key,JSON.stringify(value));
}
export {fileFormat,tranformImage,getOrSaveFromStorage}