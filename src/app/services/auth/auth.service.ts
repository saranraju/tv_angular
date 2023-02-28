import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  $Isdatadownload = new EventEmitter();
  isdata: any = false;
  expriedPopup: boolean = false;
  openPopupModal: boolean = false;
  openPopupModalFin: boolean = false;
  openAdvancedSearch: boolean = false;
  openTermsModal: boolean = false;
  openRoundModal: boolean = false;
  openIPOModal: boolean = false;
  closeInsidePopup: boolean = false;
  expandopenPopupModal: boolean = false;
  expandopenPopupModalBalance: boolean = false;
  expandopenPopupModalCash: boolean = false;
  expandopenPopupModalRatio: boolean = false;
  expandopenPopupcolumn1: boolean = false;
  expandopenPopupcolumn2: boolean = false;
  expandopenPopupcolumn3: boolean = false;
  expandopenPopupestimate: boolean = false;
  expandopenPopupfinance1: boolean = false;
  expandopenPopupfinance2: boolean = false;
  expandopenPopupfinance3: boolean = false;
  expandopenPopupfinance4: boolean = false;
  expandopenPopupcompinfo: boolean = false;
  expandopenPopupPdfViewer: boolean = false;
  openIPONotesModal: boolean = false;
  expandopenPopupInsiderTransaction: boolean = false;
  managehistoryModal: boolean = false;
  expandopendfxmatrix: boolean = false;
  opendEditCustomMatrixmodal: boolean = false;
  expandopendfxmatrixTable: boolean = false;
  expandopendfxExpandTable: boolean = false;
  expandopendfxViewChart: boolean = false;
  expandopendFxIceDescChart: boolean = false;
  expandopendFxForwardPremiumChart: boolean = false;
  expandEstimateModal: boolean = false;
  openEntityDetailsModal: boolean = false;
  openPopupModalcompanySearch: boolean = false;
  expandManagementGuide: boolean = false;
  openEarningsModal: boolean = false;
  openUnavailableExploreModal: boolean = false;
  ipoNotesModalOne: boolean = false;
  companyBenchmarkModal: boolean = false;
  insiderTranactionModal: boolean = false;
  baseurl: any = environment.baseUrl;
  authBaseUrl: any = environment.authBaseUrl;
  openPopupModalcompanySearchPublic: boolean = false;
  expandViewPdf: boolean = false;
  showSavedScreensModal: any = false;
  showSavedScreensModal2: any = false;
  showScreenDeletionModal: any = false;
  showFxMatrixDeletionModal: any = false;
  openFinPeriodModal: boolean = false;
  showFormulaBuilderModal: any = false;
  showPEVCCompanyModal: any = false;
  showPEVCTabs: any = false;
  showNotListedPage: any = false;
  showFundPage: any = false;
  hidePublicCompany: any = false;
  checkPEVC: any = false;
  showPEVCCompanyModalFund: any = false;
  exploreUser: any = false;
  freeTrialAlert: any = false;
  userType: any = '';
  userId: any = null;
  constructor(private http: HttpClient) {}

  login(_input: any, options: any) {
    return this.http.post<any>(
      this.authBaseUrl + `/auth/login`,
      _input,
      options
    );
  }

  emailVerification(token: any, _input?: any) {
    return this.http.get<any>(
      this.authBaseUrl + `/auth/verify?token=${token}`,
      _input
    );
  }

  forgotPassword(email: any, _input: any) {
    return this.http.get<any>(
      this.authBaseUrl + `/auth/forget_password?email=${email}`,
      _input
    );
  }

  createSubscribeUser(_input: any) {
    return this.http.post<any>(this.authBaseUrl + `/auth/subscribe`, _input);
  }

  createDemoUser(_input: any) {
    return this.http.post<any>(
      this.authBaseUrl + `/auth/signupAsDemoUser`,
      _input
    );
  }

  getExploreData(_input: any) {
    return this.http.post<any>(this.authBaseUrl + `/auth/explore`, _input);
  }
  siginUpAsADemoUser(value: any) {
    return this.http.post(this.authBaseUrl + `/auth/signupAsDemoUser`, value);
  }
  resetPassword(value: any) {
    return this.http.put(this.authBaseUrl + `/auth/reset_password`, value);
  }
  demoRequestPost(value: any) {
    return this.http.post(this.authBaseUrl + `/auth/demo_request`, value);
  }
  getCountriesData() {
    return this.http.get(this.authBaseUrl + `/auth/countries`);
  }
  getSubscribeCountryPlanList() {
    return this.http.get(this.authBaseUrl + `/auth/getCountryPlans`);
  }
  getSubscribeRegionPlanList() {
    return this.http.get(this.authBaseUrl + `/auth/getRegionPlans`);
  }
  IsdataDownload() {
    this.isdata = true;
    this.$Isdatadownload.emit(this.isdata);
  }
}
