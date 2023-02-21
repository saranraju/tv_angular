import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FinancialMarketDataService } from 'src/app/services/financialmarketdata.service';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss'],
})
export class MyAccountComponent implements OnInit {
  table_data: any = {
    title: [
      {
        label: 'SRN',
        key: 'srn',
        width: '15rem',
        color: '#557fc9',
        sorting: true,
      },
      {
        label: 'Date',
        key: 'startDate',
        width: '6rem',
        sorting: true,
      },
      {
        label: 'Subscriber Type',
        key: 'serviceType',
        width: '8rem',
        sorting: true,
      },
      {
        label: 'Service Type',
        key: 'feePeriodType',
        width: '7rem',
        sorting: true,
      },
      {
        label: 'Amount',
        key: 'fee',
        width: '6rem',
        sorting: true,
      },
      {
        label: 'Status',
        key: 'subscriptionType',
        width: '6rem',
        sorting: true,
      },
    ],
    value: [
      // {
      //   srn: '220228125416021737431',
      //   date: '28-Feb-2022',
      //   subType: 'EQUIBase',
      //   serType: 'Anually',
      //   amt: 'US $0',
      //   status: 'Demo',
      // },
    ],
  };
  iconIndex: any = 0;
  shortDown: boolean = false;
  shortUp: boolean = false;
  selectedPage: any = 1;
  myAccForm: any = FormGroup;
  passwordRegex = new RegExp('^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$');
  token: any;
  alertmsg: any;
  message: any;

  public labels: any = {
    previousLabel: '←',
    nextLabel: '→',
  };

  constructor(
    private fb: FormBuilder,
    public auth: AuthService,
    private financialMarketData: FinancialMarketDataService
  ) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('access_token');
    this.getMyAccountData();
    this.myAccForm = this.fb.group({
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

  getMyAccountData() {
    this.financialMarketData.getMyAccountData().subscribe(
      (res: any) => {
        console.log(res);
        this.table_data.value = res.data;
      },
      (err: any) => {
        console.log('error', err.error.message);
      }
    );
  }

  myAccAccess(valid: any, value: any) {
    if (valid) {
      if (value.password == value.rePassword) {
        if (value.password.length >= 6) {
          let userId = localStorage.getItem('userId');
          let body = {
            userId: userId,
            password: value.password,
          };
          this.financialMarketData.changePassword(body).subscribe(
            (res: any) => {
              console.log(res);
              this.message = res.message;
              this.myAccForm.get('password').reset();
              this.myAccForm.get('rePassword').reset();
              setTimeout(() => {
                this.message = false;
              }, 5000);
            },
            (err: any) => {
              console.log('error', err.error.message);
            }
          );
        } else {
          this.alertmsg = 'Password should be between 6-50 characters long';
          this.auth.closeInsidePopup = true;
        }
      } else {
        this.alertmsg = "Password and re-entered password doesn't match";
        this.auth.closeInsidePopup = true;
      }
    } else {
      if (!value.password) this.alertmsg = 'Please enter password';
      else if (!value.rePassword) this.alertmsg = 'Please re-enter password';
      else if (!this.passwordRegex.test(value.password))
        this.alertmsg = 'Password should be alpha numeric';
      else if (!this.passwordRegex.test(value.rePassword))
        this.alertmsg = 'Password should be alpha numeric';
      this.auth.closeInsidePopup = true;
    }
  }

  sortByKey(key: any, i: any, sort?: any) {
    if (sort) {
      this.iconIndex = i;
      this.shortDown = !this.shortDown;
      return this.table_data.value.sort((a: any, b: any) => {
        var x = a[key];
        var y = b[key];
        if (this.shortDown == true) {
          return x < y ? 1 : x > y ? -1 : 0;
        } else {
          return x < y ? -1 : x > y ? 1 : 0;
        }
      });
    }
  }

  handlePaginateClick() {}
}
