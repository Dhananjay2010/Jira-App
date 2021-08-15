let filter = document.querySelectorAll(".filter div");
let grid = document.querySelector(".grid")
let addBtn = document.querySelector(".add");
let body = document.querySelector("body");
let modalVisible = false;

var uid = new ShortUniqueId();
let carr = [];
let colors = {
    "pink": "#d595aa",
    "blue": "#5cedde",
    "green": "#91ec67",
    "black": "black"
};

let colorClasses = ["pink", "blue", "green", "black"];

let deleteState = false;
let deleteBtn = document.querySelector(".delete");

//<=============================Local Storage to make data persistent=====================================>

//initialisation step  
if (!localStorage.getItem("tasks")) {
    localStorage.setItem("tasks", JSON.stringify([]));
}

//<=====================Adding the delete state class===============================>

deleteBtn.addEventListener("click", function (e) {
    if (deleteState) {
        deleteState = false;
        if (deleteBtn.classList.contains("delete-state")) {

            deleteBtn.classList.remove("delete-state");
        }
    }
    else {
        deleteState = true;
        deleteBtn.classList.add("delete-state");

    }
})

//<=========================Create a modal==============================>//
addBtn.addEventListener("click", function (e) {
    if (modalVisible) return;

    if (deleteBtn.classList.contains("delete-state")) {
        deleteState = false;
        deleteBtn.classList.remove("delete-state");
    }

    let modal = document.createElement("div"); //`div banaya aur usme dala ek class modal container `
    modal.classList.add("modal-container"); // aur tab uske andar banai hui HTML dal de
    modal.setAttribute("click-first", true);
    modal.innerHTML = `<div class="writing-area" contenteditable>Enter Your Task</div>
   <div class="filter-area">
       <div class="modal-filter pink"></div>
       <div class="modal-filter blue"></div>
       <div class="modal-filter green"></div>
       <div class="modal-filter black active-modal-filter"></div>

   </div>`;

    let allMOdalFilters = modal.querySelectorAll(".modal-filter");

    //<=============================To add border to the selected color============================>//
    for (let i = 0; i < allMOdalFilters.length; i++) {
        allMOdalFilters[i].addEventListener("click", function (e) {
            for (let j = 0; j < allMOdalFilters.length; j++) {
                allMOdalFilters[j].classList.remove("active-modal-filter");
            }
            e.currentTarget.classList.add("active-modal-filter");
        })
    }

    //<==========================To remove "Enter your task when clicked"=========================>//

    let wa = modal.querySelector(".writing-area");
    wa.addEventListener("click", function (e) {
        if (modal.getAttribute("click-first") == "true") {
            wa.innerHTML = "";
            modal.setAttribute("click-first", false);
        }
    });

    //<========================To create a ticket when press Enter============================>//

    wa.addEventListener("keypress", function (e) {
        if (e.key == "Enter") {
            let task = e.currentTarget.innerText;
            let selectedModalFilter = document.querySelector(".active-modal-filter");
            let color = selectedModalFilter.classList[1];
            let id = uid();
            console.log(color);
            console.log(task);
            // let colorCode=colors[color];
            let ticket = document.createElement("div");
            ticket.classList.add("ticket");
            ticket.innerHTML = ` <div class="ticket-color ${color} "></div>
            <div class="ticket-id">${id}</div>
            <div class="ticket-box" contenteditable >
            ${task}
            </div>;`

            //<===========================Local Storage Work==========================>//

            saveTicketInLocalStorage(id, color, task);// Saving the ticket in local storage.

            let ticketWritingArea = ticket.querySelector(".ticket-box");

            console.log(typeof id);

            ticketWritingArea.addEventListener("input", function (e) {
                let id = e.currentTarget.parentElement.querySelector(".ticket-id").innerText;
                let tasksArr = JSON.parse(localStorage.getItem("tasks"));
                let reqIndex = -1;

                for (i = 0; i < tasksArr.length; i++) {
                    if (tasksArr[i].id == id) {
                        reqIndex = i;
                        break;
                    }
                }

                tasksArr[reqIndex].task = e.currentTarget.innerText;
                localStorage.setItem("tasks", JSON.stringify(tasksArr));
                //   console.log(id);
            })

            //<=========================Changing color in local Strorage=========================>

            let ticketColorDiv = ticket.querySelector(".ticket-color");
            ticketColorDiv.addEventListener("click", function (e) {
                let id = e.currentTarget.parentElement.querySelector(".ticket-id").innerText;
                let tasksArr = JSON.parse(localStorage.getItem("tasks"));
                let reqIndex = -1;

                for (let i = 0; i < tasksArr.length; i++) {
                    if (tasksArr[i].id == id) {
                        reqIndex = i;
                        break;
                    }
                }

                let Currcolor = tasksArr[reqIndex].color;
                let colorIdx = colorClasses.indexOf(Currcolor);
                colorIdx++;
                colorIdx = colorIdx % 4;
                tasksArr[reqIndex].color = colorClasses[colorIdx];
                localStorage.setItem("tasks", JSON.stringify(tasksArr));
            })

            //<==================To delete the data from local Storage if ticket deleted and also remove the ticket.================================>

            ticket.addEventListener("click", function (e) {
                if (deleteState) {
                    let tasksArr = JSON.parse(localStorage.getItem("tasks"));
                    let id = ticket.querySelector(".ticket-id").innerText;

                    tasksArr = tasksArr.filter(function (el) {
                        return el.id != id;
                    });

                    localStorage.setItem("tasks", JSON.stringify(tasksArr));

                    e.currentTarget.remove();
                }
            })

            //<==============To remove the ticket============================>//

            // ticket.addEventListener("click", function(e){
            //     if(deleteState){
            //         ticket.remove();
            //     }
            // })

            //<=========================ticket color change by clicking on it=====================
            let ticketcolorDiv = ticket.querySelector(".ticket-color");
            ticketcolorDiv.addEventListener("click", function (e) {
                let currentColor = e.currentTarget.classList[1];
                let index = colorClasses.indexOf(currentColor);
                index++;
                index = index % 4;
                e.currentTarget.classList.remove(currentColor);
                e.currentTarget.classList.add(colorClasses[index]);

            })

            grid.appendChild(ticket);
            modal.remove();
            modalVisible = false;
        }
    })


    body.appendChild(modal);// append aur append child
    modalVisible = true;
})

//<=========================To change the background color when clicked==========================>//

for (let i = 0; i < filter.length; i++) {
    filter[i].addEventListener("click", function (e) {
        color = filter[i].classList[0].split('-')[0];
        //  

        loadTasks(color);
    });
}


//<================================Local Storage work====================================>//

function saveTicketInLocalStorage(id, color, task) {
    let requiredObj = { id, color, task };
    let tasksArr = JSON.parse(localStorage.getItem("tasks"));
    tasksArr.push(requiredObj);
    localStorage.setItem("tasks", JSON.stringify(tasksArr));
}

//<==================Making data persistent==================>
function loadTasks(Passed_color) {

    let all_tickets=document.querySelectorAll(".ticket");
    for(i=0;i<all_tickets.length;i++){
        all_tickets[i].remove();
    }

    let tasksArr = JSON.parse(localStorage.getItem("tasks"));
    for (let i = 0; i < tasksArr.length; i++) {
        //<=======================Now start making tickets of the saved data================>

        let ticket = document.createElement("div");
        ticket.classList.add("ticket");
        ticket.innerHTML = ` <div class="ticket-color ${tasksArr[i].color} "></div>
        <div class="ticket-id">${tasksArr[i].id}</div>
        <div class="ticket-box" contenteditable >
        ${tasksArr[i].task}
        </div>;`

        if(Passed_color){
            if(Passed_color!=tasksArr[i].color){
                continue;
            }
        }

        let ticketWritingArea = ticket.querySelector(".ticket-box");

        

        ticketWritingArea.addEventListener("input", function (e) {
            let id = e.currentTarget.parentElement.querySelector(".ticket-id").innerText;
            let tasksArr = JSON.parse(localStorage.getItem("tasks"));
            let reqIndex = -1;

            for (i = 0; i < tasksArr.length; i++) {
                if (tasksArr[i].id == id) {
                    reqIndex = i;
                    break;
                }
            }

            tasksArr[reqIndex].task = e.currentTarget.innerText;
            localStorage.setItem("tasks", JSON.stringify(tasksArr));
            //   console.log(id);
        });


        let ticketColorDiv = ticket.querySelector(".ticket-color");
        ticketColorDiv.addEventListener("click", function (e) {
            let id = e.currentTarget.parentElement.querySelector(".ticket-id").innerText;
            let tasksArr = JSON.parse(localStorage.getItem("tasks"));
            let reqIndex = -1;

            for (let i = 0; i < tasksArr.length; i++) {
                if (tasksArr[i].id == id) {
                    reqIndex = i;
                    break;
                }
            }

            let Currcolor = tasksArr[reqIndex].color;
            let colorIdx = colorClasses.indexOf(Currcolor);
            colorIdx++;
            colorIdx = colorIdx % 4;
            tasksArr[reqIndex].color = colorClasses[colorIdx];
            localStorage.setItem("tasks", JSON.stringify(tasksArr));
        })

        let ticketcolorDiv = ticket.querySelector(".ticket-color");
        ticketcolorDiv.addEventListener("click", function (e) {
            let currentColor = e.currentTarget.classList[1];
            let index = colorClasses.indexOf(currentColor);
            index++;
            index = index % 4;
            e.currentTarget.classList.remove(currentColor);
            e.currentTarget.classList.add(colorClasses[index]);

        });


        ticket.addEventListener("click", function (e) {
            if (deleteState) {
                let tasksArr = JSON.parse(localStorage.getItem("tasks"));
                let id = ticket.querySelector(".ticket-id").innerText;

                tasksArr = tasksArr.filter(function (el) {
                    return el.id != id;
                });

                localStorage.setItem("tasks", JSON.stringify(tasksArr));

                e.currentTarget.remove();
            }
        })

        grid.appendChild(ticket);

    }
}

loadTasks();