import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { AppProvider } from "./contexts.js/appContext";
import { PostsProvider } from "./contexts.js/postsContext";
import Home from "./views/home/home";
import ErrorBoundary from "./ErrorBoundary";
import { LoginPanel } from "./views/login/LoginPanel";

const App = () => {
  return (
    <ErrorBoundary>
      <Router>
        <AppProvider>
          <PostsProvider>
            <div className="App flex">
              <LoginPanel />
              <Home />
            </div>
          </PostsProvider>
        </AppProvider>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
