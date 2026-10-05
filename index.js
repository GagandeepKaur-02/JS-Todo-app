
// new code-------------------------

const todoForm = document.querySelector("#todo-form")
const todoInput = document.querySelector("#todo-input")
const todoList = document.querySelector("#todo-list")
const formBtn = document.querySelector("#form-btn")
const taskCount = document.querySelector("#task-count")
const completeCount = document.querySelector("#complete-count")
const cancelBtn = document.querySelector("#cancel-btn")
const emptyState = document.querySelector("#empty-state")




// let todos = [
//     {
//         id: Date.now() + 1,
//         text: "Go to gym",
//         isCompleted: false
//     },
//     {
//         id: Date.now() + 2,
//         text: "Revision Web dev",
//         isCompleted: false
//     },
//     {
//         id: Date.now() + 3,
//         text: "Take class",
//         isCompleted: false
//     }
// ]
let todos = JSON.parse(localStorage.getItem("todos")) || [];
console.log(todos);


let editTodoId = null  // flag

todoForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const todoValue = todoInput.value.trim();



    // aagr todo ki value empty hai means "" then we do !"" -> true and ! is logical not operator
    if (!todoValue) {          //! (Not operator): यह किसी चीज़ को उल्टा कर देता है। यहाँ !todoValue का मतलब है "अगर todoValue में कुछ नहीं है" (यानी वह खाली है, null है, या undefined है)।
        return                 //j todoValue null aa => means kuj v nhi likhya taa ethe hi ruk j te vapis chla jaye ....agge code vich na jave (a code da  इस्तेमाल आमतौर पर किसी काम (Action) को बीच में ही रोकने के लिए किया जाता है। )
    }

    console.log({ editTodoId, todoValue });

    if (editTodoId) {
        // editing 
        todos = todos.map((todo) => {
            if (todo.id === Number(editTodoId)) {
                return {
                    ...todo,
                    text: todoValue
                }
            }
            return todo
        })
        localStorage.setItem("todos", JSON.stringify(todos));
    } else {

        // Pehle current Date aur Time ka ek sundar format bana lete hain
        const now = new Date();
        const formattedTime = now.toLocaleString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            day: 'numeric',
            month: 'short'
        });
        //adding
        let newTodo = {
            id: Date.now(),
            text: todoValue,
            isCompleted: false,
            time: formattedTime
        }
        todos.push(newTodo) // adding new todo to exisiting todos list => means jerha v new task input vich likhna o pehle todos vich nl add ho jave last te (because push laya)
        localStorage.setItem("todos", JSON.stringify(todos));

        // todos.push({
        //     id: Date.now(),
        //     text: todoValue,
        //     isCompleted: false
        // })
    }

    cancelEdit();
    renderTodo() // jab koi naya todo add hoga firse updated todos render ho jayenge => jdo v koi new todo add kita taa o v neeche show ho jave

    // emptyState.classList.add("hidden");
})

function renderTodo() {
    todoList.innerHTML = ""     //jdo koi new todo add krna to o neeche aa jave te pishle todos fer dbaar to na likhe jan sirf new todo hi likhya jave te add jave pishle todos de neeche
    //  or 
    // todoList.textContent = ""


    todos.forEach((todo) => {
        const li = document.createElement("li");

        // li.setAttribute("class" , "flex gap-2 border border-slate-300 p-4 rounded-xl")
        // or
        li.className = "flex items-start gap-3 border border-slate-200/10 p-4 rounded-xl min-w-0" // li nu class deke ode vich tailwind CSS properties laa ditiya

        // li.setAttribute("data-id", todo.id) // this is jugad
        // or
        li.dataset.id = todo.id // this is original method      //  dataset for kisi bhi element ko extra info dene ke liye

        li.innerHTML = `
                    <div class="flex items-start gap-3 min-w-0 flex-1">
                        <input data-action="toogle" ${todo.isCompleted ? "checked" : ""} type="checkbox" class="mt-2 shrink-0 accent-purple-500 cursor-pointer" >
                        <p class="flex-1  break-words min-w-0 pr-1 text-purple-400 font-semibold ${todo.isCompleted ? "line-through text-slate-400" : ""}">${todo.text}</p>
                    </div>
                    <div class="flex items-center gap-3 shrink-0">
                        <div class="flex items-center">
                        
                            <!-- click div -->
                            <div class="relative group cursor-pointer flex items-center justify-center" onclick="this.querySelector('.my-time-box').classList.toggle('opacity-100'); event.stopPropagation();">
            
                                <!-- Time Box -->
                                <div class="my-time-box absolute bottom-full mb-2 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 bg-slate-800 border border-white/10 text-white text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap transition-opacity duration-200 z-50">
                                    ${todo.time || 'Just now'}
                                </div>

                                <!-- Clock Icon -->
                                <div class="w-3.5 h-3.5 border-2 border-slate-400 rounded-full relative hover:border-slate-300 transition-colors flex items-center justify-center">
                                    
                                    <!-- Clock ki choti sui -->
                                    <span class="absolute w-[2px] h-[4px] bg-slate-400 top-[1px] left-[4px] rounded-full"></span>
                
                                    <!-- Clock ki badi sui -->
                                    <span class="absolute w-[4px] h-[2px] bg-slate-400 top-[4px] left-[4px] rounded-full"></span>
                                </div>
            
                            </div>

                        </div>
                        <div class="flex gap-2">
                            <button data-action="edit" class="text-[11px] font-600 px-3 py-1 rounded-lg bg-white/[0.04] hover:bg-white/10 border border-white/5 hover:border-white/10 text-slate-300 transition-all cursor-pointer">Edit</button>
                            <button data-action="delete" class="text-[11px] font-600 px-3 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 transition-all cursor-pointer">Delete</button>
                        </div>
                    </div>`


        todoList.append(li) // here we want exact/valid html code  / ul vich li append kr diti
    })

    taskCount.textContent = `TASKS (${todos.length})`
    completeCount.textContent = `COMPLETED: ${todos.filter((todo) => todo.isCompleted).length}`


    // emptyState.classList.remove("hidden");  // j koi v todo na likhya hove taa a vali line show hoje remove cls hidden krke

    if (todos.length === 0) {
        // Agar array khali hai to text set karo aur hidden class hata do
        emptyState.textContent = "No tasks found... add your task";
        emptyState.classList.remove("hidden");
    } else {
        // Agar list me kam se kam 1 item bhi hai, to line ko chupa do aur text empty kar do
        emptyState.textContent = "";
        emptyState.classList.add("hidden");
    }
}

renderTodo() // jab first time file execute hogi tab existing todos render ho jayenge

// screen te kite v touch krn te tym nu bnd krn lyi
document.addEventListener('click', (e) => {
    document.querySelectorAll('details[open]').forEach(el => {
        // j clock icon te click na hoye taa tym bnd krd lyi
        if (!el.contains(e.target)) {
            el.removeAttribute('open');
        }
    });
});

// DELETE / EDIT---------------------------------------------
// event delegation
todoList.addEventListener('click', (e) => {
    e.stopPropagation()

    // console.log(e.target); // e.target -> jis element per click krte ho
    // console.log(e.currentTarget); // e.currentTarget -> jis element per event listener attached hai => parent pr

    // console.log(e.target.parentElement); //not good ..closest good

    const li = e.target.closest('li') // यह कोड उस बटन के सबसे पास वाले <li> को पकड़ता है     => jerhi pehla todo nu unique id milgi o hn ede vich aa jani automatically
    const id = li.dataset.id; // यह लाइन उस <li> के माथे पर लिखे "data-id" की वैल्यू को खींच लेती है  //id milgi

    let action = e.target.dataset.action       // dataset.action nl buttons da pta lgna p kerhe button te click kr rhe

    if (action === "delete") {
        deleteTodo(id)
    }

    if (action === "edit") {
        startEdit(id)
    }

    if (action === "toogle") {                  // checbox vala part
        todos = todos.map((todo) => {
            if (todo.id === Number(id)) {
                return {
                    ...todo,
                    isCompleted: !todo.isCompleted      // !todo.isComplted => means isCompleted da ulta kr dena => means j true te false kr dena ....te j false aa te true kr dena
                }
            }
            return todo
        })
        localStorage.setItem("todos", JSON.stringify(todos));
        renderTodo()
        emptyState.classList.add("hidden");
    }
})

function deleteTodo(id) {
    todos = todos.filter((todo) => {            // filter => delete da km krega  / .filter() ka rule => a function sirf ohi items nu bchake rkhda a..jinna lyi condition true hundi a ,jerhi item lyi condition false hoyegi ...o list to bahr ho jayega
        if (todo.id !== Number(id)) {             // यानी: 1718874500000 !== 1718874500000 => id nl id match ese lyi dlt  // je id nl id nhi match click krn te fr o safe rhega ....mtlb condition true hogyi fr o andr ayega ...te retun todo kr dvega..means array vich item rhegi...j condition false hogi fr o andr nhi ayega te return todo nhi hoyega te fr o item new lst to delete hojegi
            return todo                           
        }
    })
    localStorage.setItem("todos", JSON.stringify(todos));
    renderTodo()
    // emptyState.classList.add("hidden");
}

function startEdit(id) {
    editTodoId = id;

    let currentTodo = todos.find((todo) => {
        if (todo.id === Number(id)) {
            return todo
        }
    })

    todoInput.value = currentTodo.text
    formBtn.textContent = "Update"
    formBtn.className =
        "px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors cursor-pointer";

    cancelBtn.classList.remove("hidden");
}

function cancelEdit() {
    editTodoId = null;

    todoInput.value = "";

    formBtn.textContent = "Add";

    formBtn.className =
        "px-5 py-2 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-lg transition-colors cursor-pointer";

    cancelBtn.classList.add("hidden");
}


cancelBtn.addEventListener("click", () => {
    cancelEdit();
});
