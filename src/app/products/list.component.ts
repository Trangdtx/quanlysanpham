import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { ProductService } from '@app/_services';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    products = [];
    pagination =  {
        total: 0,
        pages: 0,
        page: 1,
        limit: 20
    };

    constructor(private productService: ProductService) {}

    ngOnInit() {
        this.fetchData()
    }

    fetchData(page = 1){
        this.productService.getAll(page)
        .pipe(first())
        .subscribe(res => {
            this.products = [...this.products, ...res.data];
            this.pagination = res.meta.pagination;
        });
    }

    deleteProduct(id: string) {
        const user = this.products.find(x => x.id === id);
        user.isDeleting = true;
        this.productService.delete(id)
            .pipe(first())
            .subscribe(() => {
                this.products = this.products.filter(x => x.id !== id) 
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