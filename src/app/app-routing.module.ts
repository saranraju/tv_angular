import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AuthGuard } from './guards/auth/auth.guard';
import { UserManagementComponent } from './modules/financialmarketdata/user-management/user-management.component';
import { DemoRequestComponent } from './modules/financialmarketdata/user-management/demo-request/demo-request.component';
import { SubscribeComponent } from './modules/financialmarketdata/user-management/subscribe/subscribe.component';
import { FreeTrailComponent } from './modules/financialmarketdata/user-management/free-trail/free-trail.component';
import { TermsOfConditionComponent } from './modules/financialmarketdata/user-management/terms-of-condition/terms-of-condition.component';
import { TermsOfAccessComponent } from './modules/financialmarketdata/user-management/terms-of-access/terms-of-access.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { AuthGuardGuard } from './auth/auth-guard.guard';

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path: 'reset-password/:token',
    component: ResetPasswordComponent,
  },
  {
    path: '',
    component: UserManagementComponent,
  },
  {
    path: 'demo-request/:type',
    component: DemoRequestComponent,
  },
  {
    path: 'subscribe',
    component: SubscribeComponent,
  },
  {
    path: 'free-trail',
    component: FreeTrailComponent,
  },
  {
    path: 'terms-of-use',
    component: TermsOfConditionComponent,
  },
  {
    path: 'terms-of-access',
    component: TermsOfAccessComponent,
  },
  {
    path: 'financialmarketdata',
    canActivate: [AuthGuardGuard],
    loadChildren: () =>
      import('./modules/financialmarketdata/financialmarketdata.module').then(
        (m) => m.FinancialMarketDataModule
      ),
  },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
