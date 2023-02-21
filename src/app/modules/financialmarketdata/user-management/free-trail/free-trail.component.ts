import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FinancialMarketDataService } from 'src/app/services/financialmarketdata.service';

@Component({
  selector: 'app-free-trail',
  templateUrl: './free-trail.component.html',
  styleUrls: ['./free-trail.component.scss'],
})
export class FreeTrailComponent implements OnInit {
  sectionTab: any = 'free-trail';
  freeTrailForm: any = FormGroup;
  alertmsg: any;
  emailRegex = new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$');
  passwordRegex = new RegExp('^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$');

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private finacialMarketData: FinancialMarketDataService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.freeTrailForm = this.fb.group({
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(this.emailRegex),
        ]),
      ],
      comapanyName: [''],
      password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(this.passwordRegex),
        ]),
      ],
      rePassword: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(this.passwordRegex),
        ]),
      ],
    });
  }
  message: any;
  errorMessage: any;
  disableButton: any = false;
  freeTrailAccess(valid: any, value: any) {
    this.message = null;
    this.errorMessage = null;
    if (valid) {
      if (value.password == value.rePassword) {
        if (value.password.length == 6 || value.password.length > 6) {
          const name = value.email.split('@');
          let countryId;
          this.finacialMarketData.getCountryIp().subscribe((res) => {
            countryId = res.countryCode;
          });
          this.disableButton = true;

          var body = {
            email: value.email,
            password: value.password,
            requestType: 'capitalmarket',
            firstName: name[0],
            lastName: value.comapanyName,
            // serviceType: 'EQUIBASE',
            // userType: 'ind',
            // contact: 8810477316,
          };
          this.authService.siginUpAsADemoUser(body).subscribe(
            (res: any) => {
              console.log(res);
              this.message = res.message;
              this.disableButton = false;
              // this.router.navigate(['/login']);
            },
            (err) => {
              console.error(err);
              this.errorMessage = err.error;
              this.disableButton = false;
            }
          );
        } else {
          this.alertmsg = 'Password should be between 6-50 characters long';
          this.authService.closeInsidePopup = true;
        }
      } else {
        this.alertmsg = "Password and re-entered password doesn't match";
        this.authService.closeInsidePopup = true;
      }
    } else {
      if (!value.email || !this.emailRegex.test(value.email))
        this.alertmsg = 'Please enter valid email address.';
      else if (!value.comapanyName) this.alertmsg = 'Please enter company name';
      else if (!value.password) this.alertmsg = 'Please enter Password';
      else if (!value.rePassword) this.alertmsg = 'Please re-enter password';
      else if (!this.passwordRegex.test(value.password))
        this.alertmsg = "Password doesn't match with pattern";
      else if (!this.passwordRegex.test(value.rePassword))
        this.alertmsg = "Password doesn't match with pattern";
      this.authService.closeInsidePopup = true;
    }
  }
}
