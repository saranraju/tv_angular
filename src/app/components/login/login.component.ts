import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FinancialMarketDataService } from 'src/app/services/financialmarketdata.service';
import { UtilService } from 'src/app/services/util.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: any = FormGroup;
  disabledBtn: boolean = false;
  sectionTab: any = 'login';
  isOpen: any = false;
  mobileOverlay: any = false;
  showFailureMsg: any = false;
  showsucessMsg: any = false;
  errorMessage: any = 'User does not exist.';
  sucessMessage: any;
  verifyToken: any = '';
  count_res: any = 0;
  emailRegex = new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$');
  total_count_res: any = '';
  headers: HttpHeaders | any;
  options: any;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public util: UtilService,
    private financialMarketData: FinancialMarketDataService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe((params: any) => {
      this.verifyToken = params.params.verifyToken;
      this.callEmailVerification(this.verifyToken);
    });

    this.loginForm = this.fb.group({
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(this.emailRegex),
        ]),
      ],
      password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$'),
        ]),
      ],
    });
  }

  callEmailVerification(data: any) {
    if (data) {
      var body = {};
      this.auth.emailVerification(data, body).subscribe(
        (res: any) => {
          this.sucessMessage = res.message ?? res;
          this.showsucessMsg = true;
        },
        (err: any) => {
          console.log('error', err.message);
          if (err.status == 202) {
            this.sucessMessage = err.error.text;
            this.showsucessMsg = true;
          } else {
            this.errorMessage = err.error.text;
            this.showFailureMsg = true;
          }
        }
      );
    }
  }

  onClickResponsiveMenu() {
    this.mobileOverlay = !this.mobileOverlay;
    if (this.mobileOverlay) {
      (document.getElementById('menu') as any).style.display = 'block';
    }
    if (!this.mobileOverlay) {
      (document.getElementById('menu') as any).style.display = 'none';
    }
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
  passwordReset() {
    this.loginForm.get('password').reset();
  }

  loginAccess(valid: any, value: any) {
    this.sucessMessage = null;
    this.showsucessMsg = false;
    if (valid) {
      this.disabledBtn = true;

      this.financialMarketData.getCountryIp().subscribe((res: any) => {
        this.headers = new HttpHeaders({
          'X-Forwarded-For': res.query,
        });
        this.options = { headers: this.headers };

        this.util.loaderService.display(true);
        this.count_res = 0;
        this.total_count_res = 1;
        this.auth.login(value, this.options).subscribe(
          (res: any) => {
            var viewport = document.querySelector(
              'meta[name="viewport"]' as any
            );

            if (viewport) {
              viewport.content = 'initial-scale=0.1';
              viewport.content = 'width=1300';
            }
            ++this.count_res;
            this.util.checkCountValue(this.total_count_res, this.count_res);
            localStorage.removeItem('exploreExpired');
            localStorage.removeItem('exploreUserTime');

            let token = res.token;
            let email = res.data.email;
            let userId = res.data.userId;
            let id = res.data.id;
            let userType = res.data.subscriptionType;
            localStorage.setItem('access_token', token);
            localStorage.setItem('email', email);
            localStorage.setItem('userId', userId);
            localStorage.setItem('id', id);
            localStorage.setItem('userType', userType);
            var prev_url = localStorage.getItem('prevUrl');
            if (prev_url) {
              this.router.navigate([prev_url]);
              localStorage.removeItem('prevUrl');
            } else {
              this.router.navigate(['/financialmarketdata/company']);
            }
          },
          (err: any) => {
            ++this.count_res;
            this.util.checkCountValue(this.total_count_res, this.count_res);
            this.disabledBtn = false;
            this.showFailureMsg = true;
            if (err.error.message) {
              this.errorMessage = err.error.message;
            } else {
              this.errorMessage = 'Email or Password is incorrect';
            }
            setTimeout(() => {
              this.showFailureMsg = false;
              this.loginForm.get('password').reset();
              this.loginForm.get('email').reset();
            }, 5000);
            console.log('error', err.message);
          }
        );
      });
    }
  }
}
