import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchTodos = createAsyncThunk(
    'todos/fetchTodos',
    async function (_, { rejectWithValue }) {
        try {
            //main element
            const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=10');
            console.log(response) //method .ok inside response
            if (!response.ok) {
                throw new Error('Server Error!!!');
            }
            const data = await response.json();
            return data; //main element, other`s need only for discription error that can apear
        }
        catch (error) {
            return rejectWithValue(error.message);
        }

    }
);

export const fetchDeleteTodo = createAsyncThunk(
    'todos/fetchDeleteTodo',
    async function (id, { rejectWithValue, dispatch }) {
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Server Error: Cant Delete Task!!!');
            }
            dispatch(removeTodo({ id }));
        }
        catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const toggleStatus = createAsyncThunk(
    'todos/toggleStatus',
    async function (id, { rejectWithValue, dispatch, getState }) {
        const todo = getState().todos.todos.find(todo => todo.id === id);
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    completed: !todo.completed,
                })
            });
            if (!response.ok) {
                throw new Error('Server Error: Cant Complite Task!!!');
            }
            const data = await response.json();
            console.log(data);
            dispatch(toggleTodoComplete({ id }))

        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
);

export const addNewTodo = createAsyncThunk(
    'todos/addNewTodo',
    async function (title, { rejectWithValue, dispatch }) {
        try {
            const todo = {
                title: title,
                userId: 1,
                completed: false,
            };

            const response = await fetch('https://jsonplaceholder.typicode.com/todos/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(todo)
            });
            if (!response.ok) {
                throw new Error('Server Error: Cant Added Task!!!');
            }
            const data = await response.json();
            dispatch(addTodo(data))
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const setError = (state, action) => {
    state.status = 'rejected';
    console.log(state.status);
    state.error = action.payload;
}
const todoSlice = createSlice({
    name: 'todos',
    initialState: {
        todos: [],
        status: null,
        error: null,
    },
    reducers: {
        addTodo(state, action) {
            state.todos.push(action.payload)
        },
        removeTodo(state, action) {
            state.todos = state.todos.filter(todo => todo.id !== action.payload.id)
        },
        toggleTodoComplete(state, action) {
            const toggledTodo = state.todos.find(todo => todo.id === action.payload.id);
            toggledTodo.completed = !toggledTodo.completed;
        },
    },
    extraReducers: {
        [fetchTodos.pending]: (state, action) => {
            state.status = 'loading';
            console.log(state.status);
            state.error = null;
        },
        [fetchTodos.fulfilled]: (state, action) => {
            state.status = 'resolved';
            console.log(state.status);
            state.error = null;
            state.todos = action.payload;
        },
        [fetchTodos.rejected]: setError,
        [fetchDeleteTodo.rejected]: setError,
        [toggleStatus.rejected]: setError,
    }
});

const { addTodo, removeTodo, toggleTodoComplete } = todoSlice.actions;

export default todoSlice.reducer;