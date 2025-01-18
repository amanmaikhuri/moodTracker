let myMoodLogs=[];
const moodToday =document.querySelector("#mood-options");
const Thoughts =document.querySelector("#text-box");
const submitbtn =document.querySelector("#submit-btn");
const Deletebtn =document.querySelector("#delete-btn");

let pastLogs =document.querySelector("#logs");
let mood =document.querySelector("#mood");
let timenow =document.querySelector("#time-stamp");

let logMoodToLs = document.querySelector("#pastLogs");
const ul = document.querySelector("#ul");

const now = new Date();
const year = now.getFullYear();
const month =String(now.getMonth()+1).padStart(2, '0');
const Day = String(now.getDate()).padStart(2, '0');
const hours= String(now.getHours()).padStart(2, '0');
const minutes = String(now.getMinutes()).padStart(2, '0');
const seconds = String(now.getSeconds()).padStart(2, '0');

let dayStamp = `${Day}-${month}-${year}`;
let timeStamp = `${hours}:${minutes}:${seconds}`;

let recTime =`[${dayStamp} ${timeStamp}]`;

const logsFromLocalStorage = JSON.parse(localStorage.getItem("myMood-Logs"));


if(logsFromLocalStorage){
    myMoodLogs = logsFromLocalStorage
    render(myMoodLogs)
}


submitbtn.addEventListener("click",function(){
    const myMood = {
        "moodNow": moodToday.value,
        "thoughts" : Thoughts.value,
        "time": recTime,
        "emoji": returnEmoji()
    }
    const pushEntry =` ${myMood.time} ${myMood.moodNow} ${myMood.emoji}
     ${myMood.thoughts}`
    myMoodLogs.push(pushEntry);
    console.log(myMoodLogs)
    localStorage.setItem("myMood-Logs" ,JSON.stringify(myMoodLogs))
    render(myMoodLogs)
})

Deletebtn.addEventListener("dblclick",function(){
    localStorage.clear()
    myMoodLogs =[]
    render(myMoodLogs)
})


function render(moodlogs){
    let listItems = ""
    for(let i=0 ; i < myMoodLogs.length ;i++){
        listItems += `
            <li>
                ${moodlogs[i]}     
            </li>`
    }
    ul.innerHTML = listItems;
}


function returnEmoji() {
    if(moodToday.value === "happy"){
        return "😊"
    } else if(moodToday.value === "sad"){
        return "😔"
    } else if(moodToday.value === "neutral"){
        return "😐"
    } 
}