import {
  Component,
  DoCheck,
  EventEmitter,
  Input,
  OnInit,
  Output,
  HostListener,
} from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FinancialMarketDataService } from 'src/app/services/financialmarketdata.service';

import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-forex-expand-table-modal',
  templateUrl: './forex-expand-table-modal.component.html',
  styleUrls: ['./forex-expand-table-modal.component.scss'],
})
export class ForexExpandTableModalComponent implements OnInit {
  @Input() tableData: any;
  @Input() tableDataHeader: any;
  @Input() sort: any;
  @Input() pagination: any;
  @Input() totalResultCount: any;
  @Input() headerBorder: any;
  @Input() bottomBorder: any;
  @Input() height: any;
  @Input() OTCorEnergy: any;
  @Input() tableType: any;
  @Input() type: any;
  @Input() homeData: any = false;
  @Input() expandMatrixHeader: any = false;
  @Input() currentPageSelected: any;
  @Input() paginateId: any;
  @Input() loadingForexTable: any;
  @Input() fxMatrixFlag: any;
  @Input() customMatrixdropdownData: any;
  @Input() customMatrixDropdownValue: any;
  @Input() currency_data: any;
  @Input() fxMatrixName: any;
  @Input() editMatrixDataid: any;

  @Input() tableDataLength: any;
  @Output() commodityData = new EventEmitter();
  @Output() changePage = new EventEmitter<any>();
  @Output() onForexDataClick = new EventEmitter<any>();
  @Output() onCustomeMatrixDropdownChange = new EventEmitter<any>();
  @Output() onSelectedCurrencyData = new EventEmitter<any>();

  labels: any = {
    previousLabel: '◄',
    nextLabel: '►',
  };
  expandcustomMatrixdropdownData: any = [];
  activefxMatrixDropDown: boolean = false;
  buttonTwo: any = 1;
  tablPaginationArray = [
    {
      id: 10,
      text: '10',
    },
    {
      id: 25,
      text: '25',
    },
    {
      id: 50,
      text: '50',
    },
  ];

  iconIndex: any = 0;
  shortDown: boolean = false;
  shortUp: boolean = false;

  constructor(
    public auth: AuthService,
    public util: UtilService,
    public financialMarketData: FinancialMarketDataService
  ) {}

  @HostListener('document:click', ['$event']) onDocumentClick(event: any) {
    this.childNodeToggle(2, event);
    event.stopPropagation();
  }

  ngOnInit(): void {
    this.expandcustomMatrixdropdownData = this.customMatrixdropdownData;
  }
  fxmatrixDialogClose() {
    this.auth.expandopendfxExpandTable = false;
    this.auth.expandopendfxmatrix = false;
    this.auth.expandopendfxmatrixTable = false;
  }

  sortByKey(key: any, i: any) {
    this.iconIndex = i;
    this.shortDown = !this.shortDown;
    return this.tableData.sort((a: any, b: any) => {
      var x = a[key];
      var y = b[key];
      if (this.shortDown == true) {
        return x < y ? 1 : x > y ? -1 : 0;
      } else {
        return x < y ? -1 : x > y ? 1 : 0;
      }
    });
  }

  commodityEmitData(event: any) {
    if (this.type == 'forex') {
      this.onForexDataClick.emit(event);
    } else {
      // if (index == 0) {
      //   event['OTCorEnergy'] = this.OTCorEnergy;
      //   this.commodityData.emit(event);
      // }
    }
  }

  // onCurrencyChangedFn(id: any, e: any) {
  //   new this.onCurrencyChanged({id, e});
  // }

  onPageChange(event: any) {
    this.tableData.length = 0;
    this.currentPageSelected = event;
    this.changePage.emit(event);
  }

  onCustomMatrixDropdownChange(data: any) {
    this.customMatrixDropdownValue = data.text;
    this.onCustomeMatrixDropdownChange.emit(data);
  }

  childNodeToggle(id: any, event: any) {
    this.expandcustomMatrixdropdownData = this.customMatrixdropdownData;
    if (id == 1) {
      this.activefxMatrixDropDown = !this.activefxMatrixDropDown;
      event.stopPropagation();
    } else {
      this.activefxMatrixDropDown = false;
    }
  }
  onEditSelectedCurrencySave(e: any) {
    this.onSelectedCurrencyData.emit(e);
  }
  searchMatrixDropdown(e: any) {
    if (e.target.value) {
      this.expandcustomMatrixdropdownData =
        this.customMatrixdropdownData.filter((item: any) =>
          item.text.toLowerCase().includes(e.target.value.toLowerCase())
        );
    }
  }

  editCustomMatrixName: any;
  handleCustomEditCLick(data: any, e: any) {
    e.stopPropagation();
    this.auth.opendEditCustomMatrixmodal = true;
    this.editCustomMatrixName = data.id;
    this.getEditCustomMatrixData(data.id);
  }

  editMatrixDataId: any;
  getEditCustomMatrixData(params: any) {
    this.financialMarketData.getEditCustomMatrixData(params).subscribe(
      (res: any) => {
        this.editMatrixDataId = res;
      },
      (err) => {
        console.error(err);
      }
    );
  }
}
