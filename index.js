
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
        li.className = "flex gap-2 border border-slate-300 p-4 rounded-xl" // li nu class deke ode vich tailwind CSS properties laa ditiya

        // li.setAttribute("data-id", todo.id) // this is jugad
        // or
        li.dataset.id = todo.id // this is original method      //  dataset for kisi bhi element ko extra info dene ke liye

        li.innerHTML = `
                    <input data-action="toogle" ${todo.isCompleted ? "checked" : ""} type="checkbox" class=" accent-pink-500 cursor-pointer" >
                    <p class="flex-1 ${todo.isCompleted ? "line-through text-slate-400" : ""}">${todo.text}</p>
                    <div class="flex mt-1">


                    <!-- Yeh pura div ek clock icon bna diya -->
                    <div 
                    title="${todo.time || 'Just now'}" 
                    class="w-3.5 h-3.5 border-2 border-slate-400 rounded-full relative cursor-pointer hover:border-slate-500 transition-colors flex items-center justify-center">

                    <!-- Clock ki choti sui (Hour hand) -->
                    <span class="absolute w-[2px] h-[4px] bg-slate-400 top-[2px] left-[4px] rounded-full  "></span>

                    <!-- Clock ki badi sui (Minute hand) -->
                    <span class="absolute w-[5px] h-[2px] bg-slate-400 top-[5px] left-[4px] rounded-full"></span>
                    </div>


                    </div>
                    <div class="flex gap-2">
                     <button data-action="edit" class="border border-green-500 bg-green-100 text-green-500 px-4 p-1 rounded-sm text-xs   transition-all duration-300 ease-in-out hover:bg-green-500 hover:text-white hover:scale-105 hover:shadow-[0_0_15px_rgba(34,197,94,0.8)]">Edit</button>
                        <button data-action="delete" class="border border-red-500 bg-red-100 text-red-500 px-4 p-1 rounded-sm text-xs  transition-all duration-300 ease-in-out hover:bg-red-500 hover:text-white hover:scale-105 hover:shadow-[0_0_15px_rgba(239,68,68,0.7)]" >Delete</button>
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
