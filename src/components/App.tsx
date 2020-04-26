import React, { useRef, useReducer, useState } from 'react'

export default function App() {

    const inputRef = useRef<HTMLInputElement | any>(null)

    const handleSubmit = (e: any) => {
        e.preventDefault()
        if (inputRef.current?.value !== "") {
            dispatch({
                type: 'ADD_TODO',
                payload: inputRef.current?.value,
                id: editingIndex
            })
        }
        inputRef.current && (inputRef.current.value = "")
    }

    const [editingIndex, setEditingIndex] = useState<null | number>(null)

    const [todo, dispatch] = useReducer((state: any, action: any): any => {

        switch (action.type) {
            case 'ADD_TODO':
                setEditingIndex(null)
                const tempState = [...state]
                if (action.id) {
                    tempState[action.id] = { ...tempState[action.id], name: action.payload }
                }
                else {
                    tempState.push({
                        id: action.id | state.length,
                        name: action.payload,
                        isCheck: false,
                        toggleAll: false
                    })
                }
                return tempState
            case 'CHECK_TODO':
                return state.filter((item: any, index: any): any => {
                    if (index === action.id) {
                        item.isCheck = !item.isCheck
                    }
                    return item
                })
            case 'EDIT_TODO':
                inputRef.current.focus()
                inputRef.current.value = action.payload
                return state
            case 'DELETE_TODO':
                return state.filter((item: any, index: any) => index !== action.id)
            case 'CLEAR_TODOS':
                return []
            case 'ON_OFF':
                const newState = state.map((item: any) => {
                    item.toggleAll = !item.toggleAll
                    return item
                })
                return newState.map((item: any) => {
                    item.isCheck = item.toggleAll
                    return item
                })
            default:
                return state
        }
    }, [])

    const handleEditing = (index: number, item: { name: string }) => {
        setEditingIndex(index);
        dispatch({
            type: 'EDIT_TODO',
            id: index,
            payload: item.name
        })
    }

    const [selected, setSelected] = useState('all')

    const todos = todo.map((item: any, index: number) => {
        if (selected === 'active' && item.isCheck) return null
        if (selected === 'complete' && !item.isCheck) return null
        return (
            <li key={index}>
                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        checked={item.isCheck}
                        onChange={() => dispatch({ type: 'CHECK_TODO', id: index })}
                    />
                    <span className="checkbox-custom"></span>
                </label>
                <p {...item.isCheck ? { className: 'checked' } : { className: 'notChecked' }}>{item.name}</p>
                <button className="edit" onClick={() => handleEditing(index, item)}><i className="fa fa-pencil"></i></button>
                <button className="delete" onClick={() => dispatch({ type: 'DELETE_TODO', id: index })}><i className="fa fa-trash"></i></button>
            </li>
        )
    })

    return (
        <div className="App">
            <h1>Task Manager</h1>
            <p className="num-todo">You have {todo.length} {todo.length > 1 ? 'todos' : 'todo'}</p>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder='Buy milk'
                    ref={inputRef}
                    className="input-text"
                /> 
            </form>
            <button className="btn" onClick={() => dispatch({ type: 'CLEAR_TODOS' })}>Clear all</button>
            <button className="btn" onClick={() => dispatch({ type: 'ON_OFF' })}>Check On/Off</button>

            <select value={selected} onChange={(e: any) => setSelected(e.target.value)} className="select">
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="complete">Completed</option>
            </select>
            <ul>{todos}</ul>
        </div>
    )
}