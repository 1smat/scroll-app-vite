import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import {useState, useRef, useCallback, ChangeEvent} from 'react'
import useBookSearch, {BookSearchResult} from './hooks/useSearch'

export default function App(): JSX.Element {
    const [query, setQuery] = useState<string>('')
    const [pageNumber, setPageNumber] = useState<number>(1)

    const {
        books,
        hasMore,
        loading,
        error
    }: BookSearchResult = useBookSearch(query, pageNumber)

    const observer = useRef<IntersectionObserver>()
    const lastBookElementRef = useCallback(
        (node: HTMLDivElement) => {
            if (loading) return
            if (observer.current) observer.current.disconnect()
            observer.current = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting && hasMore) {
                    setPageNumber(prevPageNumber => prevPageNumber + 1)
                }
            })
            if (node) observer.current.observe(node)
        },
        [loading, hasMore]
    )

    function handleSearch(e: ChangeEvent<HTMLInputElement>): void {
        setQuery(e.target.value)
        setPageNumber(1)
    }

    return (
        <>
            <div>
                <a href="https://vitejs.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo"/>
                </a>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo"/>
                </a>
            </div>
            <h1>Vite + React</h1>
            <p className="read-the-docs">
                Type anything to start and wait... :)
            </p>

            <input type="text" value={query} onChange={handleSearch}/>
            {books.map((book: string, index: number) => {
                if (books.length === index + 1) {
                    return (
                        <div className="title" ref={lastBookElementRef} key={book}>
                            {book}
                        </div>
                    )
                } else {
                    return <div className="title" key={book}>{book}</div>
                }
            })}
            {loading && <div className="loading">Loading...</div>}
            {error && <div>Error</div>}
        </>
    )
}
