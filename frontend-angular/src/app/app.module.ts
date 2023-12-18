import { HttpClientModule, HttpClient } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
// Import your components here
import { AboutUsComponent } from './about-us/about-us.component';
import { OurVenuesComponent } from './our-venues/our-venues.component';
import { EventsComponent } from './events/events.component';
import { ContactComponent } from './contact/contact.component';
import { MakeReservationComponent } from './make-reservation/make-reservation.component'; // Uncomment if you have this component
import { UserService } from './user.service';
import { HomeComponent } from './home/home.component'; // Adjust the path as necessary
import { ReservationService } from './reservation.service';
import { ContactService } from './contact.service';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { SignupComponent } from './signup/signup.component'; // ContactService 임포트

@NgModule({
  declarations: [
    AppComponent,
    AboutUsComponent,
    OurVenuesComponent,
    EventsComponent,
    ContactComponent,
    MakeReservationComponent,
    HomeComponent,
    LoginComponent,
    AdminComponent,
    SignupComponent, // Uncomment if you have this component
  ],
  imports: [
    BrowserModule,
    HttpClientModule, // Enable `fetch` for HttpClient
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    AppRoutingModule,
    NgbModule
  ],
  providers: [
    // Provide your services here
    ReservationService,
    ContactService, // 프로바이더에 추가
    UserService,
    { provide: APP_ID, useValue: 'EduFun' } // 'EduFun'으로 실제 ID를 설정
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
