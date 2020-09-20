import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, first } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User, ApiResponse } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class AccountService {
    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
        this.user = this.userSubject.asObservable();
    }

    public get userValue(): User {
        return this.userSubject.value;
    }

    login(username, password) {
        return this.http.post<User>(`${environment.apiUrl}/users/authenticate`, { username, password })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);
                return user;
            }));
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/account/login']);
    }

    register(user: User) {
        return this.http.post(`${environment.apiUrl}/users`, user);
    }

    getAll(page = 1) {
        return this.http.get<ApiResponse>(`${environment.apiUrl}/users`, {params : { page: page.toString() } });
    }

    getById(id: string) {
        return this.http.get<ApiResponse>(`${environment.apiUrl}/users/${id}`)
        .pipe(map(x => x.data));
    }

    update(id, params) {
        return this.http.put(`${environment.apiUrl}/users/${id}`, params);
    }

    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/users/${id}`);
    }
}