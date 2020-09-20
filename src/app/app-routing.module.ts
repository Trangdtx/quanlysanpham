import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent} from './home'
import { AuthGuard } from './_helpers';

const postsModule = () => import('./posts/posts.module').then(x => x.PostsModule);
const productsModule = () => import('./products/products.module').then(x => x.ProductsModule);
const usersModule = () => import('./users/users.module').then(x => x.UsersModule);

const routes: Routes = [
    { path: '', component:  HomeComponent},
    { path: 'products', loadChildren:  productsModule},
    { path: 'users', loadChildren: usersModule},
    { path: 'posts', loadChildren:  postsModule},

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }