// Storage Controller


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
    items:[
        // {id: 0, name: 'Steak dinner', calories: 1200},
        // {id: 1, name: 'Cookie', calories: 400},
        // {id: 2, name: 'Egg', calories: 300}
    ],
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
        backBtn:'.back-btn'
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
        }
})();


// App Controller
const App = (function(ItemCtrl, UICtrl){
    // Load Event Listeners
    const loadEventListerners = function(){
    
    // Get UI selectors
    const UISelectors = UICtrl.getSelectors();

    // Add item events
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

    // Edit icon click event

    document.querySelector(UISelectors.itemList).addEventListener('click', itemUpdateSubmit);
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

        // Clear fields
        UICtrl.clearInput();
        }
        
        e.preventDefault();
    }

    // Update item submit
    const itemUpdateSubmit = function(e) {
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

})(ItemCtrl, UICtrl);

// Initialis App

App.init();