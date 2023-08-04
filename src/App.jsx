import { Outlet, Link } from "react-router-dom";
import Header from "./components/common/header";
import { StoreProvider, createStore } from "easy-peasy";
import { model } from "./store-models/index";

const store = createStore(model);

const App = () => {
  return (
    <StoreProvider store={store}>
      <div className="d-flex justify-content-center align-items-stretch p-0 page-container">
        <Outlet />
      </div>
    </StoreProvider>
  );
};

export default App;
