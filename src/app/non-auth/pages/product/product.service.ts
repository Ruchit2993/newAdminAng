import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Product {
    id?: number;
    name: string;
    description?: string;
    price: number;
    category_id: number;
    category?: { name: string }; // For display in list
    image?: string;
    status?: string | number;
}

interface SingleApiResponse {
    success: boolean;
    message: string;
    data: Product;
}

interface ProductListPayload {
    order: string[][];
    search: string;
    filter: {
        status?: number | number[];
        category_id?: number;
        [key: string]: any;
    };
    offset: number;
    limit: number;
    allrecords: boolean;
    searchfields: string[];
}

interface ProductListResponse {
    success: boolean;
    message: string;
    data: {
        data: Product[];
        totalRecords: number;
        offset: number;
        limit: number;
    };
}

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private apiUrl = 'http://localhost:3300/products';

    constructor(private http: HttpClient) { }

    getList(payload: ProductListPayload): Observable<{ data: Product[], totalRecords: number }> {
        return this.http.post<ProductListResponse>(`${this.apiUrl}/list`, payload).pipe(
            map(response => response.data)
        );
    }

    getById(id: number): Observable<Product> {
        return this.http.get<SingleApiResponse>(`${this.apiUrl}/${id}`).pipe(
            map(response => response.data)
        );
    }

    create(product: FormData): Observable<Product> {
        return this.http.post<SingleApiResponse>(this.apiUrl, product).pipe(
            map(response => response.data)
        );
    }

    update(id: number, product: FormData | Product): Observable<Product> {
        return this.http.put<SingleApiResponse>(`${this.apiUrl}/${id}`, product).pipe(
            map(response => response.data)
        );
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
