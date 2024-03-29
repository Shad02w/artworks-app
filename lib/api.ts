import { $fetch } from "./$fetch"

const API_BASE = "https://api.artic.edu/api/v1"

export interface Pagination {
    total: number
    limit: number
    offset: number
    total_pages: number
    current_page: number
    next_url: string
}

export interface Thumbnail {
    lqip: string
    width: number
    height: number
    alt_text?: string
}

export interface GetArtworkResponse {
    data: {
        id: number
        title: string
        artist_display: string
        date_display: string
        main_reference_number: string
        dimensions: string
        thumbnail: Thumbnail | null
        image_id: string | null
    }
}

export async function fetchArtwork(id: string): Promise<GetArtworkResponse> {
    return $fetch(
        `${API_BASE}/artworks/${id}?fields=id,title,image_id,artist_display,date_display,main_reference_number,dimensions,thumbnail`
    )
}

export interface SearchArtworksRequest {
    page?: number
    title?: string
    categoryTerms?: Record<string, string[]>
}

export interface SearchArtworksResponse {
    pagination: Pagination
    data: Array<{
        id: number
        title: string
        thumbnail: Thumbnail | null
        image_id: string | null
    }>
}

export async function fetchArtworks({ title, page = 1, categoryTerms }: SearchArtworksRequest): Promise<SearchArtworksResponse> {
    const must: any[] = []
    const query = {
        query: {
            bool: {
                must
            }
        }
    }

    if (title) {
        must.push({
            match: {
                title
            }
        })
    }

    for (const [key, value] of Object.entries(categoryTerms ?? {})) {
        if (value.length > 0) {
            must.push({
                terms: {
                    [key + "_ids"]: value
                }
            })
        }
    }

    const params = `&params=${encodeURIComponent(JSON.stringify(query))}`
    return $fetch(`${API_BASE}/artworks/search?fields=id,image_id,title,thumbnail&from=${(page - 1) * 20}&size=20&${params}`)
}

export interface Category {
    id: string
    title: string
    subtype: CategorySubtype
}

export type CategorySubtype = "classification" | "material" | "technique" | "style" | "subject" | "department" | "theme"

interface BatchFetchCategoriesResponse {
    pagination: Pagination
    data: Category[]
}

export function batchFetchCategories(ids: string[]): Promise<BatchFetchCategoriesResponse> {
    return $fetch(`${API_BASE}/category-terms?ids=${ids.join(",")}&fields=id,title,subtype`)
}

export interface SearchCategoryTermRequest {
    title?: string
}

export interface SearchCategoryTermResponse {
    pagination: Pagination
    data: Category[]
}

export async function searchCategoryTerm({ title }: SearchCategoryTermRequest): Promise<SearchCategoryTermResponse> {
    const param = title ? `&params=${encodeURIComponent(JSON.stringify({ query: { match: { title } } }))}` : ""

    return $fetch(`${API_BASE}/category-terms/search?fields=id,title,subtype&size=10${param}`)
}
