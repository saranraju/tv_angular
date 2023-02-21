import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { includes } from 'lodash';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FinancialMarketDataService } from 'src/app/services/financialmarketdata.service';

@Component({
  selector: 'app-add-modify-column-model',
  templateUrl: './add-modify-column-model.component.html',
  styleUrls: ['./add-modify-column-model.component.scss'],
})
export class AddModifyColumnModelComponent implements OnInit {
  @Input() existingHeader: any;
  @Input() type: any;
  @Input() isDetail: any = false;
  @Output() metricsUpdated = new EventEmitter();

  constructor(
    public auth: AuthService,
    private financialService: FinancialMarketDataService
  ) {}

  allMetrices: any = [];
  selectedMetrices: any = [];

  ngOnInit(): void {
    if (this.type == 'instrument') {
      this.getAllMerticsData();
    } else if (this.type == 'comparable') {
      this.getComparableMetricsList();
    }
  }

  getComparableMetricsList() {
    this.financialService.getComparableMetricsList().subscribe((res: any) => {
      this.allMetrices = res;
      this.allMetrices.forEach((element: any) => {
        if (element.is_comparable_default == '0') {
          element['selected'] = false;
          element['coulmn_name'] = element.column_name;
        }
        if (element.is_comparable_default == '1') {
          element['selected'] = true;
          element['coulmn_name'] = element.column_name;
          this.selectedMetrices.push(element);
        }
      });
    });
  }

  getAllMerticsData() {
    this.financialService.getMetricsList().subscribe((res: any) => {
      this.allMetrices = res;
      this.allMetrices.forEach((element: any) => {
        if (element.is_default == '0') {
          element['selected'] = false;
        }
        if (element.is_default == '1') {
          element['selected'] = true;
          this.selectedMetrices.push(element);
        }
      });
    });
  }

  selectMetricesFunction(data: any, i: any) {
    var index = this.selectedMetrices.findIndex(
      (ele2: any) => ele2.coulmn_name == data.coulmn_name
    );
    if (index > -1) {
      this.selectedMetrices.splice(index, 1);
      this.allMetrices[i].selected = false;
    } else {
      this.selectedMetrices.push(data);
      this.allMetrices[i].selected = true;
    }
  }

  transformWordFirstLetterToCapital(value: any) {
    return value.replaceAll('_', ' ').replace(/(\w+)/g, function (x: any) {
      return x[0].toUpperCase() + x.substring(1);
    });
  }

  removeFromList(data: any, i: any) {
    var index = this.allMetrices.findIndex(
      (ele2: any) => ele2.coulmn_name == data.coulmn_name
    );
    if (index > -1) {
      var index2 = this.selectedMetrices.findIndex(
        (ele2: any) => ele2.coulmn_name == data.coulmn_name
      );
      this.selectedMetrices.splice(index2, 1);
      this.allMetrices[index].selected = false;
    }
  }

  saveColumnOrder() {
    let body: any = {};
    body['user_id'] = '11';
    if (this.type == 'instrument') {
      this.selectedMetrices.forEach((element: any, index: any) => {
        body[element.coulmn_name] = index + 1;
      });
      this.financialService.saveUserMetrics(body).subscribe((res: any) => {
        this.auth.openPopupModal = false;
        this.metricsUpdated.emit(res);
      });
    } else if (this.type == 'comparable') {
      this.selectedMetrices.forEach((element: any, index: any) => {
        body[element.coulmn_name] = index + 1;
      });
      this.financialService
        .saveComparableMetrics(body)
        .subscribe((res: any) => {
          this.auth.openPopupModal = false;
          this.metricsUpdated.emit(res);
        });
    }
  }
}
