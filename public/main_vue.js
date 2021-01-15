import App from './components/App.js';


const store = new Vuex.Store({
    state: {
        product:`Meet-Free` ,
       description:'Free Video-conferencing App',
       connectedList : [],
       infoBarMessage:"  "
       
    },
    getters: {
        connected:(state) => {
            return state.connectedList;
        },
        connectedContainsId: function(state) {
            // return a function so we can provide our own parameter
            return function(id){
            
                return state.connectedList.some( connectedItem => {
                    return connectedItem.id === id;
               } );

            };
        },

    },
    mutations: {
        addConnected (state, connectedItem) {
           console.log(`adding id ${connectedItem.id} to store`);
           state.connectedList.push(connectedItem);
           state.infoBarMessage = `User ${connectedItem.id} has joined`;
        },
        updateConnected (state, connectedItem) {
           
            // update a stream for a userId
            const existingConnection = state.connectedList.find( item => {
                return item.id === connectedItem.id;
           } );
           if (existingConnection){
               console.log(`updating id ${connectedItem.id} to store`);
               existingConnection.stream = connectedItem.stream;
           }
           else {
            console.log(`Could not find/update id ${connectedItem.id} in store`);
           }

         },
         deleteConnected (state, userId) {
            const foundIndex = state.connectedList.findIndex( item => {
                return item.id === userId;
            });
            if ( foundIndex > -1){
                // remove 1 item from the array at the given index
                state.connectedList.splice(foundIndex,1);
                console.log(`Deleted id ${userId} in store`);
                state.infoBarMessage = `User ${userId.id} has left`;
            } 
            else {
                console.log(`Could not find/delete id ${userId} in store`);
            }
         }
         
      },
    
    actions : {
        addConnection(context, connectedItem) {
            context.commit('addConnected', connectedItem);
       },
       updateConnection(context, connectedItem) {
        context.commit('updateConnected', connectedItem);
       },
       deleteConnection(context, userId) {
        context.commit('deleteConnected', userId);
       },
    }

});

new Vue({
    store,
    render: h => h(App),
}).$mount(`#app`);
