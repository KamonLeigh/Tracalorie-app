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
        {id: 0, name: 'Steak dinner', calories: 1200},
        {id: 1, name: 'Cookie', calories: 400},
        {id: 2, name: 'Egg', calories: 300}
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
    }
}
})();

// UI Controller
const UICtrl = (function(){
    const UISelectors = {
        itemList = '#item-list'
    }



        return {
            populateItemList:function(items){
                let html = '';
                items.forEach(function(item){
                    html += `<li class="collection-item" id="item-${item.id}">
                    <strong>${item.name}:</strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content"></a>
                    <i class="edit-items fa fa-pencil"></i>
                  </li>`
                });

                // insert list items
                document.querySelector(UISelectors.itemList).innerHTML = html;
            }
        }
})();


// App Controller
const App = (function(ItemCtrl, UICtrl){


    // Public methods
    return{
        init: function(){
            console.log('Initialiing app');

            // Fetch items from data structure
            const items = ItemCtrl.getItems();
            
            // Populate list with items
            UICtrl.populateItemList(items)
        }
    }

})(ItemCtrl, UICtrl);

// Initialis App

App.init();