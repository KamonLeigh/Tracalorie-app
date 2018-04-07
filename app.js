// Storage Controller
const StorageCtrl = (function(){


// Public methods
    return{
        storeItem: function(item){
            let items ;
            // Check if any items in local storage
            if(localStorage.getItem('items') === null){
            items = [];
            // Push new item
            items.push(item)
           
            // Set local storege
            localStorage.setItem('items', JSON.stringify(items))
            } else {
            
            items = JSON.parse(localStorage.getItem('items'));
            // Push new item  
            items.push(item);

            // Reset local stoarage
            localStorage.setItem('items', JSON.stringify(items))
            }
        },

        getItemsFromStorage: function(){
            let items;
            if(localStorage.getItem('items') === null){
                items = []
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },

        updateItemStorage:function(updtatedItem){
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item, index){
                if(updatedItem.id === item.id){
                    items.splice(index, 1, updatedItem)
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItemFromStorage:function(id){
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item, index){
                if(id === item.id){
                    items.splice(index, 1)
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },

        clearItemsFromStorage:function(){
            localStorage.removeItem('items');
        }


}
})();

// Item Controller
const ItemCtrl = (function(){
// Item Constructor

const Item = function(id, name, calories){
    this.id = id;
    this.name = name;
    this.calories = calories
}

// Data Structure / State

const data = {
    // items:[
    //     // {id: 0, name: 'Steak dinner', calories: 1200},
    //     // {id: 1, name: 'Cookie', calories: 400},
    //     // {id: 2, name: 'Egg', calories: 300}
    // ],
    items:StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
}

// Public Methods
return {
    logData: function(){
        return data;
    },

    getItems: function(){
        return data.items;
    },
    addItem: function(name, calories){
       let ID, item;
       
        // Create id
       if(data.items.length > 0){
        ID = data.items[data.items.length - 1].id + 1;
       } else {
           ID = 0
       }

       // Calories to number
       calories = parseInt(calories);

       // Create new item
       item = new Item(ID, name, calories);
       
       // Add to items array
       data.items.push(item);

       return item;
    },
    getTotalCalories:function(){
        let total = 0;


        // Loop through items and add cals
        data.items.forEach(function(item){
            total += item.calories;
        });


        // Set total cal in data structure
        data.totalCalories = total;

        // Return total
        return data.totalCalories;
    },
    getItembyId:function(id){
        let found = null;
        
        // Loop through items
        data.items.forEach(function(item){
            if(item.id === id){
                found = item
            }
        })
        return found;

    },
    setCurrentItem:function(item){
        data.currentItem = item;

    },
    getCurrentItem: function(){
        return data.currentItem
    },

    updateItem: function(name, calories){
        // Calories to number
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
        // Get ids

        const ids = data.items.map(function(item){
            return item.id;
        });

        // Get index;
        const index = ids.indexOf(id);

        // Remove item
        data.items.splice(index, 1);
    },

    clearAllItems: function(){
        data.items = [];
    }
}
})();

// UI Controller
const UICtrl = (function(){
    const UISelectors = {
        itemList: '#item-list',
        addBtn: '.add-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput:'#item-calories',
        totalCalories:'.total-calories',
        updateBtn:'.update-btn',
        deleteBtn:'.delete-btn',
        backBtn:'.back-btn',
        listItems:'#item-list li',
        clearBtn:'.clear-btn'
    }



        return {
            populateItemList:function(items){
                let html = '';
                items.forEach(function(item){
                    html += `<li class="collection-item" id="item-${item.id}">
                    <strong>${item.name}:</strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content"><i class="edit-items fa fa-pencil"></i></a>
                  </li>`
                });

                // insert list items
                document.querySelector(UISelectors.itemList).innerHTML = html;
            },
            getSelectors: function (){
                return UISelectors;
            },
            getItemInput:function(){
                return{
                    name: document.querySelector(UISelectors.itemNameInput).value,
                    calories: document.querySelector(UISelectors.itemCaloriesInput).value
                }
            },
            addListItem: function(item){
                // Shoe the list
                document.querySelector(UISelectors.itemList).style.display = 'block';
                // Create li element
                const li = document.createElement('li');
                // Add class
                li.className = 'collection-item';
                // Add ID
                li.id = `item-${item.id}`;
                //Add html
                li.innerHTML = `<strong>${item.name}:</strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                <i class="edit-items fa fa-pencil"></i>
                </a>`;

                //Insert item
                document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
            },
            clearInput: function(){
                document.querySelector(UISelectors.itemNameInput).value = '';
                document.querySelector(UISelectors.itemCaloriesInput).value = ''
            },
            hideList: function(){
                document.querySelector(UISelectors.itemList).style.display = 'none';
            },
            showTotalCalories:function(totalCalories){
                document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
            },
            clearEditState: function(){
                UICtrl.clearInput();
                document.querySelector(UISelectors.updateBtn).style.display = 'none';
                document.querySelector(UISelectors.deleteBtn).style.display = 'none';
                document.querySelector(UISelectors.backBtn).style.display = 'none';
                document.querySelector(UISelectors.addBtn).style.display = 'inline';

            },
            addItemToForm:function(){
                document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
                document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
                UICtrl.showEditState();
            },
            showEditState: function(){
                document.querySelector(UISelectors.updateBtn).style.display = 'inline';
                document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
                document.querySelector(UISelectors.backBtn).style.display = 'inline';
                document.querySelector(UISelectors.addBtn).style.display = 'none';

            },

            updateListItem: function(item){
                let listItems = document.querySelectorAll(UISelectors.listItems)

                // Turn Node list into array
                listItems = Array.from(listItems);

                listItems.forEach(function(listItem){
                    const itemID = listItem.getAttribute('id');

                    if(itemID === `item-${item.id}`) {
                        document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}:</strong> <em>${item.calories} Calories</em>
                        <a href="#" class="secondary-content">
                        <i class="edit-items fa fa-pencil"></i>
                        </a>`;
                    }
                })
            },
            deleteListItem: function(id){
                const itemID = `#item-${id}`;
                const item = document.querySelector(itemID);
                item.remove();
            },

            removeItems: function(){
                let listItems = document.querySelectorAll(UISelectors.listItems);

                // Turn Node list into an Array
                listItems = Array.from(listItems);

                listItems.forEach(function(item){
                    item.remove();
                })
            }

        }
})();


// App Controller
const App = (function(ItemCtrl, StorageCtrl, UICtrl){
    // Load Event Listeners
    const loadEventListerners = function(){
    
    // Get UI selectors
    const UISelectors = UICtrl.getSelectors();

    // Add item events
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
    
    // Disable submit on enter
    document.addEventListener('keypress', function(e){
        if(e.keycode === 13 || e.which === 13){
            e.preventDefault();
            return false;
        }
    });    


    // Edit icon click event
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

    // Update item event 
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);


    // Delete item event
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);


    // Back button event 
    document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

    // Clear items event
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);

    }

    // Add item submit
    const itemAddSubmit =  function(e){
        // Get form input from UI controller
        const input = UICtrl.getItemInput();
    
        // Check for name and calorie input
        if(input.name !=='' && input.calories !==''){
        // Add item
        const newItem = ItemCtrl.addItem(input.name, input.calories)  
  
        // Add Item to UI list
        UICtrl.addListItem(newItem);
        
         // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories()

        // Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        // Store item to local storage 
        StorageCtrl.storeItem(newItem);

        // Clear fields
        UICtrl.clearInput();
        }
        
        e.preventDefault();
    }

    // Clic  item submit
    const itemEditClick = function(e) {
        if(e.target.classList.contains('edit-items')){
            
            // Get list item id (item-0, item-1)
            const listId = e.target.parentNode.parentNode.id;
           
            // Break into an array
            const listIdArr = listId.split('-');

            // Get the actual id
            const id = parseInt(listIdArr[1]);

            // Get Item
            const itemToEdit = ItemCtrl.getItembyId(id);
           
            // Set current item
            ItemCtrl.setCurrentItem(itemToEdit);

            // Add item to form
            UICtrl.addItemToForm()


          
        }
        e.preventDefault()
    }

    // Update item submit 
    const itemUpdateSubmit = function(e) {
        // Get item input
        const input = UICtrl.getItemInput();

        // Update item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        // Update UI
        UICtrl.updateListItem(updatedItem);

         const totalCalories = ItemCtrl.getTotalCalories()
  
         // Add total calories to Ui
        UICtrl.showTotalCalories(totalCalories);

        // Update local storage

        StorageCtrl.updateItemStorage(updatedItem)

        UICtrl.clearEditState()

        e.preventDefault()
    }

        // Delete button event 

        const itemDeleteSubmit = function(e) {
        // Get current item
        const currentItem = ItemCtrl.getCurrentItem();

        //Delete form data structure
        ItemCtrl.deleteItem(currentItem.id);

        // Delete form UI
        UICtrl.deleteListItem(currentItem.id)


        
        const totalCalories = ItemCtrl.getTotalCalories()
  
        // Add total calories to Ui
       UICtrl.showTotalCalories(totalCalories);

       // Delete from local storage

       StorageCtrl.deleteItemFromStorage(currentItem.id);

       UICtrl.clearEditState()


        e.preventDefault();
        }

        // Clear items event
        const clearAllItemsClick = function(){
            // Delete all items from data structure
            ItemCtrl.clearAllItems();

          const totalCalories = ItemCtrl.getTotalCalories()
  
            // Add total calories to Ui
           UICtrl.showTotalCalories(totalCalories);


           // Remove all items from the UI
           UICtrl.removeItems();

           // Clear from localstorage
           StorageCtrl.clearItemsFromStorage();

           // Hide the UL

           UICtrl.hideList();
        }

    // Public methods
    return{
        init: function(){
            console.log('Initialiing app');
            // Clear edit state / set intial set
            UICtrl.clearEditState();

            // Fetch items from data structure
            const items = ItemCtrl.getItems();

            // Check if any items
            if(items.length === 0){
                UICtrl.hideList()

            } else {
              // Populate list with items
            UICtrl.populateItemList(items)
            }
            const totalCalories = ItemCtrl.getTotalCalories();
            UICtrl.showTotalCalories(totalCalories);

            //LoadEventListeners
            loadEventListerners();
        }
    }

})(ItemCtrl, StorageCtrl, UICtrl);

// Initialis App

App.init();