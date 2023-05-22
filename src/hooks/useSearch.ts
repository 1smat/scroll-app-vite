import {useEffect, useState} from 'react'
import axios, {CancelTokenSource} from 'axios'

interface Book {
    title: string
}

export interface BookSearchResult {
    loading: boolean
    error: boolean
    books: string[]
    hasMore: boolean
}

export default function useBookSearch(query: string, page: number): BookSearchResult {
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<boolean>(false)
    const [books, setBooks] = useState<string[]>([])
    const [hasMore, setHasMore] = useState<boolean>(false)

    const url = `https://openlibrary.org/search.json`

    useEffect(() => {
        setBooks([])
    }, [query])

    useEffect(() => {
        setLoading(true)
        setError(false)
        const cancel: CancelTokenSource | null = axios.CancelToken.source()

        axios.get(url, {
            params: {q: query, page},
            cancelToken: cancel?.token
        }).then(res => {
            setBooks((prevBooks: string[]) => {
                return [...new Set([...prevBooks, ...res.data.docs.map((book: Book) => book.title)])]
            })
            setHasMore(res.data.docs.length > 0)
            setLoading(false)
        }).catch(e => {
            if (axios.isCancel(e)) return
            setError(true)
        })

        return () => {
            cancel?.cancel()
        }
    }, [query, page])

    return {loading, error, books, hasMore}
}
