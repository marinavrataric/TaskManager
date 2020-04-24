import React, { useRef, useReducer, useState } from 'react'

function App() {

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

    const todos = todo.map((item: any, index: number) => {
        return (
            <li key={index}>
                <input
                    type="checkbox"
                    checked={item.isCheck}
                    onChange={() => dispatch({ type: "CHECK_TODO", id: index })}
                />
                {item.name}
                <button onClick={() => handleEditing(index, item)}>/</button>
                <button onClick={() => dispatch({ type: 'DELETE_TODO', id: index })}>x</button>
            </li>
        )
    })

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder='Buy milk'
                    ref={inputRef}
                />
            </form>
            <button onClick={() => dispatch({ type: 'CLEAR_TODOS' })}>Clear</button>
            <button onClick={() => dispatch({ type: 'ON_OFF' })}>On/Off</button>
            <ul>{todos}</ul>
        </div>
    )
}

export default App