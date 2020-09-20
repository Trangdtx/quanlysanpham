import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

import { ProductService } from '@app/_services';
import { Product } from '@app/_models';

@Component({ templateUrl: 'detail.component.html' })
export class DetailComponent implements OnInit {
    product: Product;
    id: string;
    isAddMode: boolean;
    loading = false;
    submitted = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private producService: ProductService,
    ) {}

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];

        this.producService.getById(this.id)
            .pipe(first())
            .subscribe(x => {
                this.product = x
            });
    }
}