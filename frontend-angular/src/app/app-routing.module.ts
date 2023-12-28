import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { DeckListComponent } from './deck-list/deck-list.component';
import { DeckCreateComponent } from './deck-create/deck-create.component';
import { StudyComponent } from './study/study.component';
import { FlashcardCreateComponent } from './flashcard-create/flashcard-create.component';
import { FlashcardListComponent  } from './flashcard-list/flashcard-list.component';
import { FlashcardManagementComponent } from './flashcard-management/flashcard-management.component';
import { SearchComponent } from './search/search.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { SynchronizationComponent } from './synchronization/synchronization.component';

const routes: Routes = [
  { path: '', component: HomeComponent }, // Default route
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'deck-list', component: DeckListComponent },
  { path: 'create-deck', component: DeckCreateComponent },
  { path: 'study', component: StudyComponent },
  { path: 'flashcard-create', component: FlashcardCreateComponent },
  { path: 'flashcard-list', component: FlashcardListComponent },
  { path: 'add-flashcards', component: FlashcardManagementComponent },
  { path: 'search', component: SearchComponent },
  { path: 'statistics', component: StatisticsComponent },
  { path: 'synchronization', component: SynchronizationComponent },
  // Add any new route configurations above this line
  // Wildcard route for a 404 page or redirect can be placed here
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

