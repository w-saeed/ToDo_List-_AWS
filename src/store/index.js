// store/index.js

import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: {
            username: '',
            email: ''
        },
        serverUri: "http://todoLB-1137477303.us-east-1.elb.amazonaws.com/WaleedUndMulham/ToDoList/",
        loggedin: false,
    },
    getters: {},
    mutations: {
        changeUsername(state, username) {
            state.user.username = username
        },
        changeEmail(state, email) {
            state.user.email = email
        },
        authenticated(state, isAuthenticated) {
            state.loggedin = isAuthenticated
        },

    },
    actions: {}
});