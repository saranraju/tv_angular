import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-commodity-table',
  templateUrl: './commodity-table.component.html',
  styleUrls: ['./commodity-table.component.scss'],
})
export class CommodityTableComponent implements OnInit {
  @Input() tableData: any;
  @Input() borderBottom: any;
  @Input() mh: any;
  @Input() idName: any;
  @Input() type: any;
  @Input() isDetailClick: boolean = false;
  @Output() detailClick = new EventEmitter();
  tabInstance: any;
  constructor(public util: UtilService, private router: Router) {}

  ngOnInit(): void {}

  detailRedirection(args: any) {
    if (this.isDetailClick) {
      this.detailClick.emit(args);
    }
  }

  listFormattedNext4Quarters() {
    let sDate = new Date();
    //Get the quarter of the current month
    var sQuarter = Math.floor((sDate.getMonth() + 3) / 3);

    var sYear = sDate.getFullYear();

    var quarterNames = ['Q1', 'Q2', 'Q3', 'Q4'];
    var quarterList = [];

    for (let i = 0; i < 4; i++) {
      quarterList.push(quarterNames[sQuarter - 1] + '/' + sYear);

      sQuarter++;

      if (sQuarter >= 4) {
        sQuarter = 1;
        sYear++;
      }
    }

    return quarterList;
  }
  globalMatrixList: any =[]
  redirectToInteractive(content: any) {
    let prevGlobalMatrixList = []
    prevGlobalMatrixList =  JSON.parse(localStorage.getItem('globalMatrixList') as any)
    if(prevGlobalMatrixList == null) prevGlobalMatrixList = []
    let commodityChartData = prevGlobalMatrixList.filter(
      (ele: any) => ele.type === 'commodityChartCustom'
    );
    if (commodityChartData.length > 0) {
      this.globalMatrixList = this.globalMatrixList;
    } else {
      prevGlobalMatrixList.push({
        name:content?.fieldName,
        type: 'commodityChartCustom',
        commodity:true
      });
      localStorage.setItem(
        'globalMatrixList',
        JSON.stringify(prevGlobalMatrixList)
      );
    }


    const url = this.router.serializeUrl(
      this.router.createUrlTree(['financialmarketdata/interactive-analysis'], {
        queryParams: {
          currency: 'USD',
          filter2: content.fieldName,
          comparableList: content.symbol,
          periodcity: 'YEARLY',
          tabFrom: 'commodity',
        },
      })
    );
    if (this.util.tabInstance != undefined) {
      this.util.tabInstance.close();
      this.util.tabInstance = window.open(url, '_blank');
    } else {
      this.util.tabInstance = window.open(url, '_blank');
    }
  }
}
