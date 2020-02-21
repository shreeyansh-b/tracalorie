//storage controller

const StorageCtrl = (function(){
    return{
        storeItem: function(item){
            let items;
            //check if null

            if(localStorage.getItem('items') === null){
                items = [];
                items.push(item);
                localStorage.setItem('items', JSON.stringify(items));
                //console.log("first");
            }else{
                items = JSON.parse(localStorage.getItem('items'));
                items.push(item);
                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        getItemsFromStorage: function(){
            let items;
            if(localStorage.getItem('items') === null){
                items = [];
            }else{
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },
        updateItemsStorage: function(updatedItem){
            let items;
            items = JSON.parse(localStorage.getItem('items'));
            items.forEach(function(item){
                if(item.id === ItemCtrl.getCurrentItem().id){
                    item.name = updatedItem.name;
                    item.calories = updatedItem.calories;
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItemsStorage: function(deleteId){
            let items;
            items = JSON.parse(localStorage.getItem('items'));
            items.forEach(function(item, index){
                if(item.id === deleteId){
                    items.splice(index, 1);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        clearAllStorage: function(){
            localStorage.removeItem('items');
        }
    }
})();


//item controller


const ItemCtrl = (function(){

    const Item = function(id, name, calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    const data = {
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
    };

    return{
        addItem: function(name, calories){
            //ID generation
            let id;
            if(data.items.length >0){
                id = (data.items[data.items.length -1].id + 1);
            }else{
                //ID=0
                id = 0;
            }
            calories = parseInt(calories);
            const newItem = new Item(id, name, calories);

            data.items.push(newItem);
            return newItem;
        },
        updateItem: function(name, calories){
            calories = parseInt(calories);
            let found = null;
            data.items.forEach(function(item){
                if(item.id === data.currentItem.id){
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;
        },
        deleteItem: function(id){
            const ids = data.items.map(function(item){
                return item.id
            });
            const index = ids.indexOf(id);
            
            data.items.splice(index, 1);
        },
        clearDS: function(){
            data.items = [];
        },
        getItems: function(){
            return data.items;
        },
        getTotalCalories: function(){
            let total = 0;
            data.items.forEach(function(item){
                total += item.calories;
            });
            data.totalCalories = total;
            return data.totalCalories;
        },
        getItemById: function(id){
            let found;
            data.items.forEach(function(item){
                if(item.id === id){
                    found = item;
                }
            });
            return found;
        },
        setCurrentItem: function(item){
            data.currentItem = item;
        },
        getCurrentItem: function(){
            return data.currentItem;
        },
        logData: function(){
            return data;
        }
    }

})();


//UI controller


const UICtrl = (function(){
    const UISelectors = {
        itemList: "#item-list",
        addBtn: ".add-btn",
        listItems: "#item-list li",
        updateBtn: ".update-btn",
        deleteBtn: ".delete-btn",
        backBtn: ".back-btn",
        clearBtn: ".clear-btn",
        itemName: "#item-name",
        itemCalories: "#item-calories",
        totalCalories: ".total-calories"
    }

    return{
        populateItemList: function(items){
            let html = "";

            items.forEach(function(item){
                html += `<li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                  <i class="edit-item fa fa-pencil"></i>
                </a>
              </li>`;
            });

            document.querySelector(UISelectors.itemList).innerHTML = html;

        },
        getSelectors: function(){
            return UISelectors;
        },
        getItemInput: function(){
            return{
                name: document.querySelector(UISelectors.itemName).value,
                calories: document.querySelector(UISelectors.itemCalories).value
            }
        },
        putItem: function(item){
            document.querySelector(UISelectors.itemList).style.display = "block";
            const li = document.createElement("li");
            li.classList = "collection-item";
            li.id = `item-${item.id}`;

            li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>`;
            document.querySelector(UISelectors.itemList).insertAdjacentElement("beforeend", li);
        },
        updateItem: function(item){
            let listItems = document.querySelectorAll(UISelectors.listItems);
            //converting node list to array
            listItems = Array.from(listItems);
            
            listItems.forEach(function(listItem){
                const listid = listItem.getAttribute('id');
                if(listid === `item-${item.id}`){
                    document.querySelector(`#${listid}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                      <i class="edit-item fa fa-pencil"></i>
                    </a>`
                }

            });
        },
        deleteItem: function(id){
            const listId = `#item-${id}`;
            const UIItem = document.querySelector(listId);
            UIItem.remove();
        },
        addItemToForm: function(){
            document.querySelector(UISelectors.itemName).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCalories).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.setEditState();
        },
        putTotalCalories: function(totalCalories){
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        clearFields: function(){
            document.querySelector(UISelectors.itemName).value = "";
            document.querySelector(UISelectors.itemCalories).value = "";
        },
        clearList: function(){
            let listItem = document.querySelectorAll(UISelectors.listItems);
            listItem = Array.from(listItem);
            listItem.forEach(function(item){
                item.remove();
            });
        },
        clearEditState: function(){
            UICtrl.clearFields();
            document.querySelector(UISelectors.updateBtn).style.display = "none";
            document.querySelector(UISelectors.deleteBtn).style.display = "none";
            document.querySelector(UISelectors.backBtn).style.display = "none";
            document.querySelector(UISelectors.addBtn).style.display = "inline-block";
        },
        setEditState: function(){
            document.querySelector(UISelectors.updateBtn).style.display = "inline-block";
            document.querySelector(UISelectors.deleteBtn).style.display = "inline-block";
            document.querySelector(UISelectors.backBtn).style.display = "inline-block";
            document.querySelector(UISelectors.addBtn).style.display = "none";
        },
        hidelist: function(){
            document.querySelector(UISelectors.itemList).style.display = "none";
        }
    }

})();


//app controller

const App = (function(ItemCtrl, StorageCtrl, UICtrl){

    const loadEventListeners = function(){
        const UISelectors = UICtrl.getSelectors();

        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        //prevent enter key

        document.addEventListener('keydown', function(e){
            if(e.keyCode === 13 || e.which === 13){
                e.preventDefault();
                return false;
            }
        });

        //edit
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

        //update

        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemSubmitClick);

        //backbutton

        document.querySelector(UISelectors.backBtn).addEventListener('click', function(e){
            UICtrl.clearFields();
            document.querySelector(UISelectors.updateBtn).style.display = "none";
            document.querySelector(UISelectors.deleteBtn).style.display = "none";
            document.querySelector(UISelectors.backBtn).style.display = "none";
            document.querySelector(UISelectors.addBtn).style.display = "inline-block";
            e.preventDefault();
        });

        //delete
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

        //clear
        document.querySelector(UISelectors.clearBtn).addEventListener('click', itemClearClick);
        
    }

    const itemAddSubmit = function(e){
        //get form input from uictrl

        const input = UICtrl.getItemInput();
        //console.log(input);
        //check for empty

        if(input.name !== '' && input.calories !== ''){
            const newItem = ItemCtrl.addItem(input.name, input.calories);
            UICtrl.putItem(newItem);
            StorageCtrl.storeItem(newItem);
            UICtrl.clearFields();
            const totalCalories = ItemCtrl.getTotalCalories();
            UICtrl.putTotalCalories(totalCalories);
        }
        e.preventDefault();
    }
    const itemEditClick = function(e){
        if(e.target.classList.contains("edit-item")){
            //console.log(e.target.parentNode.parentNode);
            const listId = e.target.parentNode.parentNode.id;
            const splited = listId.split("-");
            //console.log(splited);
            //get id
            const id = parseInt(splited[1]);
            //console.log(id);
            const itemToEdit = ItemCtrl.getItemById(id);
            ItemCtrl.setCurrentItem(itemToEdit);
            UICtrl.addItemToForm();
        }
        e.preventDefault();
    }
    const itemSubmitClick = function(e){
        //get from form
        const updatedItem = UICtrl.getItemInput();
        //add to DS
        const UIItem = ItemCtrl.updateItem(updatedItem.name, updatedItem.calories);


        //update UI
        UICtrl.updateItem(UIItem);
        StorageCtrl.updateItemsStorage(UIItem);
        UICtrl.clearEditState();


        e.preventDefault();
    }
    const itemDeleteSubmit = function(e){
        //get curr item
        const currentItem = ItemCtrl.getCurrentItem();
        ItemCtrl.deleteItem(currentItem.id);

        //del from ui

        UICtrl.deleteItem(currentItem.id);
        StorageCtrl.deleteItemsStorage(currentItem.id);
        UICtrl.clearEditState();

        const totalCalories = ItemCtrl.getTotalCalories();
        UICtrl.putTotalCalories(totalCalories);

        e.preventDefault();
    }
    const itemClearClick = function(e){
        //del from DS
        ItemCtrl.clearDS();

        //del from UI
        UICtrl.clearList();

        StorageCtrl.clearAllStorage();

        const totalCalories = ItemCtrl.getTotalCalories();
        UICtrl.putTotalCalories(totalCalories);

        UICtrl.hidelist();

        e.preventDefault();
    }

    return{
        init: function(){
            UICtrl.clearEditState();
            const items = ItemCtrl.getItems();

            if(items.length === 0){
                UICtrl.hidelist();
            }else{
                UICtrl.populateItemList(items);
            }

            const totalCalories = ItemCtrl.getTotalCalories();
            UICtrl.putTotalCalories(totalCalories);

            loadEventListeners();
        }
    }

})(ItemCtrl, StorageCtrl, UICtrl);

App.init();
