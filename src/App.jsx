import React from 'react';
import './App.css';
import InputField from './components/InputField';
import TodoList from './components/TodoList';
import { useDispatch, useSelector } from 'react-redux';
import { addTodo, fetchTodos } from './store/todoSlice';


function App() {
  const [title, setText] = React.useState('');
  const { status, error } = useSelector(state => state.todos)
  const dispatch = useDispatch();

  const addTask = () => {
    if (title.trim().length) {
      dispatch(addTodo({ title }));
      setText('');
    }
  }

  React.useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  return (
    <div className="App">
      <InputField text={title}
        handleInput={setText}
        handleSubmit={addTask}
      />
      {status === 'loading' && <h2>Loading...</h2>}
      {error && <h2>error occured: {error}</h2>}
      <TodoList />
    </div>
  );
}

export default App;
