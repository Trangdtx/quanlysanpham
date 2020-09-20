import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, first } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Post, ApiResponse } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class PostService {
    private userSubject: BehaviorSubject<Post>;
    public user: Observable<Post>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject<Post>(JSON.parse(localStorage.getItem('user')));
        this.user = this.userSubject.asObservable();
    }

    public get userValue(): Post {
        return this.userSubject.value;
    }

    add(post: Post) {
        return this.http.post(`${environment.apiUrl}/posts`, post);
    }

    getAll(page = 1) {
        return this.http.get<ApiResponse>(`${environment.apiUrl}/posts`, {params : { page: page.toString() } });
    }

    getById(id: string) {
        return this.http.get<ApiResponse>(`${environment.apiUrl}/posts/${id}`)
        .pipe(map(x => x.data));
    }

    update(id, params) {
        return this.http.put(`${environment.apiUrl}/posts/${id}`, params)
            .pipe(map(x => {
                // update stored user if the logged in user updated their own record
                if (id == this.userValue.id) {
                    // update local storage
                    const user = { ...this.userValue, ...params };
                    localStorage.setItem('user', JSON.stringify(user));

                    // publish updated user to subscribers
                    this.userSubject.next(user);
                }
                return x;
            }));
    }

    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/posts/${id}`);
    }
}