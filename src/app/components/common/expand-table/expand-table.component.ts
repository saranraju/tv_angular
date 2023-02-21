import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-expand-table',
  templateUrl: './expand-table.component.html',
  styleUrls: ['./expand-table.component.scss'],
})
export class ExpandTableComponent implements OnInit {
  @Input() tableData: any;
  @Input() childData: any;
  @Input() table_header: any;
  @Input() borderBottom: any;
  @Input() mh: any;
  @Input() none_css: any; // based on industry monitor value
  @Input() type: any; // based on industry monitor value
  @Input() industry_monitor: any;
  @Input() fontsize: any;
  @Input() overFlow: any;
  @Input() multisel: any;
  @Input() multiselleft: any;
  @Input() selectedCountry: any;
  @Input() industry_accordin: any;
  @Input() accor: any; // industy monitor;
  @Input() padding: any; //based on economy tables value
  @Input() selectedReg: any; // industy monitor;

  @Output() sendChildValue: EventEmitter<string> = new EventEmitter<string>();
  @Output() selectedRegion: EventEmitter<string> = new EventEmitter<string>();
  childValue: any = false;

  selectedPlus_icon: boolean = true;
  child_table_data: any = [];
  index: any;
  currentYear: any = new Date();
  year = this.currentYear.getFullYear();
  month = this.currentYear.getMonth();
  day = this.currentYear.getDate();
  nextYear = new Date(this.year + 1, this.month, this.day);
  constructor(public util: UtilService, private router: Router) {}

  ngOnInit(): void {}
  redirectToInteractive(content: any) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['financialmarketdata/interactive-analysis'], {
        queryParams: {
          currency: 'USD',
          countryName: this.selectedCountry.countryIsoCode3,
          type: 'indicator',
          indicatorName: content.category,
          indicatorPeriodcity: content.periodType,
          tabFrom: 'economy',
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
  show_plus_icon(child_data: any, i: any) {
    if (i == this.index) {
      if (this.selectedPlus_icon == false) {
        this.child_table_data = child_data;
        this.selectedPlus_icon = true;
      } else {
        this.child_table_data = [];
        this.selectedPlus_icon = false;
      }
    } else {
      this.index = i;
      this.child_table_data = child_data;
      this.selectedPlus_icon = true;
    }
  }

  show_plus_icon2(child_data: any, i: any) {
    if (i == this.index) {
      if (this.selectedPlus_icon == false) {
        this.child_table_data = child_data;
        this.selectedPlus_icon = true;
        this.sendChildValue.emit('false');
      } else {
        this.child_table_data = [];
        this.selectedPlus_icon = false;
        this.sendChildValue.emit('true');
      }
    } else {
      this.index = i;

      this.child_table_data = child_data;
      this.selectedPlus_icon = true;
      this.sendChildValue.emit('false');
    }
    this.selectedRegion.emit(this.accor);
  }
  indexOfSelect: any = [];
  indexOfSelect2: string[] = [];

  show_plus_icon3(child_data: any, i: any) {
    if (this.indexOfSelect.indexOf(i) == -1) {
      $('#chid' + i).removeClass('d-none');
      $('#btn-plus' + i).removeClass(' fa-plus');
      $('#btn-plus' + i).addClass(' fa-minus');
      this.indexOfSelect[i] = i;
    } else {
      $('#chid' + i).addClass('d-none');
      $('#btn-plus' + i).addClass(' fa-plus');
      $('#btn-plus' + i).removeClass(' fa-minus');
      this.indexOfSelect.splice(i, 1);
    }
  }
  show_plus_icon4(child_data: any, i: any) {
    if (this.indexOfSelect2.indexOf(i) == -1) {
      $('#chid1' + i).removeClass('d-none');
      $('#btn-plus1' + i).removeClass(' fa-plus');
      $('#btn-plus1' + i).addClass(' fa-minus');
      this.indexOfSelect2[i] = i;
    } else {
      $('#chid1' + i).addClass('d-none');
      $('#btn-plus1' + i).addClass(' fa-plus');
      $('#btn-plus1' + i).removeClass(' fa-minus');
      this.indexOfSelect2.splice(i, 1);
    }
  }
  nextPeriodHandler(period: any) {
    let newPeriod = new Date(period);
    let nextPeriod = new Date(
      newPeriod.getFullYear() + 1,
      newPeriod.getMonth(),
      newPeriod.getDate()
    );
    return nextPeriod;
  }
  nextToNextPeriodHandler(period: any) {
    let newPeriod = new Date(period);
    let nextToNextPeriod = new Date(
      newPeriod.getFullYear() + 2,
      newPeriod.getMonth(),
      newPeriod.getDate()
    );
    return nextToNextPeriod;
  }
}
