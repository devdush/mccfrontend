import logo from "./logo.svg";
import "./App.css";
import { LoginUser } from "./store/action/auth";
import { useDispatch } from "react-redux";

function App() {
  const dispatch = useDispatch();
  const onButtonClick = () => {
    console.log("Button clicked");
    const obj = {
      email: "haritha2@gmail.com",
      password: "12345",
    };
    dispatch(LoginUser(obj));
  };
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button onClick={onButtonClick}>Click me</button>
      </header>
    </div>
  );
}

export default App;
