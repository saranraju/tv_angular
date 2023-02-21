import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FinancialMarketDataService } from 'src/app/services/financialmarketdata.service';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Params } from '@angular/router';

declare const TradingView: any;

@Component({
  selector: 'app-fixed-income',
  templateUrl: './fixed-income.component.html',
  styleUrls: ['./fixed-income.component.scss'],
})
export class FixedIncomeComponent implements OnInit, OnDestroy {
  constructor(
    public auth: AuthService,
    private financialDataService: FinancialMarketDataService,
    private activateRoute: ActivatedRoute
  ) {}
  // Env variable
  phase_two_bonds_base_url: any = environment.phase_two_bonds_base_url;

  // Header Data structure
  tabactive: any;
  pageActiveFixedIncome: any = 5;
  pageActiveExpandTable: any = 5;
  pageActiveComparable: any = 5;

  // For template value
  templateNames: any = [];
  selectedTemplate: any = '';

  //For Default things
  isDefault: boolean = true;
  defaultName: string = '';

  //For instrument value
  instrumentLists: any = [];
  selectedinstrument: any = '';

  editInstrumentLists: any = [];
  selectedEditInstrument: any = '';
  isEdit: boolean = false;

  // For right end dropdown value check
  isInstruments: any = false;

  //expand data table in same page
  isExpandTable: boolean = true;

  //For header tab
  headerTabs: any = [];

  //For below property pagination
  parentTablPaginationArray = [
    {
      value: 5,
    },
    {
      value: 10,
    },
    {
      value: 25,
    },
    {
      value: 50,
    },
  ];
  childTablPaginationArray = [
    {
      value: 50,
    },
    {
      value: 100,
    },
    {
      value: 250,
    },
    {
      value: 500,
    },
  ];

  //Data Strucure for Table
  tableDataHeader: any = [
    {
      width: 'auto',
      label: 'Instrument Name',
      field: 'instrument_name',
    },
    {
      width: 'auto',
      label: 'Last Price',
      field: 'last_price',
    },
    {
      width: 'auto',
      label: '1 Day Change (%)',
      field: 'one_day_change',
    },
    {
      width: 'auto',
      label: '1 Week Change (%)',
      field: 'one_week_change',
    },
    {
      width: 'auto',
      label: 'Issuer Name',
      field: 'issuer_name',
    },
    {
      width: 'auto',
      label: 'Industry',
      field: 'industry',
    },
    {
      width: 'auto',
      label: 'Country',
      field: 'country',
    },
    {
      width: 'auto',
      label: 'Yield to Maturity (%)',
      field: 'yield_to_maturity',
    },
    {
      width: 'auto',
      label: 'Modified Duration (Years)',
      field: 'modified_duration',
    },
  ];
  tableData: any = [];

  //After clicking the instrument data for Table
  detailsDataHeader: any = [
    {
      width: 'auto',
      label: 'Metric',
      field: 'title',
    },
    {
      width: 'auto',
      label: '1 Day Prior',
      field: 'oneDayPrior',
    },
    {
      width: 'auto',
      label: '1 Week Prior',
      field: 'oneWeekPrior',
    },
    {
      width: 'auto',
      label: '1 Month Prior',
      field: 'oneDayPrior',
    },
    {
      width: 'auto',
      label: '1 Year Prior',
      field: 'oneYearPrior',
    },
  ];

  queryParamSection: any = null;

  //for All Instrument Characteristics
  allInstrumentCharacteristics: any;

  expandDataTable: any = [];

  // comparable unique data
  comparableUnique: any = [];

  // ModelInstrument Data
  modelInstrumentData: any;

  ngOnInit(): void {
    this.activateRoute.queryParams.subscribe((params: Params) => {
      this.queryParamSection = params['tabSection'];
    });
    this.connect();
    if (this.queryParamSection == null) this.getAllTemplate();
    this.getComparableList();
    this.getEditComparableList();
    this.getAllInstrumentCharacteristics();
    this.getInstrumentModel();
  }

  ngOnDestroy(): void {
    if (this.ws.connected) this.ws.disconnect();
  }

  ws: any;
  name: any;
  disabled: any;
  newWebSocketRes: any;

  connect() {
    //connect to stomp where stomp endpoint is exposed
    let socket = new SockJS(`${this.phase_two_bonds_base_url}/bonds-socket`);
    this.ws = Stomp.over(socket);
    let that = this;
    this.ws.connect(
      {},
      function (frame: any) {
        that.ws.subscribe('/errors', function (message: any) {
          console.log('Error ' + message);
        });
        if (that.queryParamSection == 'ExpandTable') {
          let regionId = localStorage.getItem('regionDetailId');
          let instrumentId = localStorage.getItem('instrumentDetailId');
          let expandTitle = localStorage.getItem('expandTitle');
          that.expandTableInside(regionId, instrumentId, expandTitle);
        }
        if (that.queryParamSection == 'instrumentDetails') {
          that.detailIntrumentSocket();
        }
      },
      function (error: any) {
        console.log('STOMP error ' + error);
      }
    );
  }

  isInstrumentRegionCustomID: any = null;
  regionWebSocket(message: any) {
    this.isInstrumentRegionCustomID = message.headers.subscription;
    this.tableData = JSON.parse(message.body);
    console.log('Region***', this.tableData);
  }

  instrumentWebSocket(message: any) {
    this.isInstrumentRegionCustomID = message.headers.subscription;
    this.tableData = JSON.parse(message.body);
    console.log('Instrument***', this.tableData);
  }

  customWebSocket(message: any) {
    this.isInstrumentRegionCustomID = message.headers.subscription;
    let totalLength = JSON.parse(message.body).length;
    let temp: any = {};
    temp['headers'] = JSON.parse(message.body)[totalLength - 1]['headers'];
    let bodydata: any = [];
    JSON.parse(message.body).forEach((element: any, index: any) => {
      if (index < totalLength - 1) {
        bodydata.push(element);
      }
    });
    temp['body'] = bodydata;
    this.tableData = [temp];
    console.log('custom***', this.tableData);
  }

  detailInstrumentSocketID: any;
  comparableInstrumentWebSocket(message: any) {
    this.detailInstrumentSocketID = message.headers.subscription;
    this.comparableUnique = JSON.parse(message.body)[0];
    this.comparableDataMapping();
    console.log('comparable instruments***', this.comparableUnique);
  }

  TemplateRefresh(event: any) {
    this.auth.closeInsidePopup = false;
    this.getAllTemplate();
  }

  getAllTemplate() {
    let templateName: any = [];
    this.financialDataService.getAllTemplate().subscribe((res: any) => {
      this.selectedTemplate = res[0].id;
      res.forEach((element: any) => {
        templateName.push({
          id: element.id,
          text: element.template_name,
        });
        this.templateNames = templateName;
      });
      if (this.templateNames[0].text == 'instrument') {
        this.financialDataService.getAllInstrument().subscribe((res: any) => {
          this.headerTabs = res;
          this.getInitialInstrumentData();
        });
      } else if (this.templateNames[0].text == 'region') {
        this.financialDataService.getRegion().subscribe((res: any) => {
          this.headerTabs = res;
          this.getInitialRegionData();
        });
      }
    });
  }

  // For Instruments
  getInitialInstrumentData() {
    let that = this;
    that.ws.subscribe(
      '/bonds/instrument-type/get-instrument-template',
      function (message: any) {
        that.instrumentWebSocket(message);
      }
    );
    that.ws.send(`/app/instrument-template/get`, {}, {});
  }

  getInitialRegionData() {
    let that = this;
    that.ws.subscribe(
      '/bonds/region/get-region-template',
      function (message: any) {
        that.regionWebSocket(message);
      }
    );
    that.ws.send(`/app/region-template/get`, {}, {});
  }

  getComparableList() {
    let templateName: any = [];
    this.financialDataService.getComparableList().subscribe((res: any) => {
      res.forEach((element: any) => {
        templateName.push({
          id: element.id,
          text: element.instrument_name,
        });
        this.instrumentLists = templateName;
      });
    });
  }

  getEditComparableList() {
    let templateName: any = [];
    this.financialDataService.getEditComparableList().subscribe((res: any) => {
      res.forEach((element: any) => {
        templateName.push({
          id: element[0],
          text: element[1],
        });
        this.editInstrumentLists = templateName;
      });
    });
  }

  type: any;
  existingHeader: any;
  isDetail: boolean = false;
  openColumnEditModel(type: any) {
    this.type = type;
    if (type == 'comparable') {
      this.isDetail = true;
      this.existingHeader = this.comparableUnique.headers[0];
    } else if (type == 'instrument') {
      this.existingHeader = this.dragDropHeader;
    }
    this.auth.openPopupModal = true;
  }

  // For Instruments
  getAllDatasInstrumentData(body?: any) {
    let that = this;
    that.ws.subscribe(
      `/bonds/template/get/instrument-type-data/${body.templateId}/${
        body.instrumentTypeId
      }/${11}`,
      function (message: any) {
        that.instrumentWebSocket(message);
      }
    );
    that.ws.send(
      `/app/instrument-type-data/get/${body.templateId}/${
        body.instrumentTypeId
      }/${11}`,
      {},
      {}
    );
  }

  // // For regions
  getAllDatasRegionData(body: any) {
    let that = this;
    that.ws.subscribe(
      `/bonds/template/get/region-data/${body.templateId}/${
        body.regionId
      }/${11}`,
      function (message: any) {
        that.regionWebSocket(message);
      }
    );
    that.ws.send(
      `/app/region-data/get/${body.templateId}/${body.regionId}/${11}`,
      {},
      {}
    );
  }

  // For custom
  getAllDatasCustomData(id: any) {
    let that = this;
    that.ws.subscribe(
      `/bonds/template/get/custom-template/${id}`,
      function (message: any) {
        that.customWebSocket(message);
      }
    );
    that.ws.send(`/app/custom-template-data/get/${id}`, {}, {});
  }

  // Detail page Expand model API
  getInstrumentModel() {
    this.financialDataService
      .getAllInstrumentsForModel()
      .subscribe((res: any) => {
        this.modelInstrumentData = res[0];
      });
  }

  valueChangeHandler(type: any, data: any) {
    this.tabactive = '';
    // This one for template dropdown
    if (type === 'template') {
      if (this.isInstrumentRegionCustomID != null)
        this.ws.unsubscribe(this.isInstrumentRegionCustomID);

      if (this.templateNames && this.selectedTemplate !== data) {
        this.selectedTemplate = data;

        // For getting templatename and then store local variable
        let temp: any;
        this.templateNames.forEach((element: any) => {
          if (element.id == data) {
            temp = element;
            this.defaultName = element.text;
          }
        });
        // If the type is instrument then trigger this one
        if (temp.text == 'instrument') {
          this.isDefault = true;
          this.financialDataService.getAllInstrument().subscribe((res: any) => {
            this.headerTabs = res;
            this.getInitialInstrumentData();
          });
        }
        // If the type is region then trigger this one
        else if (temp.text == 'region') {
          this.isDefault = true;
          this.financialDataService.getRegion().subscribe((res: any) => {
            this.headerTabs = res;
            this.getInitialRegionData();
          });
        }
        // If the type is cutom one then trigger this one
        else {
          this.isDefault = false;
          this.getAllDatasCustomData(temp.id);
        }
      }
    }
    // This one for right side nearby advance search instrument dropdown
    if (type === 'instrument') {
      if (this.instrumentLists && this.selectedinstrument !== data) {
        if (this.detailInstrumentSocketID != null)
          this.ws.unsubscribe(this.detailInstrumentSocketID);
        this.selectedinstrument = data;

        localStorage.setItem('instrumentSelected', this.selectedinstrument);
        // For refresh
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('tabSection', 'instrumentDetails');
        (window as any).location.search = urlParams;
      }
    }
    // Edit comparable list
    if (type == 'editComparableList') {
      if (this.editInstrumentLists && this.selectedEditInstrument !== data) {
        this.selectedEditInstrument = data;
        let temp: any = [];
        temp.push({
          templateDataId: this.selectedEditInstrument,
          status: 1,
        });
        this.comparableUnique.body.forEach((element: any) => {
          temp.push({
            templateDataId: element.id,
            status: 1,
          });
        });
        this.financialDataService.comprableEdit(temp).subscribe((res: any) => {
          this.financialDataService
            .getComparableListUnique(this.selectedinstrument)
            .subscribe((res: any) => {
              this.comparableUnique = res[0];
              this.comparableDataMapping();
              this.toggleInstrumentView();
            });
        });
      }
    }
  }

  detailIntrumentSocket() {
    this.isInstruments = true;
    this.selectedinstrument = JSON.parse(
      localStorage.getItem('instrumentSelected') as any
    );
    this.toggleInstrumentView();
    // For Comparable instruments
    let that = this;
    that.ws.subscribe(
      `/bonds/instrument-type/get-default-comparable-bonds-list/${this.selectedinstrument}`,
      function (message: any) {
        that.comparableInstrumentWebSocket(message);
      }
    );
    that.ws.send(
      `/app/comparable-bonds-data/get/${this.selectedinstrument}`,
      {},
      {}
    );
  }

  timer: any = null;
  headerTabFucntion(e: any) {
    this.tabactive = e;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      if (this.isInstrumentRegionCustomID != null)
        this.ws.unsubscribe(this.isInstrumentRegionCustomID);

      // For getting templatename and then store local variable
      let temp: any;
      this.templateNames.forEach((element: any) => {
        if (element.id == this.selectedTemplate) {
          temp = element;
        }
      });
      // If the type is instrument then trigger this one
      if (temp.text == 'instrument') {
        this.isDefault = true;
        let body = {
          templateId: temp.id,
          instrumentTypeId: this.tabactive,
        };
        this.getAllDatasInstrumentData(body);
      }
      // If the type is region then trigger this one
      else if (temp.text == 'region') {
        this.isDefault = true;
        let body = {
          templateId: temp.id,
          regionId: this.tabactive,
        };
        this.getAllDatasRegionData(body);
      }
      // If the type is cutom one then trigger this one
      else {
        this.isDefault = false;
        this.getAllDatasCustomData(temp.id);
      }
    }, 500);
  }

  removeEditComparableData(value: any) {
    this.financialDataService.comprableEdit(value).subscribe((res: any) => {
      this.financialDataService
        .getComparableListUnique(this.selectedinstrument)
        .subscribe((res: any) => {
          this.comparableUnique = res[0];
          this.comparableDataMapping();
          this.toggleInstrumentView();
        });
    });
  }

  editComparableReset() {
    this.financialDataService.restEditComparableList().subscribe((res: any) => {
      this.financialDataService
        .getComparableListUnique(this.selectedinstrument)
        .subscribe((res: any) => {
          this.comparableUnique = res[0];
          this.comparableDataMapping();
          this.toggleInstrumentView();
        });
    });
  }

  getAllInstrumentCharacteristics() {
    this.financialDataService
      .getAllInstrumentCharacteristics()
      .subscribe((res: any) => {
        this.allInstrumentCharacteristics = res[0];
      });
  }

  comparableDataMapping() {
    let sortedHeader: any = [];
    Object.entries(this.comparableUnique.headers[0]).forEach((el: any) => {
      sortedHeader.push({
        label: el[0].replaceAll('_', ' '),
        field: el[0],
        position: el[1],
      });
    });
    sortedHeader.sort((a: any, b: any) => a.position - b.position);
    this.comparableUnique.headers[0] = sortedHeader;
  }

  deleteTemplate(id: any) {
    this.financialDataService.deleteTemplate(id).subscribe(
      (res: any) => {
        window.location.search = '';
      },
      (error) => {
        window.location.search = '';
      }
    );
  }

  editTemplateId: any;
  createEditTemplate(id?: any, isEdit?: any) {
    if (isEdit) this.editTemplateId = id;
    this.auth.closeInsidePopup = true;
  }

  refreshTableData(event: any) {
    if (event == true) {
      this.getAllTemplate();
    }
  }

  refreshMetricsData(event: any) {
    if (this.type == 'comparable') {
      this.financialDataService
        .getComparableListUnique(this.selectedinstrument)
        .subscribe((res: any) => {
          this.comparableUnique = res[0];
          this.comparableDataMapping();
          this.toggleInstrumentView();
        });
    } else if (this.type == 'instrument') {
      this.dragDropHeader = [event.sort_order];
    }
  }

  toggleInstrumentView() {
    this.isInstruments = true;
    if (this.isInstruments == true) {
      setTimeout(() => {
        new TradingView.widget({
          autosize: true,
          symbol: 'NASDAQ:AAPL',
          timezone: 'Etc/UTC',
          theme: 'Dark',
          style: '1',
          locale: 'en',
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          withdateranges: true,
          range: 'ytd',
          hide_side_toolbar: false,
          allow_symbol_change: true,
          show_popup_button: true,
          popup_width: '1000',
          popup_height: '650',
          no_referral_id: true,
          container_id: 'tradingview_bac65',
        });
      });
    }
  }

  onPaginationClicked(e: any, type: any) {
    if (type == 'Comparable') {
      this.pageActiveComparable = e;
    } else if (type == 'fixed-income') {
      this.pageActiveFixedIncome = e;
    } else if (type == 'expand-table') {
      this.pageActiveExpandTable = e;
      if (this.expandTableID != null) this.ws.unsubscribe(this.expandTableID);
      let regionId = localStorage.getItem('regionDetailId');
      let instrumentId = localStorage.getItem('instrumentDetailId');
      this.getAllTableData(
        regionId,
        instrumentId,
        1,
        this.pageActiveExpandTable
      );
    }
  }

  dragDropHeader: any = [];
  detailTitle: any;
  expandTableMethod(tableData?: any, title?: any) {
    if (this.expandTableID != null) this.ws.unsubscribe(this.expandTableID);
    localStorage.setItem('regionDetailId', tableData[0].region_id);
    localStorage.setItem('instrumentDetailId', tableData[0].instrument_type_id);
    localStorage.setItem('expandTitle', title);
    // For refresh
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('tabSection', 'ExpandTable');
    (window as any).location.search = urlParams;
  }

  expandTableInside(regionId: any, instrumentId: any, expandTitle: any) {
    this.isExpandTable = false;
    this.pageActiveExpandTable = 50;
    this.detailTitle = expandTitle;
    this.getAllTableData(regionId, instrumentId, 1, 50);
  }

  goBack() {
    window.location.search = '';
  }

  // For detail table websocket
  getAllTableData(
    regionId: any,
    instrumentId: any,
    offset: any,
    pageSize: any
  ) {
    let that = this;
    that.ws.subscribe(
      `/bonds/instrument-type/get-table-data/${regionId}/${instrumentId}/${offset}/${pageSize}`,
      function (message: any) {
        that.allTableWebSocket(message);
      }
    );
    that.ws.send(
      `/app/get-table-data/get/${regionId}/${instrumentId}/${offset}/${pageSize}`,
      {},
      {}
    );
  }

  expandTableID: any = null;
  allTableWebSocket(message: any) {
    this.expandTableID = message.headers.subscription;
    let temp = JSON.parse(message.body);
    console.log('temp****', temp);
    this.dragDropHeader = temp[0].headers;
    this.expandDataTable = temp[0].body[0]?.values;
  }

  changePage(event: any) {
    if (this.expandTableID != null) this.ws.unsubscribe(this.expandTableID);
    let regionId = localStorage.getItem('regionDetailId');
    let instrumentId = localStorage.getItem('instrumentDetailId');
    this.getAllTableData(regionId, instrumentId, event, 50);
  }

  calculateSuccessRate(value: any) {
    let succesRate = 100 - (value.decline / value.total) * 100;
    return `${succesRate}%`;
  }

  calculateFailureRate(value: any) {
    let succesRate = 100 - (value.advance / value.total) * 100;
    return `${succesRate}%`;
  }
}
