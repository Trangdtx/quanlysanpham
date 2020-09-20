import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Product, ApiResponse } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class ProductService {

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        
    }

    add(product: Product) {
        return this.http.post(`${environment.apiUrl}/products`, Product);
    }

    getAll(page = 1) {
        return this.http.get<ApiResponse>(`${environment.apiUrl}/products`, {params : { page: page.toString() } });
    }

    getById(id: string) {
        return this.http.get<ApiResponse>(`${environment.apiUrl}/products/${id}`)
        .pipe(map(x => x.data));
    }

    update(id, params) {
        return this.http.put(`${environment.apiUrl}/products/${id}`, params);
    }

    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/products/${id}`);
    }
}