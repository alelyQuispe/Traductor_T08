import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslationListComponent } from './translation/translation-list/translation-list.component';

const routes: Routes = [
  // Otras rutas
  { path: 'admin/traductor', component: TranslationListComponent },
  // Otras rutas
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }