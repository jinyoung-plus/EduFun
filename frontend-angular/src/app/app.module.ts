//frontend-angular/src/app/app.module.ts
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Import your components here
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { AddComponent } from './add/add.component';
import { SearchComponent } from './search/search.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { SynchronizationComponent } from './synchronization/synchronization.component';
import { DeckListComponent } from './deck-list/deck-list.component';
import { DeckCreateComponent } from './deck-create/deck-create.component';
import { FlashcardCreateComponent } from './flashcard-create/flashcard-create.component';
import { FlashcardListComponent } from './flashcard-list/flashcard-list.component';
import { FlashcardManagementComponent } from './flashcard-management/flashcard-management.component';
import { DeckEditComponent } from './deck-edit/deck-edit.component';
import { StudyComponent } from './study/study.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    AddComponent,
    SearchComponent,
    StatisticsComponent,
    SynchronizationComponent,
    DeckListComponent,
    DeckCreateComponent,
    FlashcardCreateComponent,
    FlashcardListComponent,
    FlashcardManagementComponent,
    DeckEditComponent,
    StudyComponent,
    // Add other components that are actually being used in your project
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule
    // You can remove NgbModule if you're not using ng-bootstrap components
    // Remove RouterModule if you're not doing any manual routing configurations outside AppRoutingModule
  ],
  providers: [
    // UserService should provide authentication related functions
    // Other services that are actually being used in your project
    // Remove services like ReservationService and ContactService if they are not used
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
