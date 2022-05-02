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

const todoSlice = createSlice({
    name: 'todos',
    initialState: {
        todos: [],
        status: null,
        error: null,
    },
    reducers: {
        addTodo(state, action) {
            state.todos.push({
                id: new Date().toISOString(),
                title: action.payload.title,
                completed: false,
            })
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
        [fetchTodos.rejected]: (state, action) => {
            state.status = 'rejected';
            console.log(state.status);
            state.error = action.payload;
        },
    }
});

export const { addTodo, removeTodo, toggleTodoComplete } = todoSlice.actions;

export default todoSlice.reducer;