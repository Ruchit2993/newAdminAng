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

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    private apiUrl = 'http://localhost:3300/categories';

    constructor(private http: HttpClient) { }

    getAll(): Observable<Category[]> {
        return this.http.get<ApiResponse>(this.apiUrl).pipe(
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
