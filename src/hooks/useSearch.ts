import { useEffect, useState } from 'react'
import axios, { CancelTokenSource } from 'axios'

interface Book {
	title: string;
}

export interface BookSearchResult {
	loading: boolean;
	error: boolean;
	books: string[];
	hasMore: boolean;
}

export default function useBookSearch(query: string, pageNumber: number): BookSearchResult {
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<boolean>(false)
	const [books, setBooks] = useState<string[]>([])
	const [hasMore, setHasMore] = useState<boolean>(false)

	useEffect(() => {
		setBooks([])
	}, [query])

	useEffect(() => {
		setLoading(true)
		setError(false)
		let cancel: CancelTokenSource | null = axios.CancelToken.source()

		axios({
			method: 'GET',
			url: 'http://openlibrary.org/search.json',
			params: { q: query, page: pageNumber },
			cancelToken: cancel?.token
		}).then(res => {
			setBooks((prevBooks: string[]) => {
				return [...new Set([...prevBooks, ...res.data.docs.map((b: Book) => b.title)])]
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
	}, [query, pageNumber])

	return { loading, error, books, hasMore }
}
