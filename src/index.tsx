import ReactDOM from "react-dom";
import "bulmaswatch/superhero/bulmaswatch.min.css";
import TextEditor from "./components/text-editor";

const App = () => {
  return (
    <div>
      <TextEditor />
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector("#root"));
