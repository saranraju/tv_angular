import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  sectionTab: any = 'home';
  isOpen: any = false;
  forgotForm: any = FormGroup;
  resetForm: any = FormGroup;
  showFieldRequired: any = false;
  showReset: boolean = false;
  showSuccessMsg: any = false;
  showFailureMsg: any = false;
  emailRequired: any = false;
  emailRegex = new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$');
  errorMessage: any = 'User does not exist';
  successMessage: any = 'We have sent a mail to your email.';

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.forgotForm = this.fb.group({
      userEmail: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(this.emailRegex),
        ]),
      ],
    });
  }

  navigateHomeRoute() {
    // var token = 'qwertyuijefjkfkjrfjk';
    localStorage.setItem('prevUrl', '/financialmarketdata/company');
    var token = localStorage.getItem('access_token');
    if (token) {
      this.router.navigate(['/financialmarketdata/company']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  navigateToSection(section: string) {
    this.sectionTab = section;
    // window.location.hash = '';
    // window.location.hash = section;
    document
      .getElementById(`${section}`)
      ?.scrollIntoView({ behavior: 'smooth' });
  }
  sectionActive(sectionActive: any) {
    this.sectionTab = sectionActive;
  }

  demoAccess(valid: any, value: any) {
    if (valid) {
      this.showReset = true;
      this.showFieldRequired = false;
      this.showFailureMsg = false;
      this.emailRequired = false;
      const body = {};
      const email = value.userEmail;
      this.auth.forgotPassword(email, body).subscribe(
        (res: any) => {
          console.log(res);
          this.showSuccessMsg = true;
          this.successMessage = res.message;
        },
        (err: any) => {
          console.error(err);
          this.showFailureMsg = true;
          this.showFieldRequired = false;
          this.errorMessage = err.error;
          setTimeout(() => {
            this.showFailureMsg = false;
          }, 5000);
        }
      );
    } else {
      if (!value.userEmail) {
        this.emailRequired = false;
        this.showFieldRequired = true;
      } else {
        this.emailRequired = true;
        this.showFieldRequired = false;
      }
    }
  }
}
