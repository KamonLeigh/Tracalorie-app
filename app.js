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
    }
}
})();

// UI Controller
const UICtrl = (function(){
    const UISelectors = {
        itemList: '#item-list',
        addBtn: '.add-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput:'#item-calories'
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
            }
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
        
        // Clear fields
        UICtrl.clearInput();
        }
        
        e.preventDefault();
    }

    // Public methods
    return{
        init: function(){
            console.log('Initialiing app');

            // Fetch items from data structure
            const items = ItemCtrl.getItems();

            // Check if any items

            if(items.length === 0){
                UICtrl.hideList()

            } else {
              // Populate list with items
            UICtrl.populateItemList(items)
            }
            
            

            //LoadEventListeners
            loadEventListerners();
        }
    }

})(ItemCtrl, UICtrl);

// Initialis App

App.init();