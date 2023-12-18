import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { OurVenuesComponent } from './our-venues/our-venues.component';
import { EventsComponent } from './events/events.component';
import { ContactComponent } from './contact/contact.component';
import { MakeReservationComponent } from './make-reservation/make-reservation.component';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { DeckComponent } from './deck/deck.component';
import { AddComponent } from './add/add.component';
import { SearchComponent } from './search/search.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { SynchronizationComponent } from './synchronization/synchronization.component';

const routes: Routes = [
  { path: '', component: HomeComponent }, // 기본 경로 설정
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'our-venues', component: OurVenuesComponent },
  { path: 'events', component: EventsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'make-reservation', component: MakeReservationComponent },
  { path: 'deck', component: DeckComponent },
  { path: 'add', component: AddComponent },
  { path: 'search', component: SearchComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'statistics', component: StatisticsComponent },
  { path: 'synchronization', component: SynchronizationComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
