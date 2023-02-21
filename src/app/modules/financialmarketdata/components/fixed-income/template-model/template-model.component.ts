import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormArray } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FinancialMarketDataService } from 'src/app/services/financialmarketdata.service';

@Component({
  selector: 'app-template-model',
  templateUrl: './template-model.component.html',
  styleUrls: ['./template-model.component.scss'],
})
export class TemplateModelComponent implements OnInit {
  templateName: any;
  myForm: any;
  arr: any;
  allRegionInstruments: any = [];
  regionsData: any = [];
  indTemplateDetails: any;
  @Input() templateId: any;
  @Output() savedTemplate = new EventEmitter();

  constructor(
    public auth: AuthService,
    private fb: FormBuilder,
    private financialDataService: FinancialMarketDataService
  ) {}

  ngOnInit(): void {
    this.myForm = this.fb.group({
      arr: this.fb.array([this.createItem()]),
    });
    this.getRegionAndInstruments();
  }

  getRegionAndInstruments() {
    this.financialDataService
      .getRegionAndInstruments()
      .subscribe((res: any) => {
        res.forEach((element: any) => {
          let temp: any = {};
          temp['region'] = {
            id: element.region.split('-')[1],
            name: element.region.split('-')[0],
          };
          temp['instruments'] = [];
          element.instrumentType.split(',').forEach((el: any) => {
            temp['instruments'].push({
              id: el.split('-')[1],
              name: el.split('-')[0],
            });
          });
          this.allRegionInstruments.push(temp);
        });
        console.log('this.allRegionInstruments', this.allRegionInstruments);
      });
  }

  createItem() {
    return this.fb.group({
      instrumentType: ['Select Instrument Type'],
      region: ['Select Region'],
    });
  }

  addItem() {
    this.arr = this.myForm.get('arr') as FormArray;
    this.arr.push(this.createItem());
  }

  removeItem(index: any) {
    this.arr = this.myForm.get('arr') as FormArray;
    let length = this.arr.value.length;
    if (length > 1) {
      this.arr.removeAt(index);
    }
  }

  onSubmit() {
    let body: any = [];
    this.myForm.value.arr.forEach((element: any) => {
      body.push({
        userId: 11,
        instrumentTypeId: element.instrumentType,
        regionId: element.region,
        templateName: this.templateName,
      });
    });
    this.financialDataService.createTemplate(body).subscribe((res: any) => {
      this.savedTemplate.emit(res);
    });
  }

  particularRegion(args: any, index: any) {
    let id = args.target.value;
    this.regionsData[index] = this.allRegionInstruments.filter(
      (el: any) => id == el.region.id
    )[0]['instruments'];
  }

  // getIndividualTemplateDetails() {
  //   //For removing dummy template
  //   this.arr = this.myForm.get('arr') as FormArray;
  //   this.arr.removeAt(0);
  //   //For adding API values to template
  //   this.financialDataService
  //     .getIndividualTemplateDetails(this.templateId)
  //     .subscribe((res: any) => {
  //       this.templateName = res[1][0].templateName;
  //       res[0].forEach((element: any) => {
  //         this.arr.push(
  //           this.fb.group({
  //             instrumentType: [element.instrumentTypeId],
  //             region: [element.regionId],
  //           })
  //         );
  //       });
  //     });
  // }
}
