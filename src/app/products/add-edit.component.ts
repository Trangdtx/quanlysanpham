import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { ProductService, AlertService } from '@app/_services';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
    form: FormGroup;
    id: string;
    isAddMode: boolean;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private service: ProductService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;
        
        // password not required in edit mode
        const passwordValidators = [Validators.minLength(6)];
        if (this.isAddMode) {
            passwordValidators.push(Validators.required);
        }

        this.form = this.formBuilder.group({
            name: ['', Validators.required],
            description: ['', Validators.required],
            price: ['', Validators.required],
            discount_amount: [''],
            status: [false]
            });

        if (!this.isAddMode) {
            this.service.getById(this.id)
                .pipe(first())
                .subscribe(x => {
                    this.f.name.setValue(x.name);
                    this.f.description.setValue(x.description);
                    this.f.price.setValue(x.price);
                    this.f.status.setValue(x.status);
                    this.f.discount_amount.setValue(x.discount_amount);
                });
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        if (this.isAddMode) {
            this.createPost();
        } else {
            this.updatePost();
        }
    }

    private createPost() {
        this.service.add(this.form.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Thêm thành công', { keepAfterRouteChange: true });
                    this.router.navigate(['.', { relativeTo: this.route }]);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }

    private updatePost() {
        this.service.update(this.id, this.form.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Cập nhật thành công', { keepAfterRouteChange: true });
                    this.router.navigate(['..', { relativeTo: this.route }]);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
}