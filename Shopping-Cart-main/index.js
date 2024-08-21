import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
const appSettings = {
    databaseURL: "https://cart-28869-default-rtdb.asia-southeast1.firebasedatabase.app/",
}

//initiaizing and setting up firebase
const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppinglist")

//getting elements by their id's 
const item = document.getElementById("name");
const btn = document.getElementById("add-btn");
const shoppinglist = document.getElementById('list');

//function that adds the items to the list in real time
btn.addEventListener("click", function () {
    let name = item.value;

    if (name.trim() != "") { push(shoppingListInDB, name); }
    //console.log(name);
    clearField();
});

//function for adding data on screen on using enter key from keyboard
item.addEventListener('keypress', function (e) {
    if (e.key === "Enter") {
        btn.click()
    }
});

//gets the data from the database to display it on the page
onValue(shoppingListInDB, function (snapshot) {

    if (snapshot.exists()) {
        let itemArray = Object.entries(snapshot.val());
        clearList()

        for (let i = 0; i < itemArray.length; i++) {

            let currentItem = itemArray[i];

            let currentId = currentItem[0];
            let currentValue = currentItem[1];
            //console.log(itemArray[i]);
            addToList(currentItem)
        }
    }
    else {
        shoppinglist.innerHTML = "No item yet !!!"
    }
});

//clears the list
function clearList() {
    shoppinglist.innerHTML = ""
}

//clears the input field after item is added to list
function clearField() {
    item.value = "";
}

//adds an item to the database and displays it in the ul. Also deletes the item when clicked on it
function addToList(item) {
    // shoppinglist.innerHTML += `<li>${name}</li>`
    let itemId = item[0]
    let itemValue = item[1];

    let newEl = document.createElement("li");

    newEl.textContent = itemValue;
    shoppinglist.append(newEl);

    newEl.addEventListener('click', function () {
        let exactlocationItem = ref(database, `shoppinglist/${itemId}`);
        remove(exactlocationItem);

    });
}