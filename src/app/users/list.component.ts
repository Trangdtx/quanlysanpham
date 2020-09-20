import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService } from '@app/_services';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    users = [];
    pagination =  {
        total: 0,
        pages: 0,
        page: 1,
        limit: 20
    };

    constructor(private accountService: AccountService) {}

    ngOnInit() {
        this.fetchData()
    }

    fetchData(page = 1){
        this.accountService.getAll(page)
        .pipe(first())
        .subscribe(res => {
            this.users = [...this.users, ...res.data];
            this.pagination = res.meta.pagination;
        });
    }

    deleteUser(id: string) {
        const user = this.users.find(x => x.id === id);
        user.isDeleting = true;
        this.accountService.delete(id)
            .pipe(first())
            .subscribe(() => {
                this.users = this.users.filter(x => x.id !== id) 
            });
    }

    onChangePage(page: number) {
        // update current page of items
        this.pagination.page = page;
    }

    loadMore(){
        this.pagination.page += 1;
        this.fetchData(this.pagination.page);
    }
}