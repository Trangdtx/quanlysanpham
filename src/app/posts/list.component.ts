import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { PostService } from '@app/_services';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    posts = [];
    pagination =  {
        total: 0,
        pages: 0,
        page: 1,
        limit: 20
    };

    constructor(private postService: PostService) {}

    ngOnInit() {
        this.fetchData()
    }

    fetchData(page = 1){
        this.postService.getAll(page)
        .pipe(first())
        .subscribe(res => {
            this.posts = [...this.posts, ...res.data];
            this.pagination = res.meta.pagination;
        });
    }

    deletePost(id: string) {
        const user = this.posts.find(x => x.id === id);
        user.isDeleting = true;
        this.postService.delete(id)
            .pipe(first())
            .subscribe(() => {
                this.posts = this.posts.filter(x => x.id !== id) 
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