let quit = false;
const todoList = [];

while (!quit) {
    const command = prompt("new / delete / list / quit");
    switch (command) {
        case "new": 
            const todo = prompt();
            todoList.push(todo);
            console.log(`added: ${todo}`);
            break;
        case "delete": 
            let index = parseInt(prompt());
            while (Number.isNaN(index)) {
                index = parseInt(prompt());
            }
            const deleted = todoList.splice(index, 1);
            console.log(`deleted: ${deleted}`);
            break;
        case "list": 
            console.log("*****");
            for (let i = 0; i < todoList.length; i++) {
                console.log(`${i}: ${todoList[i]}`);
            }
            console.log("*****");
            break;
        case "quit": 
            quit = true;
            break;
    }
}