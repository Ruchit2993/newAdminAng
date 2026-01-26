import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Category {
    id?: number;
    name: string;
    image?: string;
    status?: string | number; // Updated to match API response type which returns number, though we send string '1'/'0'
}

interface ApiResponse {
    success: boolean;
    message: string;
    data: Category[];
}

interface SingleApiResponse {
    success: boolean;
    message: string;
    data: Category;
}

interface CategoryListPayload {
    order: string[][];
    search: string;
    filter: { status: number | number[] };
    offset: number;
    limit: number;
    allrecords: boolean;
    searchfields: string[];
}

interface CategoryListResponse {
    success: boolean;
    message: string;
    data: {
        data: Category[];
        totalRecords: number;
        offset: number;
        limit: number;
    };
}

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    private apiUrl = 'http://localhost:3300/categories';

    constructor(private http: HttpClient) { }

    getAll(): Observable<Category[]> {
        return this.http.get<any>(this.apiUrl).pipe(
            map(response => {
                // Handle both direct array or nested data structure
                if (Array.isArray(response.data)) {
                    return response.data;
                } else if (response.data && Array.isArray(response.data.data)) {
                    return response.data.data;
                }
                return [];
            })
        );
    }

    getList(payload: CategoryListPayload): Observable<{ data: Category[], totalRecords: number }> {
        return this.http.post<CategoryListResponse>(`${this.apiUrl}/list`, payload).pipe(
            map(response => response.data)
        );
    }

    getById(id: number): Observable<Category> {
        return this.http.get<SingleApiResponse>(`${this.apiUrl}/${id}`).pipe(
            map(response => response.data)
        );
    }

    create(category: FormData): Observable<Category> {
        return this.http.post<SingleApiResponse>(this.apiUrl, category).pipe(
            map(response => response.data)
        );
    }

    update(id: number, category: FormData | Category): Observable<Category> {
        return this.http.put<SingleApiResponse>(`${this.apiUrl}/${id}`, category).pipe(
            map(response => response.data)
        );
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
