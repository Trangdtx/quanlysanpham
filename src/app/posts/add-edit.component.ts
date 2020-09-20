import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { PostService, AlertService } from '@app/_services';

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
        private postService: PostService,
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
            "title": ['', Validators.required],
            "body": ['', Validators.required],
        });

        if (!this.isAddMode) {
            this.postService.getById(this.id)
                .pipe(first())
                .subscribe(x => {
                    this.f.title.setValue(x.title);
                    this.f.body.setValue(x.body);
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
        this.postService.add(this.form.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Thêm bài viết thành công', { keepAfterRouteChange: true });
                    this.router.navigate(['.', { relativeTo: this.route }]);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }

    private updatePost() {
        this.postService.update(this.id, this.form.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Cập nhật bài viết thành công', { keepAfterRouteChange: true });
                    this.router.navigate(['..', { relativeTo: this.route }]);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
}