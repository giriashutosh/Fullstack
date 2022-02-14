let addBtn=document.querySelector(".add-btn")
let removeBtn=document.querySelector(".remove-btn")
let modalElem=document.querySelector(".modal-cont")
let mainCont=document.querySelector(".main-cont")
let allPriorityColors=document.querySelectorAll('.priority-color')
let textareaCont=document.querySelector(".textarea-cont")
let colors=['lightpink','lightblue','lightgreen','black']
let toolBoxColors=document.querySelectorAll(".color")
let modalPriorityColor=colors[colors.length-1]
let flag=false;
let removeFlag=false;

let lockClass="fa-lock"
let unlockClass="fa-lock-open"
let ticketArr=[]
if(localStorage.getItem("jira_ticket")){
    //Retrieve ticket and display
    ticketArr=JSON.parse(localStorage.getItem("jira_ticket"))
    ticketArr.forEach((ticketobj)=>{
        createTicket(ticketobj.ticketColor,ticketobj.ticketTask,ticketobj.ticketId)
    })
}
for(let i=0;i<toolBoxColors.length;i++){
    
        toolBoxColors[i].addEventListener("click",(e)=>{
        //console.log("clicked")
        
        let currentToolBoxColor=toolBoxColors[i].classList[0]
        let filteredTickets=ticketArr.filter((ticketObj,idx)=>{
            return currentToolBoxColor === ticketObj.ticketColor
        })
        //Remove Previous Ticket
        let allTicketCont=document.querySelectorAll(".ticket-cont")
        for(let i=0;i<allTicketCont.length;i++){
            allTicketCont[i].remove()
        }
        //Display new filtered ticket
        filteredTickets.forEach((ticketObjs,idx)=>{
            createTicket(ticketObjs.ticketColor,ticketObjs.ticketTask,ticketObjs.ticketId)
        })
      })
     
            toolBoxColors[i].addEventListener("dbclick",(e)=>{
            console.log("double clicked")
            let allTicketCont=document.querySelectorAll(".ticket-cont")
            for(let i=0;i<allTicketCont.length;i++){
              allTicketCont[i].remove()
            }
            ticketArr.forEach((ticketObj1,idx)=>{
            createTicket(ticketObj1.ticketColor1,ticketObj1.ticketTask,ticketObj1.ticketId)
            })
          })  
        
}

//Listener For modal priority coloring
allPriorityColors.forEach((colorElem,idx) => {
    
    colorElem.addEventListener("click",(e)=>{
        allPriorityColors.forEach((priorityColorElem,idx)=>{
            priorityColorElem.classList.remove("border");
        })
        colorElem.classList.add("border")
        modalPriorityColor=colorElem.classList[0]
    })
})       
        
   
addBtn.addEventListener("click",(e)=>{
    //display modal
    //generate ticket
    flag=!flag
    if(flag){
        modalElem.style.display="flex";
    }
    else{
        modalElem.style.display="none";
    }
})   

removeBtn.addEventListener("click",(e)=>{
    removeFlag=!removeFlag
})

modalElem.addEventListener("keydown",(e)=>{
    let key=e.key;
    if(key === "Shift"){
        createTicket(modalPriorityColor,textareaCont.value)
        
        flag=false;
        setModalsToDefault()
        
    }
})



function createTicket(ticketColor,ticketTask,ticketId){
    
    let Id=ticketId || shortid()
    let ticketCont=document.createElement("div")
    ticketCont.setAttribute("class","ticket-cont")
    ticketCont.innerHTML=`
            <div class="ticket-color ${ticketColor}"></div>
            <div class="ticket-id">${Id}</div>
            <div class="task-area">${ticketTask}</div>
            <div class="ticket-lock">
                <i class="fa-solid fa-lock"></i>
            </div>
    `;
    mainCont.appendChild(ticketCont);
    //console.log(ticketId)
    //create object of ticket and add to array
    if(!ticketId){
     ticketArr.push({ticketColor,ticketTask,ticketId: Id})
     localStorage.setItem("jira_ticket",JSON.stringify(ticketArr))
    }
    
    handleRemoval(ticketCont,Id)
    handleLock(ticketCont,Id)
    handleColor(ticketCont,Id)
}

function handleRemoval(ticket,id){
    //removeFlag -> true ->remove
    ticket.addEventListener("click",(e)=>{
        //db removal
        if(!removeFlag) return;
        let idx=getTicketIdx()
        ticketArr.splice(idx,1)
        localStorage.setItem("jira_ticket",JSON.stringify(ticketArr))
        ticket.remove()//UI removal
    })
    // if(removeFlag){
    //     ticket.remove()
    // }
}

function handleLock(ticket,id){
    let ticketLockElem=ticket.querySelector(".ticket-lock")
    let ticketLock=ticketLockElem.children[0]
    let ticketTaskArea=ticket.querySelector(".task-area")
    ticketLock.addEventListener("click",(e)=>{
        let ticketIdx=getTicketIdx(id)
        if(ticketLock.classList.contains(lockClass)){
            ticketLock.classList.remove(lockClass)
            ticketLock.classList.add(unlockClass)
            ticketTaskArea.setAttribute("contenteditable","true")
        }
        else{
            ticketLock.classList.remove(unlockClass)
            ticketLock.classList.add(lockClass)
            ticketTaskArea.setAttribute("contenteditable","false")
        }
        //Modify data in local Storage
        ticketArr[ticketIdx].ticketTask=ticketTaskArea.innerText
        localStorage.setItem("jira_ticket",JSON.stringify(ticketArr))
    })
}

function handleColor(ticket,id){
    let ticketColor=ticket.querySelector(".ticket-color")
    ticketColor.addEventListener("click",(e)=>{
        //get ticketidx from ticketArr
        let ticketIdx=getTicketIdx(id)
        let currentTicketColor=ticketColor.classList[1]
       //Get ticket color idx
       let currentTicketColorIdx=colors.findIndex((color)=>{
        return currentTicketColor === color
       })
       //console.log(currentTicketColorIdx)
       currentTicketColorIdx++;
       let newTicketColorIdx=currentTicketColorIdx%colors.length
       let newTicketColor=colors[newTicketColorIdx]
       ticketColor.classList.remove(currentTicketColor)
       ticketColor.classList.add(newTicketColor)
       //modify data in local storage
       ticketArr[ticketIdx].ticketColor=newTicketColor
       localStorage.setItem("jira_ticket",JSON.stringify(ticketArr))
    })
    
}
function getTicketIdx(id){
    let ticketIdx=ticketArr.findIndex((ticketObj)=>{
        return ticketObj.ticketId === id
    })
    return ticketIdx
}

function setModalsToDefault(){
        modalElem.style.display="none";
        textareaCont.value="";
        modalPriorityColor=colors[colors.length-1]
    allPriorityColors.forEach((priorityColorElem,idx)=>{
        priorityColorElem.classList.remove("border");
    })
    allPriorityColors[allPriorityColors.length-1].classList.add("border")
}