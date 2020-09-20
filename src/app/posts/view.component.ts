import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

import { PostService, AlertService } from '@app/_services';
import { Post } from '@app/_models';

@Component({ templateUrl: 'view.component.html' })
export class ViewComponent implements OnInit {
    post: Post;
    id: string;
    loading = true;

    constructor(
        private route: ActivatedRoute,
        private postService: PostService,
        private router: Router,
    ) {}

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.postService.getById(this.id)
                .pipe(first())
                .subscribe(x => {
                    this.post = x;
                });
    }

    edit(){
        this.router.navigateByUrl(`/posts/edit/${this.id}`);
    }
}