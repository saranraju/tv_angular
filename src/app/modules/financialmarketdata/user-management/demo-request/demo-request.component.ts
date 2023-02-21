import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FinancialMarketDataService } from 'src/app/services/financialmarketdata.service';
@Component({
  selector: 'app-demo-request',
  templateUrl: './demo-request.component.html',
  styleUrls: ['./demo-request.component.scss'],
})
export class DemoRequestComponent implements OnInit {
  sectionTab: any = '';
  demoForm: any = FormGroup;
  alertmsg: any;
  countryCodeData: any = [
    // {
    //   id: '45',
    //   text: 'UK (+44)',
    // },
    // {
    //   id: '46',
    //   text: 'US (+1)',
    // },
  ];
  countryData: any = [];
  timeSlotData: any = [
    {
      id: '07:00 AM - 07:30 AM',
      text: '07:00 AM - 07:30 AM',
    },
    {
      id: '07:30 AM - 08:00 AM',
      text: '07:30 AM - 08:00 AM',
    },
    {
      id: '08:00 AM - 08:30 AM',
      text: '08:00 AM - 08:30 AM',
    },
    {
      id: '08:30 AM - 09:00 AM',
      text: '08:30 AM - 09:00 AM',
    },
    {
      id: '09:00 AM - 09:30 AM',
      text: '09:00 AM - 09:30 AM',
    },
    {
      id: '09:30 AM - 10:00 AM',
      text: '09:30 AM - 10:00 AM',
    },
    {
      id: '10:00 AM - 10:30 AM',
      text: '10:00 AM - 10:30 AM',
    },
    {
      id: '10:30 AM - 11:00 AM',
      text: '10:30 AM - 11:00 AM',
    },
    {
      id: '11:00 AM - 11:30 AM',
      text: '11:00 AM - 11:30 AM',
    },
    {
      id: '11:30 AM - 12:00 PM',
      text: '11:30 AM - 12:00 PM',
    },
    {
      id: '12:00 AM - 12:30 PM',
      text: '12:00 AM - 12:30 PM',
    },
  ];
  currentDate: any = new Date().toISOString().slice(0, 10);

  emailRegex = new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$');
  phoneNumberRegex = new RegExp('^\\d+$');
  zipCodeRegex = new RegExp('[0-9-+()]+');
  type: any;
  check_box_value_financial: boolean = false;
  check_box_value_realTime: boolean = false;
  check_box_value_creditWorkLoan: boolean = false;
  check_box_value_benchmark: boolean = false;
  constructor(
    private fb: FormBuilder,
    public auth: AuthService,
    private route: ActivatedRoute,
    public financialservice: FinancialMarketDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.auth.getCountriesData().subscribe(
      (res: any) => {
        var data: any = [];
        // console.log('res', res  );
        res.data.forEach((element: any) => {
          data.push({
            id: element.a3,
            text:
              element?.name?.charAt(0)?.toUpperCase() + element?.name?.slice(1),
          });
        });
        this.countryData = data;
      },
      (err) => {
        console.error(err);
      }
    );
    this.auth.getCountriesData().subscribe((res: any) => {
      this.countryCodeData = [];
      var formattedData: any = [];
      res.data.forEach((ele: any) => {
        formattedData.push({
          id: ele.countryId,
          text: `(+${ele.isdCode}) ${ele.a3}`,
        });
      });
      this.countryCodeData = formattedData;
    });
    this.type = this.route.snapshot.params['type'];
    console.log('this.type', this.type);

    if (this.type === 'financial') {
      this.check_box_value_financial = true;
      console.log('financial');
    }
    if (this.type === 'realTime') {
      this.check_box_value_realTime = true;
      console.log('realTime');
    }
    if (this.type === 'creditWorkLoan') {
      this.check_box_value_creditWorkLoan = true;
      console.log('creditWorkLoan');
    }
    if (this.type == 'benchmark') {
      this.check_box_value_benchmark = true;
      console.log('benchmark');
    }
    this.demoForm = this.fb.group({
      creditWorkflow: [this.check_box_value_creditWorkLoan],
      financialMarket: [this.check_box_value_financial],
      realTimeData: [this.check_box_value_realTime],
      benchmark: [this.check_box_value_benchmark],
      userName: ['', [Validators.required]],
      orgName: ['', [Validators.required]],
      phoneNumber: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(this.phoneNumberRegex),
        ]),
      ],
      countryCode: ['', [Validators.required]],
      userEmail: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(this.emailRegex),
        ]),
      ],
      country: ['Alg'],
      date: ['', [Validators.required]],
      zipCode: ['', [Validators.required]],
      timeSlot: ['3'],
    });
  }

  demotype: any;

  demoAccess(valid: any, value: any) {
    // console.log('125----', selectedString);
    if (valid) {
      if (
        !value.creditWorkflow &&
        !value.financialMarket &&
        !value.realTimeData &&
        !value.benchmark
      ) {
        this.alertmsg = 'Please select the product type.';
        this.auth.closeInsidePopup = true;
      } else if (value.phoneNumber.length < 5) {
        this.alertmsg = 'Please enter a valid Phone number.';
        this.auth.closeInsidePopup = true;
      } else if (value.zipCode.length < 5 || value.zipCode.length > 11) {
        this.alertmsg = 'Zip code should be between 5-11 characters.';
        this.auth.closeInsidePopup = true;
      } else if (!this.zipCodeRegex.test(value.zipCode)) {
        this.alertmsg = 'Zip code can have only numbers and hyphen(-).';
        this.auth.closeInsidePopup = true;
      } else {
        const timeSplitedSlot = value.timeSlot.split('-');

        const selectedString = `${
          value.creditWorkflow ? 'credit work flow ,' : ''
        } ${value.financialMarket ? 'financial market ,' : ''} ${
          value.realTimeData ? 'real time data ,' : ''
        } ${value.benchmark ? 'benchmark' : ''}  `;
        let body = {
          // creditWorkflow: value.creditWorkflow,
          // financialMarket: 'capitalmarket',
          // realTimeData: value.realTimeData,
          // benchmark: value.benchmark,
          email: value.userEmail,
          name: value.userName,
          productType: selectedString,
          country: value.country,
          countryCode: value.countryCode,
          organization: value.orgName,
          dateOn: value.date,
          phone: value.phoneNumber,
          zipcode: value.zipCode,
          timeFrom: timeSplitedSlot[0],
          timeTo: timeSplitedSlot[1],
        };

        this.auth.demoRequestPost(body).subscribe(
          (res: any) => {
            console.log(res);
            this.alertmsg =
              'Request for demo has been submitted successfully. We will get back to you soon.';
            this.auth.closeInsidePopup = true;
            this.demotype = 'demoRequest';
            // this.router.navigate(['/login']);
          },
          (err) => {
            console.error(err);
          }
        );
        console.log(body);
      }
    } else {
      if (!value.userName) this.alertmsg = 'Please enter the name.';
      else if (!value.orgName)
        this.alertmsg = 'Please enter the organization name.';
      else if (!value.countryCode)
        this.alertmsg = 'Please fill country code with phone number.';
      else if (!value.phoneNumber)
        this.alertmsg = 'Please fill country code with phone number.';
      else if (!this.phoneNumberRegex.test(value.phoneNumber))
        this.alertmsg = 'Please enter a valid Phone number';
      else if (!value.userEmail || !this.emailRegex.test(value.userEmail))
        this.alertmsg = 'Please enter valid email address.';
      else if (!value.date) this.alertmsg = 'Please enter the date.';
      else if (!value.zipCode) this.alertmsg = 'Please enter zipcode.';

      this.auth.closeInsidePopup = true;
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
}
