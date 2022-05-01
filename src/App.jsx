import React from 'react';
import './App.css';
import InputField from './components/InputField';
import TodoList from './components/TodoList';
import { useDispatch } from 'react-redux';
import { addTodo } from './store/todoSlice';


function App() {
  const [text, setText] = React.useState('');
  const dispatch = useDispatch();

  const addTask = () => {
    if (text.trim().length) {
      dispatch(addTodo({ text }));
      setText('');
    }
  }

  return (
    <div className="App">
      <InputField text={text}
        handleInput={setText}
        handleSubmit={addTask}
      />
      <TodoList />
    </div>
  );
}

export default App;
