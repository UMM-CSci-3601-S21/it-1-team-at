import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContextpackListComponent } from './contextpack/contextpack-list.component';
import { ContextpackContentComponent} from './contextpack/contextpack-content.component';
import { AddContextpackComponent } from './contextpack/add-contextpack.component';

const routes: Routes = [
  {path: '', component: ContextpackListComponent},
  {path: 'contextpacks', component: ContextpackListComponent},
  {path: 'contextpacks/new', component: AddContextpackComponent },
  {path: 'contextpacks/:id', component: ContextpackContentComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
