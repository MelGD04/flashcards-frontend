import { MyFlashcardsComponent } from './my-flashcards/my-flashcards.component';
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FlashcardsComponent } from './flashcards/flashcards.component';
import { FavFlashcardsComponent } from './fav-flashcards/fav-flashcards.component';


export const routes: Routes = [
    {path: '', component:HomeComponent},
    {path: 'flashcards', component: FlashcardsComponent},
    {path: 'my-flashcards', component: MyFlashcardsComponent},
    {path: 'fav-flashcards',component: FavFlashcardsComponent}
    
];
