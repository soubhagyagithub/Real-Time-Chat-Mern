import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./Features/store.js";
ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <Router>
      <Provider store={store}>
        <App />
      </Provider>
    </Router>
  </>
);
