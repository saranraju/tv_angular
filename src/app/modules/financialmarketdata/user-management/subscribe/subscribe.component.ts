import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FinancialMarketDataService } from 'src/app/services/financialmarketdata.service';
@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.scss'],
})
export class SubscribeComponent implements OnInit {
  public subscribeForm: any;
  alertmsg: any;
  selectCountry: any = [];
  selectedCountry: any = '';
  countryPlanList: any = [];
  regionPlanList: any = [];
  subscribeUser: any = 'false';
  disableButton: any = false;

  planButton: any = 'premiumPlan';
  emailRegex = new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$');
  passwordRegex = new RegExp('^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$');

  constructor(
    private router: Router,
    public auth: AuthService,
    public form: FormBuilder,
    private financialService: FinancialMarketDataService
  ) {}

  ngOnInit(): void {
    $(document).on('select2:open', () => {
      const inputs: any = document.querySelectorAll(
        '.select2-search__field[aria-controls]'
      );
      const mostRecentlyOpenedInput = inputs[inputs.length - 1];
      mostRecentlyOpenedInput.focus();
    });

    this.subscribeForm = this.form.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      emailAddress: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(this.emailRegex),
        ]),
      ],
      pass: [
        '',
        [
          Validators.compose([
            Validators.required,
            Validators.pattern(this.passwordRegex),
          ]),
        ],
      ],
      rePass: [
        '',
        [
          Validators.compose([
            Validators.required,
            Validators.pattern(this.passwordRegex),
          ]),
        ],
      ],
    });

    this.auth.getSubscribeCountryPlanList().subscribe((res: any) => {
      let formattedData: any = [];
      let formattedRegionData: any = [];
      res.data.forEach((element: any) => {
        formattedData.push({
          id: element.countryId,
          text: element.countryName,
        });
      });
      this.countryPlanList = res.data;
      this.auth.getSubscribeRegionPlanList().subscribe((res: any) => {
        res.data.forEach((regele: any) => {
          formattedRegionData.push({
            id: regele.regionCode,
            text: regele.regionName,
          });
        });
        this.regionPlanList = res.data;
        formattedData.sort((a: any, b: any) => a.text.localeCompare(b.text));
        formattedRegionData.sort((a: any, b: any) =>
          a.text.localeCompare(b.text)
        );
        this.selectCountry = [
          {
            id: 1,
            text: 'Related Countries',
            children: formattedData,
          },
          {
            id: 2,
            text: 'Related Region',
            children: formattedRegionData,
          },
        ];
      });
    });
  }
  message: any;
  errorMessage: any;
  subscribeFormSubmit(valid: any, value: any) {
    if (valid) {
      let body = {
        email: value.emailAddress,
        password: value.pass,
        requestType: 'capitalmarket',
        firstName: value.firstName,
        lastName: value.lastName,
        userType: null,
        contact: null,
        serviceType: this.serviceType,
        services: this.services,
        countryType: this.countryType,
        countries: this.countryList,
        amount: this.selectedAmount,
        regionType: this.regionType,
        regions: this.regionList,
      };
      // process API thinsg
      console.log(body);
      if (value.pass == value.rePass) {
        if (value.pass.length == 6 || value.pass.length > 6) {
          if (this.planButton !== 'customPlan') {
            this.disableButton = true;

            this.auth.createSubscribeUser(body).subscribe(
              (res) => {
                console.log(res);
                // this.router.navigate(['/login']);
                this.subscribeUser = 'true';
                this.message = res;
                this.disableButton = false;
              },
              (err) => {
                console.error(err.error);
                this.errorMessage = err.error;
                this.subscribeUser = 'false';
                this.disableButton = false;
              }
            );
          } else {
            if (this.selectedCountry !== '') {
              this.disableButton = true;

              this.auth.createSubscribeUser(body).subscribe(
                (res) => {
                  console.log(res);
                  // this.router.navigate(['/login']);
                  this.subscribeUser = 'true';
                  this.message = res;
                  this.disableButton = false;
                },
                (err) => {
                  console.error(err.error);
                  this.errorMessage = err.error;
                  this.subscribeUser = 'false';
                  this.disableButton = false;
                }
              );
            } else {
              this.alertmsg = 'Please Select Country / Region';
              this.auth.closeInsidePopup = true;
            }
          }
        } else {
          this.alertmsg = 'Password should be between 6-50 characters long';
          this.auth.closeInsidePopup = true;
        }
      } else {
        this.alertmsg = "Password and re-entered password doesn't match";
        this.auth.closeInsidePopup = true;
      }
    } else {
      if (!value.firstName) this.alertmsg = 'Please enter first name';
      else if (!value.lastName) this.alertmsg = 'Please enter last name';
      else if (!value.emailAddress || !this.emailRegex.test(value.emailAddress))
        this.alertmsg = 'Please enter valid email address.';
      else if (!value.pass) this.alertmsg = 'Please enter Password';
      else if (!value.rePass) this.alertmsg = 'Please re-enter password';
      else if (!this.passwordRegex.test(value.pass))
        this.alertmsg = "Password doesn't match with pattern";
      else if (!this.passwordRegex.test(value.rePass))
        this.alertmsg = "Password doesn't match with pattern";

      this.auth.closeInsidePopup = true;
    }
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }

  planButtonChange(value: any) {
    this.subscribeForm.reset();
    this.planButton = value;
  }
  selectedAmount: any = '5000';
  serviceType: any = 'All';
  countryList: any = [];
  regionList: any = [];
  countryType: any = 'All';
  regionType: any = 'All';
  services: any = [];
  regionPlan: any;
  flag: any = false;
  valueChangeHandler(type: any, data: any) {
    if (type === 'Country') {
      if (this.selectCountry && this.selectedCountry !== data) {
        this.flag = false;
        this.selectedCountry = data;
        let selectedPlan = this.countryPlanList.filter((el: any) => {
          return el.countryId === parseInt(this.selectedCountry);
        });
        if (selectedPlan.length != 0) {
          this.countryList = [];
          this.regionList = [];
          this.selectedAmount = selectedPlan[0]?.amount ?? '5000';
          // this.serviceType = selectedPlan[0]?.serviceType;
          this.countryList.push(selectedPlan[0]?.countryId);
          // this.countryType = selectedPlan[0]?.countryName;
          this.countryType = 'Selected';
          let regionCode = selectedPlan[0]?.regionCode;
          this.regionPlan = this.regionPlanList.filter((ele: any) => {
            return ele.regionCode === regionCode;
          });
        }
        if (selectedPlan.length == 0) {
          this.countryList = [];
          this.regionList = [];
          let onlyRegion = this.regionPlanList.filter((ele: any) => {
            return ele.regionCode === data;
          });
          this.selectedAmount = onlyRegion[0]?.amount ?? '5000';
          // this.serviceType = onlyRegion[0]?.serviceType;
          this.regionList.push(onlyRegion[0]?.regionId);
          // this.regionType = onlyRegion[0]?.regionName;
          this.regionType = 'Selected';
        }
        if (this.regionPlan.length > 0) {
          this.flag = true;
        }
      }
    }
  }
}
