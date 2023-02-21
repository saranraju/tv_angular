import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  resetForm: any = FormGroup;
  sectionTab: any = '';
  isOpen: any = false;
  token: any;
  passwordRegex = new RegExp('^[0-9a-zA-Z]+$');
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private auth: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.params['token'];
    this.resetForm = this.fb.group({
      password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(this.passwordRegex),
        ]),
      ],
      conform_password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(this.passwordRegex),
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
    console.log(window.location.pathname);
    if (window.location.pathname !== '/') {
      this.router.navigate(['/']);
    } else {
      this.sectionTab = section;
      // window.location.hash = '';
      // window.location.hash = section;
      document
        .getElementById(`${section}`)
        ?.scrollIntoView({ behavior: 'smooth' });
    }
  }
  sectionActive(sectionActive: any) {
    this.sectionTab = sectionActive;
  }

  message: any;
  resetAccess(valid: any, value: any) {
    if (valid) {
      if (value.password === value.conform_password) {
        if (value.password.length > 6) {
          let body = {
            token: this.token,
            password: value.password,
          };
          this.auth.resetPassword(body).subscribe(
            (res: any) => {
              this.message = res.message;
              this.router.navigate(['/login']);
            },
            (err) => {
              console.log('error', err.error);
              this.message = err.error;
            }
          );
        }
      }
    }
  }
}
