import React, { useRef, useReducer } from 'react'

function App() {

    const inputRef = useRef<HTMLInputElement>(null)

    const handleSubmit = (e: any) => {
        e.preventDefault()
        inputRef.current?.value !== "" && dispatch({ type: 'ADD_TODO', payload: inputRef.current?.value })
        inputRef.current && (inputRef.current.value = "")
    }

    const [todo, dispatch] = useReducer((state: any, action: any): any => {
        switch (action.type) {
            case 'ADD_TODO':
                return [...state, { id: state.length, name: action.payload, isCheck: false }]
            case 'CHECK_TODO':
                return state.filter((item: any, index: any):any => {
                    if (index === action.id) {
                        item.isCheck = !item.isCheck
                    }
                    return item
                })
        }
    }, [])

    const todos = todo.map((item: any, index: number) => {
        return (
            <li key={index}>
                <input type="checkbox" checked={item.isCheck} onChange={() => dispatch({ type: "CHECK_TODO", id: index })} />
                {item.name}
            </li>
        )
    })

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Buy milk"
                    ref={inputRef}
                />
            </form>
            <ul>{todos}</ul>
        </div>
    )
}

export default App