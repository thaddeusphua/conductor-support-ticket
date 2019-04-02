import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, compose } from "redux";
import kanbanReducers from "./reducers/index";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import Auth from "./Auth";
import axios from "axios";

//calls the constructor in Auth.js but doesn't check authentication yet
// will be passed to state later
const auth = new Auth();

//original state is blank
let state = {};

// function definition
// updates the changes and re-renders the changed components
Window.setState = (changes, store) => {
  //updates the state via changes
  state = Object.assign({}, state, changes);
  //passes the state object to the App via the spread syntax

  ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter>
        <App {...state} />
      </BrowserRouter>
    </Provider>,
    document.getElementById("root")
  );
};

//do not remove the next line, it prevents errors
/* eslint no-restricted-globals: 0*/
let appInitialState = {
  name: auth.getProfile().name,
  location: location.pathname.replace(/^\/?|\/$/g, ""),
  //if it still doesn't work change location to window.location
  auth
};

axios.get("http://localhost:4000/ticket/getall").then(response => {
  console.log(response);
  const initialState = {
    domainData: {
      lists: {
        byId: {
          "0": {
            id: "0",
            name: "Todo"
          },
          "1": {
            name: "In Progress",
            id: "1"
          },
          "2": {
            id: "2",
            name: "Done"
          }
        },
        allLists: ["0", "1", "2"]
      },
      cards: {
        // intending to replace as
        // byId: cardsById
        byId: {
          "0": {
            id: "0",
            title: "TODO 1",
            description: "Description",
            tasks: ["0"]
          }
        }
      },
      tasks: {
        byId: {
          "0": {
            id: "0",
            name: "Click to edit or delete",
            done: true
          }
        }
      }
    },
    kanbanState: {
      listCards: { "0": ["0"], "1": [], "2": [] },
      selectedCard: "ID_OF_CARD_IN_FOCUS",
      itemToEdit: "ID_OF_LIST_CARD_TASK_TO_EDIT",
      attributeToEdit: "EXAMPLE:_TITLE_DESCRIPTION_NEWLIST"
    },
    uiState: {
      cardMenuPosition: {},
      shouldShowCardMenu: false
    }
  };

  let store = createStore(
    kanbanReducers,
    initialState,
    compose(
      window.__REDUX_DEVTOOLS_EXTENSION__ &&
        window.__REDUX_DEVTOOLS_EXTENSION__() // for browser extension: redux devtool
    )
  );

  Window.setState(appInitialState, store);
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();