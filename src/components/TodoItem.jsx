import React from 'react';
import { useDispatch } from 'react-redux';
import { fetchDeleteTodo, toggleStatus } from '../store/todoSlice';


function TodoItem({ id, title, completed }) {
    const dispatch = useDispatch();


    return (
        <li>
            <input type="checkbox" checked={completed} onChange={() => dispatch(toggleStatus(id))} />
            <span>{title}</span>
            <span className='delete' onClick={() => dispatch(fetchDeleteTodo(id))}>&times;</span>
        </li>
    )
}

export default TodoItem