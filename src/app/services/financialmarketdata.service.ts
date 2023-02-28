import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class FinancialMarketDataService {
  headers: HttpHeaders | any;
  options: any;
  baseurl: any = environment.baseUrl;
  pahseTwoBaseURL: any = environment.phase_two_base_url_ipo;
  forexUrl: any = environment.forexUrl;
  phase_two_bonds_base_url: any = environment.phase_two_bonds_base_url;
  phase_two_commodity_base_url: any = environment.phase_two_commodity_base_url;
  phase_two_base_url: any = environment.phase_two_base_url;
  phase_two_pevc_base_url: any = environment.phase_two_pevc_base_url;
  screenerTwoBaseUrl: any = environment.screenerTwoBaseUrl;
  phase_three_watchlist_base_url: any =
    environment.phase_three_watchlist_base_url;

  authBaseUrl: any = environment.authBaseUrl;
  advanceSearch: any = environment.advanceSearch;
  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({
      Accept: 'text/html',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type, Accept',
      'Content-Type':
        'application/json, text/html,multipart/form-data; boundary=something',
    });
    this.options = { headers: this.headers };
  }

  //logout user
  logoutUser(email: any) {
    return this.http.post(this.baseurl + `/user/logout?email=${email}`, '');
  }

  // isAllowToExcel
  isAllowToExcelDownload(period: any, companyId: any, userId: any) {
    return this.http.get<any>(
      this.baseurl +
        `/user/isAllowToExcel?periodicity=${period}&userId=${userId}&downloadDetails=${companyId}_${period}&module=COMPANY_PROFILE&section=MANAGEMENT_GUIDANCE`
    );
  }

  // Derivatives Page
  getDerivativesNameData() {
    return this.http.get<any>(this.baseurl + `/derivative/derivative-name`);
  }

  getDerivativeNameSearchData(searchTerm: any) {
    return this.http.get<any>(
      this.baseurl + `/derivative/derivative-name?searchCriteria=${searchTerm}`
    );
  }

  getDerivativesSettlementDateData(name: any, assetType: any) {
    return this.http.get<any>(
      this.baseurl +
        `/derivative/expiryDate?derivativeName=${name.replaceAll(
          '&',
          '%26'
        )}&category=${assetType}`
    );
  }

  getDerivativesOptionsData(name: any, date: any) {
    return this.http.get<any>(
      this.baseurl +
        `/derivative/derivativeOptionType?derivativeName=${name.replaceAll(
          '&',
          '%26'
        )}&category=Options&expiryDate=${date}`
    );
  }

  getDerivativesFutureComparableData(identifier: any) {
    return this.http.get<any>(
      this.baseurl + `/derivative/futureComparable?identifier=${identifier}`
    );
  }

  getDerivativesStrikePriceData(name: any, date: any, type: any) {
    return this.http.get<any>(
      this.baseurl +
        `/derivative/strikePrice?derivativeName=${name.replaceAll(
          '&',
          '%26'
        )}&category=Options&expiryDate=${date}&optionType=${type}`
    );
  }

  getDerivativesAllData(identifier: any) {
    return this.http.get<any>(
      this.baseurl + `/derivative/derivativeData?identifier=${identifier}`
    );
  }

  getDerivativesOptionComparableData(identifier: any) {
    return this.http.get<any>(
      this.baseurl + `/derivative/optionComparable?identifier=${identifier}`
    );
  }

  // Transactions Page
  getTransactionsCountryData() {
    return this.http.get<any>(this.baseurl + `/mna/countries`);
  }

  getTransactionsIndustryData(country: any) {
    return this.http.get<any>(
      this.baseurl + `/mna/ticsindustry?countryCode=${country}`
    );
  }

  getTransactionsCurrencyData() {
    return this.http.get<any>(this.baseurl + `/economy/currency/`);
  }

  getTransactionsTopDealMakersData(
    country: any,
    industry: any,
    startDate: any,
    endDate: any,
    currency: any,
    rowOffset: any,
    sortType: any
  ) {
    return this.http.get<any>(
      this.baseurl +
        `/mna/topDealMaker?country=${country}&industry=${industry}&periodStart=${startDate}&periodEnd=${endDate}&currency=${currency}&rowOffset=${rowOffset}&rowCount=10&sortingColumn=${sortType}&sortingType=desc`
    );
  }

  getTransactionsDealsHistory(entityId: any, currency: any) {
    return this.http.get<any>(
      this.baseurl + `/mna/Companies/${entityId}/allDeal?currency=${currency}`
    );
  }

  getTransactionsCompanyData() {
    return this.http.get<any>(this.baseurl + `/companies`);
  }

  getMNATransactionsCompanyData() {
    return this.http.get<any>(this.baseurl + `/mna/companies`);
  }

  getMNATransactionsCompanySearchData(searchTerm: any) {
    return this.http.get<any>(
      this.baseurl + `/mna/companies?searchCriteria=${searchTerm}`
    );
  }

  getTransactionsCompanySearchData(searchTerm: any) {
    return this.http.get<any>(
      this.baseurl + `/pevc/company?searchCriteria=${searchTerm}`
    );
  }

  getTransactionsCompanySearchDataBenchmark(searchTerm: any) {
    return this.http.get<any>(
      this.baseurl + `/companies?searchCriteria=${searchTerm}`
    );
  }

  getTermsSynopsisData(dealId: any, currency: any, entityId: any) {
    return this.http.get<any>(
      this.baseurl +
        `/mna/dealTermSynopsis?dealId=${dealId}&currency=${currency}&entityId=${entityId}`
    );
  }

  getMNATopDealMakersExcelDownload(
    country: any,
    industry: any,
    startDate: any,
    endDate: any,
    currency: any
  ) {
    return this.http.post(
      this.baseurl +
        `/mna/topDealMakerDownload?country=${country}&industry=${industry}&periodStart=${startDate}&periodEnd=${endDate}&currency=${currency}&rowCount=1000&sortingColumn=total_deals&sortingType=desc`,
      {},
      { responseType: 'blob', observe: 'response' }
    );
  }

  getMNAHistoryExcelDownloadData(
    entityId: any,
    currency: any,
    startDate: any,
    endDate: any
  ) {
    return this.http.post(
      this.baseurl +
        `/mna/dealHistroyDownload?entityId=${entityId}&currency=${currency}&startDate=${startDate}&endDate=${endDate}`,
      {},
      { responseType: 'blob', observe: 'response' }
    );
  }

  getTermsSynopsisExcelDownloadData(dealId: any, currency: any, entityId: any) {
    return this.http.post(
      this.baseurl +
        `/mna/dealTermSynopsisDownload?dealId=${dealId}&currency=${currency}&entityId=${entityId}`,
      {},
      { responseType: 'blob', observe: 'response' }
    );
  }

  getTransactionsPEVCCountryData() {
    return this.http.get<any>(this.baseurl + `/pevc/countries`);
  }

  getTransactionsPEVCFundingChartData(
    currency: any,
    country: any,
    startDate: any,
    endDate: any
  ) {
    return this.http.get<any>(
      this.baseurl +
        `/pevc/summary/sectorCharts?countryIsoCode=${country}&startDate=${startDate}&endDate=${endDate}&currency=${currency}`
    );
  }

  getTransactionsPEVCCountryChartData(
    currency: any,
    country: any,
    startDate: any,
    endDate: any
  ) {
    return this.http.get<any>(
      this.baseurl +
        `/pevc/summary/countryChart?countryIsoCode=${country}&startDate=${startDate}&endDate=${endDate}&currency=${currency}`
    );
  }

  getTransactionsPEVCTopFundedCompanies(
    currency: any,
    country: any,
    startDate: any,
    endDate: any
  ) {
    return this.http.get<any>(
      this.baseurl +
        `/pevc/topFundedCompanies?countryIsoCode=${country}&startDate=${startDate}&endDate=${endDate}&currency=${currency}&limit=100`
    );
  }

  getTransactionsAdvSearchFinTypeData() {
    return this.http.get<any>(this.baseurl + `/pevc/financialtype`);
  }

  getTransactionsPEVCIndustryData(country: any, startDate: any, endDate: any) {
    return this.http.get<any>(
      this.baseurl +
        `/pevc/industry?countryCode=${country}&startDate=${startDate}&endDate=${endDate}`
    );
  }

  getTransactionsPEVCSearchCompanyData() {
    return this.http.get<any>(this.baseurl + `/pevc/company`);
  }

  getEventTranscriptModalData(id: any, title: any) {
    return this.http.get<any>(
      this.baseurl + `/transcript?reportId=${id}&fileName=${title}`
    );
  }

  getTransactionsFundingDetailsData(
    country: any,
    industry: any,
    startDate: any,
    endDate: any,
    currency: any,
    finType: any,
    entityId: any = null
  ) {
    return this.http.get<any>(
      this.baseurl +
        `/pevc/allFundingDetail?country=${country}&industry=${industry}&periodStart=${startDate}&periodEnd=${endDate}&currency=${currency}&financingType=${finType}&entityId=${entityId}&rowOffset=0&rowCount=3000&sortingColumn=inception_date&sortingType=desc`
    );
  }

  getTransactionsFundingDetailsCompanySearchData(
    country: any,
    industry: any,
    startDate: any,
    endDate: any,
    currency: any,
    finType: any,
    entityId: any,
    rowOffset: any
  ) {
    return this.http.get<any>(
      this.baseurl +
        `/pevc/allFundingDetail?country=${country}&industry=${industry}&periodStart=${startDate}&periodEnd=${endDate}&currency=${currency}&financingType=${finType}&entityId=${entityId}&rowOffset=${rowOffset}&rowCount=10&sortingColumn=inception_date&sortingType=desc`
    );
  }

  getTransactionsFundingInvestmentListData(
    startDate: any,
    endDate: any,
    currency: any,
    finType: any,
    entityId: any
  ) {
    return this.http.get<any>(
      this.baseurl +
        `/pevc/fundingInvestmentList?periodStart=${startDate}&periodEnd=${endDate}&currency=${currency}&financingType=${finType}&entityId=${entityId}&advisorType=`
    );
  }

  getTransactionsFundingRoundData(
    round: any,
    endDate: any,
    startDate: any,
    entityId: any,
    finType: any,
    currency: any
  ) {
    return this.http.get<any>(
      this.baseurl +
        `/pevc/fundingDetail?category=${round}&endDate=${endDate}&startDate=${startDate}&entityId=${entityId}&financialType=${finType}&currencyCode=${currency}`
    );
  }

  getPEVCFundingSummaryExcelDownload(
    country: any,
    startDate: any,
    endDate: any,
    currency: any
  ) {
    return this.http.post(
      this.baseurl +
        `/pevc/summary/download?countryIsoCode=${country}&startDate=${startDate}&endDate=${endDate}&currency=${currency}`,
      {},
      { responseType: 'blob', observe: 'response' }
    );
  }

  getFundingDetExcelDownloadData(
    country: any,
    industry: any,
    startDate: any,
    endDate: any,
    currency: any,
    finType: any,
    entityId: any
  ) {
    return this.http.post(
      this.baseurl +
        `/pevc/allFundingDetailDownload?country=${country}&industry=${industry}&periodStart=${startDate}&periodEnd=${endDate}&currency=${currency}&financingType=${finType}&entityId=${entityId}&rowOffset=0&rowCount=3000&sortingColumn=inception_date&sortingType=desc`,
      {},
      { responseType: 'blob', observe: 'response' }
    );
  }

  getFundingRoundExcelDownloadData(
    entityId: any,
    round: any,
    startDate: any,
    endDate: any,
    finType: any,
    currency: any
  ) {
    return this.http.post(
      this.baseurl +
        `/pevc/fundingDetailDownload?entityId=${entityId}&category=${round}&startDate=${startDate}&endDate=${endDate}&financialType=${finType}&currencyCode=${currency}`,
      {},
      { responseType: 'blob', observe: 'response' }
    );
  }

  getGlobalFundingSectorChart(
    startDate: any,
    endDate: any,
    code: any,
    currency: any
  ) {
    return this.http.get(
      this.baseurl +
        `/pevc/summary/industryChart?countryIsoCode=Global&startDate=${startDate}&endDate=${endDate}&sectorCode=${code}&currency=${currency}`
    );
  }

  getCountryFundingSectorChart(
    country: any,
    startDate: any,
    endDate: any,
    code: any,
    currency: any
  ) {
    return this.http.get(
      this.baseurl +
        `/pevc/summary/industryChart?countryIsoCode=${country}&startDate=${startDate}&endDate=${endDate}&sectorCode=${code}&currency=${currency}`
    );
  }

  // Commodity Page
  getNewsEconomy(body?: any) {
    let params = new HttpParams();
    if (body?.countryIsoCode)
      params = params.append('countryIsoCode', `${body.countryIsoCode}`);
    return this.http.get<any>(this.baseurl + `/economy/news`, {
      params: params,
    });
  }

  getNews() {
    return this.http.get<any>(this.baseurl + `/commodity/news?`);
  }

  getAllCommodity(data: any) {
    let params = new HttpParams();
    if (data) params = params.append('currency', `${data}`);
    return this.http.get<any>(this.baseurl + `/commodity/latest-data?`, {
      params: params,
    });
  }

  getPriceHistory(symbol: any, currency: any, startDate: any, endDate: any) {
    let params = new HttpParams();
    params = params.append('symbolList', `${symbol}`);
    if (currency) params = params.append('currency', `${currency}`);
    if (startDate) params = params.append('startDate', `${startDate}`);
    params = params.append('endDate', `${endDate}`);
    return this.http.get<any>(this.baseurl + `/commodity/historical-data?`, {
      params: params,
    });
  }

  getCurrency(body?: any) {
    let params = new HttpParams();
    if (body?.sector) params = params.append('sector', `${body.sector}`);
    return this.http.get<any>(this.baseurl + `/economy/currency`, {
      params: params,
    });
  }

  getCurrencyBasedCountryCode(id: any) {
    return this.http.get<any>(
      this.baseurl + `/economy/getCountryCurrency?countryIsoCode=${id}`
    );
  }
  getCurrencyBasedCountryId(id: any) {
    return this.http.get<any>(
      this.baseurl + `/economy/getCountryCurrency?countryId=${id}`
    );
  }

  getCDSCurrency(body?: any) {
    let params = new HttpParams();
    if (body?.sector) params = params.append('sector', `${body.sector}`);
    return this.http.get<any>(this.baseurl + `/cds/currencyList`, {
      params: params,
    });
  }

  excelDownload(body: any) {
    return this.http.post(
      this.baseurl + `/downloadData?authentication=RSA`,
      body,
      { responseType: 'blob', observe: 'response' }
    );
  }

  //economy
  getIndicatorsListSelection(body?: any) {
    let params = new HttpParams();
    if (body?.countryIsoCodeList)
      params = params.append(
        'countryIsoCodeList',
        `${body?.countryIsoCodeList}`
      );
    return this.http.get<any>(this.baseurl + `/economy/indicators?`, {
      params: params,
    });
  }
  getCountry() {
    return this.http.get<any>(this.baseurl + `/economy/countries`);
  }
  getEconomyHistoricalDataWithForecast(body: any) {
    let params = new HttpParams();
    if (body.countryIsoCodeList)
      params = params.append('countryIsoCode', `${body.countryIsoCodeList}`);
    if (body.indicatorNameList)
      params = params.append('indicatorName', `${body.indicatorNameList}`);
    if (body.periodType)
      params = params.append('periodType', `${body.periodType}`);
    return this.http.get<any>(
      this.baseurl +
        `/economy/countries/indicators/historical-data-with-forecast?`,
      {
        params: params,
      }
    );
  }
  getEconomyHistoricalData(body: any) {
    let params = new HttpParams();
    if (body.countryIsoCodeList)
      params = params.append(
        'countryIsoCodeList',
        `${body.countryIsoCodeList}`
      );
    if (body.indicatorNameList)
      params = params.append('indicatorNameList', `${body.indicatorNameList}`);
    if (body.periodType)
      params = params.append('periodType', `${body.periodType}`);
    return this.http.get<any>(
      this.baseurl + `/economy/countries/indicators/historical-data?`,
      {
        params: params,
      }
    );
  }
  getNationalBelowTableData(country_code: any) {
    return this.http.get<any>(
      this.baseurl + `/economy/countries/${country_code}/latest-data`
    );
  }

  downloadEconomyExcel(obj: any) {
    return this.http.post(this.baseurl + `/downloadData`, obj, {
      responseType: 'blob',
      observe: 'response',
    });
  }

  getCountryRiskProfile(data?: any) {
    let params = new HttpParams();
    if (data) params = params.append('countryIsoCode', `${data}`);
    return this.http.get<any>(this.baseurl + `/economy/credit-rating?`, {
      params: params,
    });
  }
  getCountryExchangeRate(country_code: any) {
    return this.http.get<any>(
      this.baseurl + `/economy/countries/${country_code}/latestfx`
    );
  }
  // Commodity Page
  getAllBondsData(isin_number: any, fieldName: any) {
    let params = new HttpParams();
    return this.http.get<any>(
      this.baseurl +
        `/fi/fiData?identifier=${isin_number}&fieldName=${fieldName}`,
      { params: params }
    );
  }
  getComparableSecuritiesData(
    isin_number: any,
    includeIdentifier: any,
    excludeIdentifier: any
  ) {
    return this.http.get<any>(
      this.baseurl +
        `/fi/comparable?identifier=${isin_number}&includeIdentifier=${includeIdentifier}&excludeIdentifier=${excludeIdentifier}`
    );
  }
  // Bond Page
  getBondsListDropDown(body: any) {
    let params = new HttpParams();
    if (body.categeory && body.categeory !== 'All')
      params = params.append('categeory', `${body.categeory}`);
    if (body.currency && body.currency !== 'All')
      params = params.append('currency', `${body.currency}`);
    return this.http.get<any>(this.baseurl + `/fi/fiNameList`, {
      params: params,
    });
  }

  getBondsSearchListDropDown(body: any, searchTerm: any) {
    let params = new HttpParams();
    if (body.categeory && body.categeory !== 'All')
      params = params.append('categeory', `${body.categeory}`);
    if (body.currency && body.currency !== 'All')
      params = params.append('currency', `${body.currency}`);
    return this.http.get<any>(
      this.baseurl + `/fi/fiNameList?searchCriteria=${searchTerm}`,
      {
        params: params,
      }
    );
  }

  getBondsCurrency(body: any) {
    let params = new HttpParams();
    if (body.categeory && body.categeory !== 'All')
      params = params.append('categeory', `${body.categeory}`);
    return this.http.get<any>(this.baseurl + `/fi/currencyList`, {
      params: params,
    });
  }

  getBondsCategeory() {
    return this.http.get<any>(this.baseurl + `/fi/categeory`);
  }

  addUserBondsCds(body: any) {
    return this.http.post<any>(this.baseurl + '/user/addBondCds', body);
  }

  getUserBondsCds(userId: any, id: any) {
    return this.http.get<any>(
      this.baseurl + `/user/getBondCds?userId=${userId}&selectionId=${id}`
    );
  }

  removeUserBondsCds(userId: any, id: any) {
    return this.http.delete<any>(
      this.baseurl + `/user/deleteBondCds?userId=${userId}&selectionId=${id}`
    );
  }

  // CDS Page
  getAllCDSData(
    isin_number: any,
    startDate: any,
    endDate: any,
    fieldName: any
  ) {
    let params = new HttpParams();
    if (startDate) params = params.append('startDate', `${startDate}`);
    if (endDate) params = params.append('endDate', `${endDate}`);
    return this.http.get<any>(
      this.baseurl +
        `/cds/cdsData?identifier=${isin_number}&fieldName=${fieldName}`,
      { params: params }
    );
  }

  getCDSListDropDown(body: any) {
    let params = new HttpParams();
    if (body.sector) params = params.append('sector', `${body.sector}`);
    if (body.currency) params = params.append('currency', `${body.currency}`);
    return this.http.get<any>(this.baseurl + `/cds/cdsNameList`, {
      params: params,
    });
  }
  getCDSListSearchDropDown(event: any, body: any) {
    let params = new HttpParams();
    if (body.sector) params = params.append('sector', `${body.sector}`);
    if (body.currency) params = params.append('currency', `${body.currency}`);
    return this.http.get<any>(
      this.baseurl + `/cds/cdsNameList?searchCriteria=${event}`,
      {
        params: params,
      }
    );
  }
  getComparableCDSData(
    isin_number: any,
    includeIdentifier: any,
    excludeIdentifier: any
  ) {
    return this.http.get<any>(
      this.baseurl +
        `/cds/comparable?identifier=${isin_number}&includeIdentifier=${includeIdentifier}&excludeIdentifier=${excludeIdentifier}`
    );
  }
  // CDS Page

  //common adavnce search
  getAdvanceSearch(type: any, body: any) {
    return this.http.post<any>(
      this.baseurl + `/getAdvanceSearch?requesttype=${type}`,
      body
    );
  }

  // Industry Tab API
  getIndustryCountryList() {
    return this.http.get<any>(this.baseurl + `/industry/countries`);
  }
  getIndustryCountryListWithSectorCode(data: any) {
    return this.http.get<any>(
      this.baseurl + `/industry/countries?ticsIndustryCode=${data}`
    );
  }

  getIndustryListGraphData(
    periodType: any,
    date: any,
    countryId: any,
    currency: any,
    startDate: any,
    sectorCode: any
  ) {
    return this.http.get<any>(
      this.baseurl +
        '/industry/sectors/' +
        sectorCode +
        '?periodType=' +
        periodType +
        '&startDate=' +
        startDate +
        '&endDate=' +
        date +
        '&countryId=' +
        countryId +
        '&currency=' +
        currency
    );
  }

  getIndustryPeriodList() {
    return this.http.get<any>(this.baseurl + `/industry/period`);
  }
  getIndustryPeriodListThirdLevel(
    sectorID: any,
    country: any,
    industryID: any
  ) {
    return this.http.get<any>(
      this.baseurl +
        `/industry/period?ticsSectorCode=${sectorID}&countryId=${country}&ticsIndustryCode=${industryID}`
    );
  }
  getSectorList() {
    return this.http.get<any>(this.baseurl + `/industry/sectorList`);
  }
  getSectorIndustryList() {
    return this.http.get<any>(this.baseurl + `/industry/ticsIndustryList`);
  }
  getSectorcountryList() {
    return this.http.get<any>(this.baseurl + `/industry/countries`);
  }
  getCurrencyList() {
    return this.http.get<any>(this.baseurl + `/economy/currency/`);
  }
  Getperoiddetails(id: any, data: any) {
    let countryid: any;
    if (id == undefined) {
      countryid = '';
    } else {
      countryid = id;
    }
    return this.http.get<any>(
      this.baseurl +
        `/industry/period?countryId=${countryid}&ticsIndustryCode=${data}`
    );
  }

  getIndustryCoverage() {
    return this.http.get<any>(this.baseurl + `/industry/sectorList`);
  }
  getIndustryILcd() {
    return this.http.get<any>(this.baseurl + `/industry/ticsIndustryList`);
  }
  getIndustrySectorList(
    periodType: any,
    date: any,
    countryId: any,
    currency: any
  ) {
    return this.http.get<any>(
      this.baseurl +
        '/industry/sectorList?periodType=' +
        periodType +
        '&startDate=' +
        date +
        '&endDate=' +
        date +
        '&countryId=' +
        countryId +
        '&currency=' +
        currency
    );
  }

  getIndustrySectors(
    periodType: any,
    date: any,
    countryId: any,
    currency: any
  ) {
    return this.http.get<any>(
      this.baseurl +
        '/industry/sectors?periodType=' +
        periodType +
        '&startDate=' +
        date +
        '&endDate=' +
        date +
        '&countryId=' +
        countryId +
        '&currency=' +
        currency
    );
  }

  getIndustrySecondLevel(
    periodType: any,
    ticsSectoreCode: any,
    date: any,
    countryId: any,
    currency: any,
    startDate: any
  ) {
    return this.http.get<any>(
      this.baseurl +
        `/industry/ticsindustry?periodType=${periodType}&ticsSectorCode=${ticsSectoreCode}&startDate=${startDate}&endDate=${date}&countryId=${countryId}${
          currency ? `&currency=${currency}` : ''
        }`
    );
  }

  getIndustryThirdLevel(
    periodType: any,
    ticsSectoreCode: any,
    date: any,
    countryId: any,
    currency: any,
    startDate: any
  ) {
    return this.http.get<any>(
      this.baseurl +
        `/industry/company?periodType=${periodType}&ticsIndustryCode=${ticsSectoreCode}&endDate=${date}&startDate=${date}&countryId=${countryId}${
          currency ? `&currency=${currency}` : ''
        }`
    );
  }
  // Industry Tab API

  // Interactive Analysis Tab API
  getInteractiveAnalysisCompany() {
    return this.http.get<any>(this.baseurl + `/comparison/companies`);
  }

  getInteractiveAnalysisCompanySearch(value: any) {
    return this.http.get<any>(
      this.baseurl + `/comparison/companies?searchCriteria=${value}`
    );
  }

  getCompanyDetailsData(value: any) {
    return this.http.post(
      this.baseurl + `/comparison/companies/stock/data`,
      value
    );
  }

  getInteractiveAnalysisQueryCompanySearch(value: any) {
    return this.http.get<any>(this.baseurl + `/companies/${value}`);
  }

  getInteractiveAnalysisMetrices(industryParam: any) {
    return this.http.get<any>(
      this.baseurl +
        `/financial/parameter/${industryParam}?distinctParams=true&icFlag=true`
    );
  }

  getInteractiveAnalysisIndustry() {
    return this.http.get<any>(
      this.baseurl + `/industry/ticsIndustryList?sectorCode=null`
    );
  }

  getInteractiveAnalysisCountry() {
    return this.http.get<any>(
      this.baseurl + `/industry/countries?ticsIndustryCode=`
    );
  }

  getInteractiveAnalysisEconomyCountry() {
    return this.http.get<any>(
      this.baseurl + `/economy/countries?searchCriteria=`
    );
  }

  getInteractiveAnalysisEconomyIndicator(value: any) {
    return this.http.get<any>(this.baseurl + `/economy/indicators?${value}`);
  }

  getCompanyIndustryData(value: any) {
    return this.http.post<any>(
      this.baseurl + `/comparison/companies/industry/data`,
      value
    );
  }

  getEconomyIndustryData(value: any) {
    return this.http.post<any>(
      this.baseurl + `/comparison/companies/economy/data`,
      value
    );
  }

  getCommodityComparisonData(value: any) {
    return this.http.post<any>(
      this.baseurl + `/comparison/commodity/data`,
      value
    );
  }

  getCommodityList() {
    return this.http.get<any>(this.baseurl + `/commodity/list`);
  }

  downloadExcelFile(body: any) {
    return this.http.post(
      this.baseurl + `/comparison/downloadInterativeComparisonData/`,
      body,
      {
        responseType: 'blob',
        observe: 'response',
      }
    );
  }

  // Interactive Analysis Tab API

  //Screener Page
  getSector() {
    return this.http.get<any>(this.baseurl + `/industry/sectorList`);
  }

  getIndustry() {
    return this.http.get<any>(this.baseurl + `/industry/ticsIndustryList`);
  }

  getMatrixFinancials() {
    return this.http.get<any>(
      this.baseurl +
        `/financial/parameter/Industrial?distinctParams=true&icFlag=false&screenerFlag=true&watchlistFlag=false`
    );
  }

  getScreenerResultTable(id: any, currency: any) {
    return this.http.get<any>(
      this.baseurl +
        `/screener/company?ticsIndustryCode=` +
        id +
        '&currency=' +
        currency
    );
  }

  getEditMatricFinancial(id: any, fieldName: any, currency: any) {
    return this.http.get<any>(
      this.baseurl +
        `/screener/companies/financial?subIndustryCode=` +
        id +
        '&fieldName=' +
        fieldName +
        '&currency=' +
        currency
    );
  }

  getEditMatricFR(id: any, fieldName: any, currency: any) {
    return this.http.get<any>(
      this.baseurl +
        '/screener/companies/ratio?ticsIndustryCode=' +
        id +
        '&ratioName=' +
        fieldName +
        '&currency=' +
        currency
    );
  }

  getFinancialData(company_id: any, currency: any, period: any, type?: any) {
    let eType = '';
    type ? (eType = '&entityType=Private') : '';

    return this.http.get<any>(
      this.baseurl +
        '/companies/' +
        company_id +
        '/financial/ALL?periodType=' +
        period +
        '&currency=' +
        currency +
        eType,
      { observe: 'response' }
    );
  }

  getIndianPrivateFinancialData(company_id: any, currency: any, period: any) {
    return this.http.get<any>(
      this.advanceSearch +
        `/pvt/ind/companies/financial?financialType=all&periodType=${period}&startDate=&endDate=&currency=${currency}&entityType=Private&cinNo=${company_id}`
    );
  }

  getCurrencyChange(
    currentCurrency: any,
    selectCurrencyData: any,
    period: any
  ) {
    return this.http.get<any>(
      this.baseurl +
        '    /screener/currency/conversionrate?sourceCurrency=' +
        currentCurrency +
        '&destinationCurrency=' +
        selectCurrencyData +
        '&periodList=' +
        period
    );
  }

  getEditMatricPV(fieldName: any, id: any, currency: any) {
    if (fieldName == 't_mcap') {
      return this.http.get<any>(
        this.baseurl +
          '/screener/companies/ratio?ticsIndustryCode=' +
          id +
          '&ratioName=' +
          fieldName +
          '&currency=' +
          currency
      );
    } else {
      return this.http.get<any>(
        this.baseurl +
          '/screener/companies/stockprice?ticsIndustryCode=' +
          id +
          '&currency=' +
          currency
      );
    }
  }

  getEditMatricVR(id: any, fieldName: any, currency: any) {
    return this.http.get<any>(
      this.baseurl +
        `/screener/companies/ratio?ticsIndustryCode=` +
        id +
        '&ratioName=' +
        fieldName +
        '&currency=' +
        currency
    );
  }

  //company Page API
  //company Page API
  getDebtprofileData(currency: any, entity_id: any) {
    return this.http.get<any>(
      this.baseurl +
        `/debtstructure/debt?currency=` +
        currency +
        `&entityId=` +
        entity_id
    );
  }

  getmanagementData(company: any, id: any) {
    return this.http.get<any>(
      this.baseurl + `/ownershipstructure/managementinfo?entityId=` + id
    );
  }

  getDefaultComapny(country: any) {
    return this.http.get<any>(
      this.baseurl + '/defaultcompany?primaryCountry=' + country
    );
  }

  getSegmentData(company_id: any, company_name: any, currency: any) {
    return this.http.get<any>(
      this.baseurl +
        '/segmentstructure/business?fsimId=' +
        company_id +
        // '&companyName=' +
        // company_name +
        '&currency=' +
        currency
    );
  }

  getDebtCompositionData(currency: any, entity_id: any) {
    return this.http.get<any>(
      this.baseurl +
        '/debtstructure/borrowinglimit?currency=' +
        currency +
        '&entityId=' +
        entity_id
    );
  }

  getMaturityData(currency: any, entity_id: any) {
    return this.http.get<any>(
      this.baseurl +
        '/debtstructure/maturity?currency=' +
        currency +
        '&entityId=' +
        entity_id
    );
  }

  getEmploymentHistory(id: any) {
    return this.http.get<any>(
      this.baseurl + '/ownershipstructure/employmenthistory?personId=' + id
    );
  }
  //data download apis
  getExchangeList() {
    return this.http.get<any>(this.baseurl + `/exchange`);
  }
  getSubExchangeList(exchange_code: any, searchTerm: any = '') {
    return this.http.get<any>(
      this.baseurl +
        `/exchange/${exchange_code}/companies?searchCriteria=${searchTerm}`
    );
  }
  getCommidityList() {
    return this.http.get<any>(this.baseurl + `/commodity/list`);
  }
  getAllCompany() {
    return this.http.get<any>(this.baseurl + `/companies`);
  }
  getEconomyIndicatorCheckBoxList(countryCode: any) {
    return this.http.get<any>(
      this.baseurl + `/economy/indicators/?countryIsoCodeList=${countryCode}`
    );
  }
  getMacroIndicatorCheckBoxList(indicator_name: any) {
    return this.http.get<any>(
      this.baseurl + `/economy/countries?indicatorName=${indicator_name}`
    );
  }
  getBetaList(beta_id: any) {
    return this.http.get<any>(this.baseurl + `/companies/${beta_id}/indexes`);
  }
  getBetaPerioicityList(key: any, id: any) {
    return this.http.get<any>(
      this.baseurl + `/${key}${key === 'financial' ? `/${id}` : ''}/periodicity`
    );
  }

  //company API

  getPeriodicityFinancial(id: any) {
    return this.http.get<any>(this.baseurl + `/financial/${id}/periodicity`);
  }
  getBenchmarkPeriodicity(id: any) {
    return this.http.get<any>(
      this.baseurl + `/companies/${id}/benchmarkPeriods`
    );
  }
  getHoldingInfo(id: any) {
    return this.http.get<any>(
      this.baseurl + '/ownershipstructure/holdings?personId=' + id
    );
  }

  getDirectorInfo(id: any) {
    return this.http.get<any>(
      this.baseurl + '/ownershipstructure/directorship?personId=' + id
    );
  }

  getOwnershipData(security_id: any) {
    return this.http.get<any>(
      this.baseurl +
        '/shareholdings/ownership/details/recent?securityId=' +
        security_id
    );
  }

  getOwnershipDetailData(security_id: any) {
    return this.http.get<any>(
      this.baseurl +
        '/shareholdings/ownership/details?securityId=' +
        security_id
    );
  }

  getpromoteOwnershipDetailData(security_id: any) {
    return this.http.get<any>(
      this.baseurl + '/shareholdings/insider/details?securityId=' + security_id
    );
  }

  getinstitueOwnershipDetailData(security_id: any) {
    return this.http.get<any>(
      this.baseurl + '/shareholdings/institutional?securityId=' + security_id
    );
  }

  getEstimateData(id: any, period: any) {
    return this.http.get<any>(
      this.baseurl + '/analyst/' + id + '/basic/consensus?periodicity=' + period
    );
  }

  getEventsData(id: any) {
    return this.http.get<any>(this.baseurl + '/events?entityId=' + id);
  }

  getCompanyFileData(company_id: any, entity_id: any, type_data: any) {
    return this.http.get<any>(
      this.baseurl +
        '/companyFilings?companyId=' +
        company_id +
        '&entityId=' +
        entity_id +
        '&pageNo=0&formType=' +
        type_data
    );
  }

  getPriodicityData(indicatorName: any, countryName: any) {
    return this.http.get<any>(
      this.baseurl +
        `/economy/indicator/periodicity?indicatorName=${indicatorName}&countryName=${countryName}`
    );
  }

  getBenchMarktableData(entity_id: any, period: any, currency: any) {
    return this.http.get<any>(
      this.baseurl +
        `/companies/${entity_id}/editbenchmarkcompaniesnew?resultLimit=5&periodType=${period}&currency=${currency}&entityType=PUB`
    );
  }

  getRelativePriceData(company_id: any, currency: any, index: any) {
    return this.http.get<any>(
      this.baseurl +
        `/companies/relativeperformance?currency=${currency}&companyId=${company_id}&indexId=${index}`
    );
  }

  getCompanyinfo(company_id: any, currency: any) {
    return this.http.get<any>(
      this.baseurl +
        `/companies/${company_id}/metadata/info?currency=` +
        currency
    );
  }
  getCompanyBasicInfo(company_id: any, currency: any) {
    return this.http.get<any>(
      this.baseurl + `/basicinfo?entityId=${company_id}`
    );
  }

  getIndianCompanyBasicInfo(company_id: any, currency: any) {
    return this.http.get<any>(
      this.advanceSearch +
        `/pvt/ind/basicinfo?cinNo=${company_id}&Currency=${currency}`
    );
  }

  getAnalystChartData(id: any) {
    return this.http.get<any>(
      this.baseurl + '/analyst/' + id + '/recommendation?recType=rec'
    );
  }

  gettotalrecomChartData(id: any) {
    return this.http.get<any>(
      this.baseurl + '/analyst/' + id + '/totalrecommendation?recType=rec'
    );
  }

  getStockChartData(id: any, currency: any) {
    return this.http.get<any>(
      this.baseurl +
        '/companies/' +
        id +
        '/stockprice?periodType=DAILY&currency=' +
        currency
    );
  }

  getCompanies() {
    return this.http.get<any>(this.baseurl + '/companies');
  }

  getPrivateCompanies(searchTerm: any) {
    return this.http.get<any>(
      this.baseurl +
        `/companies?searchCriteria=${searchTerm}&encodedFlag=1&excludeDuplicateFlag=true&entityType=PVT`
    );
  }

  getPrivateBenchmarkCompany(searchTerm: any) {
    return this.http.get<any>(
      this.baseurl +
        `/companies?searchCriteria=${searchTerm}&encodedFlag=1&excludeDuplicateFlag=true&entityType=PVTIND`
    );
  }

  getCompaniesRedirection(id: any) {
    return this.http.get<any>(this.baseurl + '/companies?companyId=' + id);
  }

  getExchangeData(id: any) {
    return this.http.get<any>(
      this.baseurl + '/companies/' + id + '/exchanges/data'
    );
  }

  getCurrencies() {
    return this.http.get<any>(this.baseurl + '/economy/currency/');
  }

  DownloadPdfIndutryMonitor(body: any) {
    return this.http.post(
      this.baseurl +
        `/downloadIndustryMonitor?module=INDUSTRY_MONITOR&section=INDUSTRY_MONITOR`,
      body,
      {
        responseType: 'blob',
        observe: 'response',
      }
    );
  }
  downloadPeroadExcel(body: any) {
    return this.http.post(this.baseurl + `/downloadData`, body, {
      responseType: 'blob',
      observe: 'response',
    });
  }

  getbetainfo(id: any, currency: any, index: any, period: any) {
    return this.http.get<any>(
      this.baseurl +
        '/companies/' +
        id +
        '/beta?indexId=' +
        index +
        '&currency=' +
        currency +
        '&periodicity=' +
        period
    );
  }
  downloadstockExcel(obj: any) {
    return this.http.post(
      this.baseurl +
        `/downloadData?module=COMPANY_PROFILE&section=STOCK_PRICE_HISTORY`,
      obj,
      {
        responseType: 'blob',
        observe: 'response',
      }
    );
  }
  downloadstocksegment(id: any, company: any, cur: any) {
    return this.http.post(
      this.baseurl +
        `/downloadSegmentInfoExcelData?fsimId=${id}&companyName=${company}&currency=${cur}&module=COMPANY_PROFILE&section=SEGMENT_INFO`,
      {},
      {
        responseType: 'blob',
        observe: 'response',
      }
    );
  }
  downloadfinancialExcel(obj: any) {
    return this.http.post(
      this.baseurl +
        `/downloadData?module=COMPANY_PROFILE&section=COMPANY_FINANCIAL`,
      obj,
      {
        responseType: 'blob',
        observe: 'response',
      }
    );
  }
  downloaddebtexcell(id: any, company: any, cur: any) {
    return this.http.post(
      this.baseurl +
        `/downloadDebtStructure?entityId=${id}&companyName=${company}&currency=${cur}&module=COMPANY_PROFILE&section=DEBT_PROFILE`,
      {},
      {
        responseType: 'blob',
        observe: 'response',
      }
    );
  }
  downloadmanagementexcell(id: any, company: any) {
    return this.http.post(
      this.baseurl +
        `/downloadOwnershipStructure?entityId=${id}&companyName=${company}&module=COMPANY_PROFILE&section=MANAGEMENT_KEY_EMPLOYEES`,
      {},
      {
        responseType: 'blob',
        observe: 'response',
      }
    );
  }
  downloadanalystexcell(id: any, company: any) {
    return this.http.post(
      this.baseurl +
        `/downloadAnalystRecommendation?companyId=${id}&companyName=${company}&recType=REC&module=COMPANY_PROFILE&section=ANALYST_COVERAGE`,
      {},
      {
        responseType: 'blob',
        observe: 'response',
      }
    );
  }
  downloadEstimatesExcell(id: any, company: any) {
    return this.http.post(
      this.baseurl +
        `/downloadAnalystConsensus?companyId=${id}&companyName=${company}&module=COMPANY_PROFILE&section=ESTIMATES_CONSENSUS`,
      {},
      {
        responseType: 'blob',
        observe: 'response',
      }
    );
  }
  downloadEventsExcell(cid: any, eid: any, sid: any, company: any, cur: any) {
    return this.http.post(
      this.baseurl +
        `/eventsDownload?companyId=${cid}&entityId=${eid}&securityId=${sid}&companyName=${company}&currency=${cur}&module=COMPANY_PROFILE&section=EVENTS_TRANSCRIPTS`,
      {},
      {
        responseType: 'blob',
        observe: 'response',
      }
    );
  }
  downloadOwnershipExcell(id: any, company: any) {
    return this.http.post(
      this.baseurl +
        `/downloadShareHolding?companyName=${company}&entityId=${id}&module=COMPANY_PROFILE&section=OWNERSHIP`,
      {},
      {
        responseType: 'blob',
        observe: 'response',
      }
    );
  }
  downloadcompanyProfile(id: any, company: any) {
    return this.http.post(
      this.baseurl +
        `/downloadCompanyProfile?companyId=${id}&currency=${company}&module=COMPANY_PROFILE&section=COMPANY_PROFILE`,
      {},
      {
        responseType: 'blob',
        observe: 'response',
      }
    );
  }

  downloadinsiderTransactionExcel(
    company_id: any,
    company: any,
    security_id: any,
    entity_id: any,
    currency: any
  ) {
    return this.http.post(
      this.baseurl +
        `/insiderTransactionDownload?companyId=${company_id}&entityId=${entity_id}&securityId=${security_id}&companyName=${company}, Inc.&currency=${currency}&module=COMPANY_PROFILE&section=INSIDER_TRANSACTIONS`,
      {},
      {
        responseType: 'blob',
        observe: 'response',
      }
    );
  }

  getAdvanceSearchCompany(
    entity: any,
    industry: any,
    country: any,
    currency: any,
    searhed: any
  ) {
    return this.http.get<any>(
      this.baseurl +
        '/advancecompanysearch?entitySelection=' +
        entity +
        '&industrySelection=' +
        industry +
        '&countrySelection=' +
        country +
        '&currencySelection=' +
        currency +
        '&searchKeyWord=' +
        searhed
    );
  }

  getIndianPVTAdvanceSearchCompany(
    entity: any,
    industry: any,
    country: any,
    currency: any,
    searhed: any
  ) {
    return this.http.get<any>(
      this.advanceSearch +
        `/pvt/ind/advance/search?entitySelection=${entity}&industrySelection=${industry}&countrySelection=${country}&currencySelection=${currency}&searchKeyWord=${searhed}`
    );
  }

  getbenchmarkcompany(id: any) {
    return this.http.get<any>(
      this.baseurl +
        '/companies?companyId=' +
        id +
        '&excludeDuplicateFlag=false'
    );
  }
  restBenchmarkData(userid: any, entityId: any) {
    return this.http.delete<any>(
      this.baseurl +
        `/user/deleteBenchmark?userId=${userid}&entityId=${entityId}`
    );
  }

  AddandRemoveBenchMarktableData(
    entity_id: any,
    period: any,
    currency: any,
    benchmark_company: any,
    remove_company: any,
    PrivateCompanyactive: any
  ) {
    return this.http.get<any>(
      this.baseurl +
        `/companies/${entity_id}/editbenchmarkcompaniesnew?resultLimit=5&periodType=${period}&currency=${currency}&entityType=${
          PrivateCompanyactive ? 'PVT' : 'PUB'
        }&benchmarkCompanyAdd=${benchmark_company}&benchmarkCompanyRemove=${remove_company}`
    );
  }

  AddandRemovePrivateBenchMarktableData(
    entity_id: any,
    period: any,
    currency: any,
    benchmark_company: any,
    remove_company: any
  ) {
    return this.http.get<any>(
      this.advanceSearch +
        `/pvt/ind/companies/edit/benchmark?cinNo=${entity_id}&periodType=${period}&currency=${currency}&benchmarkCompanyAdd=${benchmark_company}&benchmarkCompanyRemove=${remove_company}`
    );
  }

  getBenchMarkData(userId: any, companyId: any) {
    return this.http.get<any>(
      this.baseurl + `/user/benchmarks?userId=${userId}&companyId=${companyId}`
    );
  }

  getstoredBenchmarkForCompany(body: any) {
    return this.http.post<any>(this.baseurl + '/user/addBenchmark', body);
  }

  // removeBenchMarktableData(
  //   entity_id: any,
  //   period: any,
  //   currency: any,
  //   benchmark_company: any
  // ) {
  //   return this.http.get<any>(
  //     this.baseurl +
  //       `/companies/${entity_id}/editbenchmarkcompaniesnew?resultLimit=5&periodType=${period}&currency=${currency}&entityType=PUB&benchmarkCompanyRemove=${benchmark_company}`
  //   );
  // }

  globalSearchData(search: any) {
    return this.http.get<any>(
      this.baseurl + `/global-search/${search}/search?resultCount=100`
    );
  }

  getinsiderTransaction(company_id: any, security_id: any, cuurecy: any) {
    return this.http.get<any>(
      this.baseurl +
        '/insiderTransaction' +
        '?securityId=' +
        security_id +
        '&currency=' +
        cuurecy +
        '&companyId=' +
        company_id
    );
  }

  getmanagementGuidancePerformance(periodicity: any, company_id: any) {
    return this.http.get<any>(
      this.baseurl +
        '/analyst/' +
        company_id +
        '/deviation?periodicity=' +
        periodicity
    );
  }

  getCompanyFileDownload(key: any) {
    return this.http.post(
      this.baseurl + `/factsetDocument?recordKey=${key}`,
      {},
      {
        responseType: 'blob',
        observe: 'response',
      }
    );
  }

  getCountryIp() {
    return this.http.get<any>(
      'https://pro.ip-api.com/json/?fields=66322431&key=MBHzswFAGJ6JrSl'
    );
    // return this.http.get<any>('https://ipinfo.io/json?token=c5b12176a7d41e');
  }
  // ----------------------------IPO-API-----------------------------

  getAllIpoSectionData() {
    return this.http.get<any>(this.pahseTwoBaseURL + `/ipo/data`);
  }

  getExpandedSectionData(e: any) {
    return this.http.get<any>(this.pahseTwoBaseURL + `/ipo/${e}`);
  }

  getIpoNotesData() {
    return this.http.get<any>(this.pahseTwoBaseURL + `/ipo/notes`);
  }

  getFilteredIpos(apitype: any, page_no: any, body: any) {
    return this.http.post<any>(
      this.pahseTwoBaseURL + `/ipo/${apitype}/${page_no}/10/filters`,
      body
    );
  }

  getIpoExchangeData() {
    return this.http.get<any>(this.pahseTwoBaseURL + `/ipo/exchange`);
  }

  getIpoSecurityType() {
    return this.http.get<any>(this.pahseTwoBaseURL + `/ipo/security-type`);
  }

  getIpoCompanyName() {
    return this.http.get<any>(this.pahseTwoBaseURL + `/ipo/company-list`);
  }

  getIpoIndustries() {
    return this.http.get<any>(this.pahseTwoBaseURL + `/ipo/industries`);
  }

  getissueDetails(status: any, country: any, comp_name: any) {
    return this.http.get<any>(
      this.pahseTwoBaseURL + `/ipo/company/details/${comp_name}`
    );
  }
  getissueDetailsCurrency(comp_name: any, body: any) {
    return this.http.post<any>(
      this.pahseTwoBaseURL + `/ipo/company/details/${comp_name}`,
      body
    );
  }

  getIpoPageData(params: any) {
    return this.http.get<any>(this.pahseTwoBaseURL + `/ipo/${params}`);
  }

  getIpoCompanies(params: any, body: any) {
    return this.http.post<any>(this.pahseTwoBaseURL + `/ipo/${params}`, body);
  }

  getAdvanceSearchIpoData(params: any, body: any) {
    return this.http.post<any>(
      this.pahseTwoBaseURL + `/ipo/advance-search/${params}/10`,
      body
    );
  }

  getIpoChartData(params: any) {
    return this.http.get(
      this.pahseTwoBaseURL + `/ipo/pie-chart?period=${params}`,
      {}
    );
  }

  downloadIpoData(data: any) {
    return this.http.get(this.pahseTwoBaseURL + `/ipo/download/${data}`, {
      responseType: 'blob',
      observe: 'response',
    });
  }

  getAdvanceSearchData() {
    return this.http.get<any>(this.pahseTwoBaseURL + `/ipo/advance-search/1/5`);
  }

  getCompanyRedirectData(body: any) {
    return this.http.post<any>(
      this.pahseTwoBaseURL + `/ipo/company-redirect`,
      body
    );
  }
  getIndustryChart(params: any) {
    return this.http.get<any>(
      this.pahseTwoBaseURL + `/ipo/industry/details/${params}`
    );
  }
  getSortedData(params: any, body: any) {
    return this.http.post<any>(
      this.pahseTwoBaseURL + `/ipo/sort/${params}/10`,
      body
    );
  }
  //----------------IPO-API-END---------------------
  // -------------- Fixed income API START ---------------

  getRegion() {
    return this.http.get<any>(
      this.phase_two_bonds_base_url + '/bonds/region/get'
    ); // for this top buttons
  }

  getRegionByCountry() {
    return this.http.get<any>(
      this.phase_two_bonds_base_url + '/bonds/region/country/get'
    ); // for this create tenplate
  }

  getAllTemplate() {
    return this.http.get<any>(
      this.phase_two_bonds_base_url + '/bonds/templates/get'
    );
  }

  getRegionAndInstruments() {
    return this.http.get<any>(
      this.phase_two_bonds_base_url + '/bonds/create-template-region-dropdown'
    );
  }

  getIndividualTemplateDetails(id: any) {
    return this.http.get<any>(
      this.phase_two_bonds_base_url + `/bonds/get-template/${id}`
    );
  }

  deleteTemplate(id: any) {
    return this.http.delete<any>(
      this.phase_two_bonds_base_url + `/bonds/template/delete?templateId=${id}`
    );
  }

  getComparableList() {
    return this.http.get<any>(
      this.phase_two_bonds_base_url +
        '/bonds/instrument-type/get-advance-search-instruments'
    );
  }

  getComparableListUnique(id: any) {
    return this.http.get<any>(
      this.phase_two_bonds_base_url +
        `/bonds/instrument-type/get-default-comparable-bonds-list/${id}`
    );
  }

  getEditComparableList() {
    return this.http.get<any>(
      this.phase_two_bonds_base_url +
        '/bonds/instrument-type/edit-comparable-instruments'
    );
  }

  restEditComparableList() {
    return this.http.get<any>(
      this.phase_two_bonds_base_url +
        '/bonds/instrument-type/reset-comparable-instruments'
    );
  }

  getMetricsList() {
    return this.http.get<any>(
      this.phase_two_bonds_base_url + '/bonds/templates/get-metrics'
    );
  }

  getComparableMetricsList() {
    return this.http.get<any>(
      this.phase_two_bonds_base_url +
        '/bonds/instrument-type/get-comparable-metrics'
    );
  }

  getAllDatasInstrumentData(body: any) {
    return this.http.get<any>(
      this.phase_two_bonds_base_url +
        `/bonds/template/get/instrument-type-data?templateId=${body.templateId}&instrumentTypeId=${body.instrumentTypeId}`,
      body
    );
  }

  getAllDatasRegionData(body: any) {
    return this.http.get<any>(
      this.phase_two_bonds_base_url +
        `/bonds/template/get/region-data?templateId=${body.templateId}&regionId=${body.regionId}`,
      body
    );
  }

  getAllDatasCustomData(templateId: any) {
    return this.http.get<any>(
      this.phase_two_bonds_base_url +
        `/bonds/template/get/custom-template?templateId=${templateId}`
    );
  }

  getAllInstrument() {
    return this.http.get<any>(
      this.phase_two_bonds_base_url + '/bonds/instrument-type/get'
    ); // for this top buttons
  }

  getAllInstrumentCharacteristics() {
    return this.http.get<any>(
      this.phase_two_bonds_base_url +
        '/bonds/instrument-type/get-instrument-characteristics'
    );
  }

  createTemplate(value: any) {
    return this.http.post(
      this.phase_two_bonds_base_url + `/bonds/create-template`,
      value
    );
  }

  updateTemplate(value: any) {
    return this.http.post(
      this.phase_two_bonds_base_url + `/bonds/update-template`,
      value
    );
  }

  comprableEdit(value: any) {
    return this.http.post(
      this.phase_two_bonds_base_url +
        `/bonds/instrument-type/edit-comparable-instruments-save`,
      value
    );
  }

  saveUserMetrics(value: any) {
    return this.http.post(
      this.phase_two_bonds_base_url + `/bonds/templates/save-user-metrics`,
      value
    );
  }

  saveComparableMetrics(value: any) {
    return this.http.post(
      this.phase_two_bonds_base_url +
        `/bonds/instrument-type/save-comparable-metrics`,
      value
    );
  }

  getAllInstrumentsForModel() {
    return this.http.get<any>(
      this.phase_two_bonds_base_url +
        '/bonds/instrument-type/get-instrument-characteristics'
    );
  }

  alterTable(value: any) {
    return this.http.post(
      this.phase_two_bonds_base_url + `/bonds/templates/alter-table`,
      value
    );
  }

  // -----------------Forex Api Starting -----------------

  getForexTableData(params: any, offset: any) {
    return this.http.get(this.forexUrl + `/forex/findAll/${params}/${offset}`);
  }
  getForexBaseCurrency() {
    return this.http.get(this.forexUrl + `/forex/baseCurrencyDropdown`);
  }
  getForwardPriceQuote() {
    return this.http.get(this.forexUrl + `/forex/forwardPriceQuote`);
  }
  getForexTableDataBasedOnSelection(params: any) {
    return this.http.get(
      this.forexUrl + `/forex/searchByBaseCurrency/${params}`
    );
  }
  getCategoryDescriptionMapping() {
    return this.http.get(this.forexUrl + `/forex/categoryDescriptionMapping`);
  }
  // getForexPageRegion() {
  //   return this.http.get(this.forexUrl + `/forex/regionListDropdown`);
  // }
  getMatrixList() {
    return this.http.get(this.forexUrl + `/forex/customForexMatrixList`);
  }

  getEditCustomMatrixData(params: any) {
    return this.http.get(
      this.forexUrl + `/forex/customForexMatrix/fxMatrix/${params}`
    );
  }

  getForextradeQuoteGraph() {
    return this.http.get(this.forexUrl + `/forex/tradeQuoteGraph`);
  }

  getForexforexData(params: any) {
    return this.http.get(this.forexUrl + `/forex/iceDescription/${params}`);
  }
  getForexOTCFXContract() {
    return this.http.get(this.forexUrl + `/forex/otcFxContractDropdown`);
  }
  getForexSavedMatrix() {
    return this.http.get(this.forexUrl + `/forex/customForexMatrix`);
  }

  getForexfxPairs() {
    return this.http.get(this.forexUrl + `/forex/fxPairsDropdown`);
  }
  getForexForwardPriceQuoteGraph(params: any) {
    return this.http.get(this.forexUrl + `/forex/forwardPremium/${params}`);
  }
  getForexcustomForexMatrix() {
    return this.http.get(this.forexUrl + `/forex/customForexMatrix/custom1`);
  }
  putCustomForexMatrix(value: any) {
    return this.http.put(
      this.forexUrl + `forex/editCustomForexMatrix/${value.name}`,
      value
    );
  }
  deleteCustomForexMatrix(id: any) {
    return this.http.delete<any>(
      this.forexUrl + `/forex/deleteCustomForexMatrix/${id}`
    );
  }
  postForexcustomForexMatrix(value: any) {
    return this.http.post(this.forexUrl + `/forex/customForexMatrix`, value);
  }
  getForexfxView(params: any) {
    return this.http.get(this.forexUrl + `/forex/fxView/${params}`);
  }
  getForexFxPairs(params: any) {
    return this.http.get(this.forexUrl + `/forex/searchByFxPair/${params}`);
  }
  getForexfxMajor() {
    return this.http.get(this.forexUrl + `/forex/customForexMatrix/fxMajor`);
  }
  getForexcutomMatrix(params: any) {
    return this.http.get(this.forexUrl + `/forex/customForexMatrix/${params}`);
  }
  getIceDescriptionGraph(params: any) {
    return this.http.get(
      this.forexUrl + `/forex/iceDescriptionGraph/${params}`
    );
  }
  getSearchByForexPair(params: any) {
    return this.http.get(this.forexUrl + `/forex/searchByForexPair/${params}`);
  }

  // -----------------Forex Api End -----------------
  // -------------- Fixed income API END ---------------

  // -------------- Commodity API START ---------------
  getOTCEnergy() {
    return this.http.get(
      this.phase_two_commodity_base_url + `/commodity/otcenergy`
    );
  }
  getOTCMetals(page: any = 0) {
    return this.http.get(
      this.phase_two_commodity_base_url + `/commodity/otcmetals/${page}`
    );
  }

  getOTCEnergyDetail(id: any) {
    return this.http.get(
      this.phase_two_commodity_base_url + `/commodity/energy/otcdto/id?id=${id}`
    );
  }

  getOTCEnergyDetailTable(symbol: any) {
    return this.http.get(
      this.phase_two_commodity_base_url +
        `/commodity/otcquote/symbol?symbolDescription=${symbol}`
    );
  }

  getOTCEnergyDropdown() {
    return this.http.get(
      this.phase_two_commodity_base_url + `/commodity/energy`
    );
  }

  getOTCEnergyWeekGraphData(sybmbol: any) {
    return this.http.get(
      this.phase_two_commodity_base_url +
        `/commodity/energy/graph/week/${sybmbol}`
    );
  }

  getOTCEnergyMonthGraphData(sybmbol: any) {
    return this.http.get(
      this.phase_two_commodity_base_url +
        `/commodity/energy/graph/month/${sybmbol}`
    );
  }

  getOTCMetalsDetail(id: any) {
    return this.http.get(
      this.phase_two_commodity_base_url + `/commodity/metals/otcdto/id?id=${id}`
    );
  }

  getOTCMetalsDetailTable(symbol: any) {
    return this.http.get(
      this.phase_two_commodity_base_url +
        `/commodity/metals/otcquote/symbol?symbolDescription=${symbol}`
    );
  }

  getOTCMetalDropdown() {
    return this.http.get(
      this.phase_two_commodity_base_url + `/commodity/metals`
    );
  }

  getOTCMetalWeekGraphData(sybmbol: any) {
    return this.http.get(
      this.phase_two_commodity_base_url +
        `/commodity/metals/graph/week/${sybmbol}`
    );
  }

  getOTCMetalMonthGraphData(sybmbol: any) {
    return this.http.get(
      this.phase_two_commodity_base_url +
        `/commodity/metals/graph/month/${sybmbol}`
    );
  }

  getNewsPublisher() {
    return this.http.get(this.phase_two_base_url + `/news/IND/publisher`);
  }
  getNewsCountry() {
    return this.http.get(this.phase_two_base_url + `/news/country`);
  }

  // -------------- Commodity API END ---------------

  getNewsIndustry(page: any) {
    return this.http.get(this.phase_two_base_url + `/news/industry/${page}`);
  }
  getNewsCommodity(page: any) {
    return this.http.get(this.phase_two_base_url + `/news/commodity/${page}`);
  }
  getNewsUIEconomy(page: any) {
    return this.http.get(this.phase_two_base_url + `/news/econommy/${page}`);
  }

  getNewsUIcompany(page: any) {
    return this.http.get(this.phase_two_base_url + `/news/company/${page}`);
  }
  getNewsUIForex(page: any) {
    return this.http.get(this.phase_two_base_url + `/news/forex/${page}`);
  }
  getNewsUIGeneral(page: any) {
    return this.http.get(this.phase_two_base_url + `/news/general/${page}`);
  }
  getNewsCategorisedData(category: any) {
    return this.http.get(
      this.phase_two_base_url + `/news/newscategory?newsCategory=${category}`
    );
  }
  getNewsDataBasedOnId(id: any) {
    return this.http.get(this.phase_two_base_url + `/news/id/${id}`);
  }
  getLatestOrRelatedNews(params: any) {
    return this.http.get(this.phase_two_base_url + `/news/${params}`);
  }

  getNewsCategory() {
    return this.http.get(this.phase_two_base_url + `/news/category`);
  }

  getNewsIndustryDropDown() {
    return this.http.get(this.phase_two_base_url + `/news/category/industry`);
  }
  getNewsCommodityDropDown() {
    return this.http.get(this.phase_two_base_url + `/news/category/commodity`);
  }

  //--------- News API End --------

  // Company PEVC Phase 2
  getPEVCCompanies() {
    return this.http.get(
      this.phase_two_pevc_base_url + `/pevc/listed/companylist`
    );
  }

  getNumberOfActiveFunds(entityId: any) {
    return this.http.post(
      this.phase_two_pevc_base_url +
        `/pevc/listed/firmprofile/number_of_active_funds?factset_pevc_firm_entity_id=${entityId}`,
      {}
    );
  }

  getNumberOfFundsUnderMng(entityId: any) {
    return this.http.post(
      this.phase_two_pevc_base_url +
        `/pevc/listed/firmprofile/number_of_funds_under_management?factset_pevc_firm_entity_id=${entityId}`,
      {}
    );
  }

  getNumberOfAssetsUnderMng(entityId: any, currency: any) {
    return this.http.post(
      this.phase_two_pevc_base_url +
        `/pevc/listed/firmprofile/assets_under_management?factset_pevc_firm_entity_id=${entityId}&iso_code=${currency}`,
      {}
    );
  }

  getAvgFundSize(entityId: any, currency: any) {
    return this.http.post(
      this.phase_two_pevc_base_url +
        `/pevc/listed/firmprofile/average_fund_size?factset_pevc_firm_entity_id=${entityId}&iso_code=${currency}`,
      {}
    );
  }

  getpevcTotalInvestments(entityId: any) {
    return this.http.post(
      this.phase_two_pevc_base_url +
        `/pevc/listed/firmprofile/noofinvestment?factset_pevc_firm_entity_id=${entityId}`,
      {}
    );
  }

  getPEVCBenchmarkAnalysis(entityId: any, currency: any) {
    return this.http.post(
      this.phase_two_pevc_base_url +
        `/pevc/listed/benchmark?factset_pevc_firm_entity_id=${entityId}&page=1&pageSize=5&iso_code=${currency}`,
      {}
    );
  }

  getPEVCFundsInvestments(entityId: any, selectedPage: any, currency: any) {
    return this.http.post(
      this.phase_two_pevc_base_url +
        `/pevc/listed/fundsoffundinvestment?factset_pevc_firm_entity_id=${entityId}&page=${selectedPage}&pageSize=10&iso_code=${currency}`,
      {}
    );
  }

  getPEVCFirmStructure(entityId: any, selectedPage: any, currency: any) {
    return this.http.post(
      this.phase_two_pevc_base_url +
        `/pevc/listed/firmstructure?factset_pevc_firm_entity_id=${entityId}&page=${selectedPage}&pageSize=10&iso_code=${currency}`,
      {}
    );
  }

  getPEVCDirectInvestments(
    entityId: any,
    currency: any,
    pageSelected: any,
    colType: any,
    sortType: any
  ) {
    return this.http.post(
      this.phase_two_pevc_base_url +
        `/pevc/listed/directinvestment?factset_pevc_firm_entity_id=${entityId}&iso_code=${currency}&page=${pageSelected}&pageSize=10&column_name=${colType}&sort_type=${sortType}`,
      {}
    );
  }

  getPEVCmanagement(body: any) {
    return this.http.post(
      this.phase_two_pevc_base_url + `/pevc/listed/management`,
      body
    );
  }

  getPEVCDirectInvestmentsChild(
    entityId: any,
    portco_entity_id: any,
    currency: any
  ) {
    return this.http.post(
      this.phase_two_pevc_base_url +
        `/pevc/listed/expanddirectinvestment?factset_pevc_firm_entity_id=${entityId}&factset_portco_entity_id=${portco_entity_id}&iso_code=${currency}`,
      {}
    );
  }

  getPEVCCompanyModalList(selectedPage: any) {
    return this.http.post(
      this.phase_two_pevc_base_url +
        `/pevc/companylist?page=${selectedPage}&pageSize=50`,
      {}
    );
  }

  getPEVCNotListedBenchmark(entityId: any) {
    return this.http.post(
      this.phase_two_pevc_base_url +
        `/pevc/notlisted/benchmark?factset_pevc_firm_entity_id=${entityId}&page=1&pageSize=5&iso_code=INR`,
      {}
    );
  }

  getPEVCFundIds(fundName: any) {
    return this.http.post(
      this.phase_two_pevc_base_url +
        `/pevc/funds/funddetails?fund_name=${fundName}`,
      {}
    );
  }

  getPEVCNotListedDirectInvestments(
    entityId: any,
    currency: any,
    selectedPage: any,
    colType: any,
    sortType: any
  ) {
    return this.http.post(
      this.phase_two_pevc_base_url +
        `/pevc/notlisted/directinvestment?factset_pevc_firm_entity_id=${entityId}&iso_code=${currency}&page=${selectedPage}&pageSize=10&column_name=${colType}&sort_type=${sortType}`,
      {}
    );
  }

  getPEVCDirectInvestmentsChildNotListed(
    entityId: any,
    portco_entity_id: any,
    currency: any
  ) {
    return this.http.post(
      this.phase_two_pevc_base_url +
        `/pevc/notlisted/expanddirectinvestment?factset_pevc_firm_entity_id=${entityId}&factset_portco_entity_id=${portco_entity_id}&iso_code=${currency}`,
      {}
    );
  }

  getPEVCNotListedFundsInvestments(
    entityId: any,
    selectedPage: any,
    currency: any
  ) {
    return this.http.post(
      this.phase_two_pevc_base_url +
        `/pevc/notlisted/fundsoffundinvestment?factset_pevc_firm_entity_id=${entityId}&page=${selectedPage}&pageSize=10&iso_code=${currency}`,
      {}
    );
  }

  getPEVCNotListedFirmStructure(
    entityId: any,
    selectedPage: any,
    currency: any
  ) {
    return this.http.post(
      this.phase_two_pevc_base_url +
        `/pevc/notlisted/firmstructure?factset_pevc_firm_entity_id=${entityId}&page=${selectedPage}&pageSize=10&iso_code=${currency}`,
      {}
    );
  }

  getPEVCFundSummary(entityId: any) {
    return this.http.post(
      this.phase_two_pevc_base_url +
        `/pevc/funds/summary?factset_fund_entity_id=${entityId}`,
      {}
    );
  }

  getMyAccountData() {
    // const token = localStorage.getItem('access_token');
    const userId = localStorage.getItem('userId');
    return this.http.get(
      this.authBaseUrl + `/auth/user_transactions?userId=${userId}`,
      {}
    );
  }

  changePassword(value: any) {
    return this.http.put(this.authBaseUrl + `/user/change_password`, value);
  }

  getPEVCFundBenchmark(entityId: any, currency: any) {
    return this.http.post(
      this.phase_two_pevc_base_url +
        `/pevc/funds/benchmark?factset_fund_entity_id=${entityId}&iso_code=${currency}&page=1&pageSize=5`,
      {}
    );
  }

  getPEVCFundCountryFocus(entityId: any) {
    return this.http.post(
      this.phase_two_pevc_base_url +
        `/pevc/funds/countryfocus?factset_fund_entity_id=${entityId}`,
      {}
    );
  }

  getPEVCFundSectorFocus(entityId: any) {
    return this.http.post(
      this.phase_two_pevc_base_url +
        `/pevc/funds/sectorfocus?factset_fund_entity_id=${entityId}`,
      {}
    );
  }

  getPEVCFundDirectInvestments(
    entityId: any,
    currency: any,
    selectedPage: any,
    colType: any,
    sortType: any
  ) {
    return this.http.post(
      this.phase_two_pevc_base_url +
        `/pevc/funds/directinvestment?factset_fund_entity_id=${entityId}&iso_code=${currency}&page=${selectedPage}&pageSize=10&column_name=${colType}&sort_type=${sortType}`,
      {}
    );
  }

  getPEVCDirectInvestmentsChildFund(
    entityId: any,
    portco_entity_id: any,
    currency: any
  ) {
    return this.http.post(
      this.phase_two_pevc_base_url +
        `/pevc/funds/expanddirectinvestment?factset_fund_entity_id=${entityId}&factset_portco_entity_id=${portco_entity_id}&iso_code=${currency}`,
      {}
    );
  }

  getLimitedPartnersFund(entityId: any, selectedPage: any) {
    return this.http.post(
      this.phase_two_pevc_base_url +
        `/pevc/funds/limitedpartners?factset_fund_entity_id=${entityId}&iso_code=USD&page=${selectedPage}&pageSize=10`,
      {}
    );
  }

  getFundMng(entityId: any, name: any, selectedPage: any) {
    return this.http.post(
      this.phase_two_pevc_base_url +
        `/pevc/funds/management?factset_fund_entity_id=${entityId}&entity_proper_name=${name}&page=${selectedPage}&pageSize=10`,
      {}
    );
  }

  getCompanySecurityId(entityId: any) {
    return this.http.post(
      this.phase_two_pevc_base_url +
        `/pevc/listed/securityid?factset_entity_id=${entityId}`,
      {}
    );
  }

  getDirectInvestmentFirmExcelData(
    entityId: any,
    currency: any,
    firmName: any,
    yearFound: any,
    aum: any,
    noInvestments: any,
    avgFundSize: any,
    fundsMng: any,
    activeFunds: any
  ) {
    return this.http.get(
      this.phase_two_pevc_base_url +
        `/pevc/download/firm/directinvestment?factset_pevc_firm_entity_id=${entityId}&iso_code=${currency}&firm_name=${firmName}&year_founded=${yearFound}&aum=${aum}&no_of_investments=${noInvestments}&avg_fund_size=${avgFundSize}&no_of_funds_under_management=${fundsMng}&no_of_active_funds=${activeFunds}`,
      { responseType: 'blob', observe: 'response' }
    );
  }

  getDirectInvestmentExcelData(
    entityId: any,
    currency: any,
    fundName: any,
    firmName: any,
    initiationDate: any,
    amtSought: any,
    amtRaised: any,
    fundType: any,
    fundStatus: any,
    liqDate: any
  ) {
    return this.http.get(
      this.phase_two_pevc_base_url +
        `/pevc/download/fund/directinvestment?factset_fund_entity_id=${entityId}&iso_code=${currency}&fund_name=${fundName}&firm_name=${firmName}&initiation_date=${initiationDate}&amount_sought=${amtSought}&amount_raised=${amtRaised}&fund_type=${fundType}&fund_status=${fundStatus}&liquidation_date=${liqDate}`,
      { responseType: 'blob', observe: 'response' }
    );
  }

  getMngExcelData(name: any, entityId: any) {
    return this.http.post(
      this.baseurl +
        `/downloadOwnershipStructure?companyName=${name}&entityId=${entityId}`,
      {},
      { responseType: 'blob', observe: 'response' }
    );
  }

  getFirmStructureExcelData(
    entityId: any,
    currency: any,
    firmName: any,
    yearFound: any,
    aum: any,
    noInvestments: any,
    avgFundSize: any,
    fundsMng: any,
    activeFunds: any
  ) {
    return this.http.get(
      this.phase_two_pevc_base_url +
        `/pevc/download/firm/firmstructure?factset_pevc_firm_entity_id=${entityId}&iso_code=${currency}&firm_name=${firmName}&year_founded=${yearFound}&aum=${aum}&no_of_investments=${noInvestments}&avg_fund_size=${avgFundSize}&no_of_funds_under_management=${fundsMng}&no_of_active_funds=${activeFunds}`,
      { responseType: 'blob', observe: 'response' }
    );
  }

  getLimitedPartnersExcelData(
    entityId: any,
    currency: any,
    fundName: any,
    firmName: any,
    initiationDate: any,
    amtSought: any,
    amtRaised: any,
    fundType: any,
    fundStatus: any,
    liqDate: any
  ) {
    return this.http.get(
      this.phase_two_pevc_base_url +
        `/pevc/download/fund/limitedpartners?factset_fund_entity_id=${entityId}&iso_code=${currency}&fund_name=${fundName}&firm_name=${firmName}&initiation_date=${initiationDate}&amount_sought=${amtSought}&amount_raised=${amtRaised}&fund_type=${fundType}&fund_status=${fundStatus}&liquidation_date=${liqDate}`,
      { responseType: 'blob', observe: 'response' }
    );
  }

  getFundsofFundsExcelData(
    entityId: any,
    currency: any,
    firmName: any,
    yearFound: any,
    aum: any,
    noInvestments: any,
    avgFundSize: any,
    fundsMng: any,
    activeFunds: any
  ) {
    return this.http.get(
      this.phase_two_pevc_base_url +
        `/pevc/download/firm/fundsoffundinvestment?factset_pevc_firm_entity_id=${entityId}&iso_code=${currency}&firm_name=${firmName}&year_founded=${yearFound}&aum=${aum}&no_of_investments=${noInvestments}&avg_fund_size=${avgFundSize}&no_of_funds_under_management=${fundsMng}&no_of_active_funds=${activeFunds}`,
      { responseType: 'blob', observe: 'response' }
    );
  }

  getSearchCompanies(selectedPage: any, searchTerm: any) {
    return this.http.post(
      this.phase_two_pevc_base_url +
        `/pevc/searchcompanylist?page=${selectedPage}&pageSize=50&company_name=${searchTerm}`,
      {}
    );
  }

  getNotListedCompanies() {
    return this.http.get(
      this.phase_two_pevc_base_url + `/pevc/notlisted/companylist`
    );
  }

  getFundCompanies() {
    return this.http.get(
      this.phase_two_pevc_base_url + `/pevc/funds/companylist`
    );
  }

  getStatusFund() {
    return this.http.get(
      this.phase_two_pevc_base_url + `/pevc/fundpage/statuslist`
    );
  }

  getInstrumentUsed(entityId: any) {
    return this.http.post(
      this.phase_two_pevc_base_url +
        `/pevc/funds/instrumentused?factset_fund_entity_id=${entityId}`,
      {}
    );
  }

  getInstrumentType(entityId: any) {
    return this.http.post(
      this.phase_two_pevc_base_url +
        `/pevc/funds/instrumenttype?factset_fund_entity_id=${entityId}`,
      {}
    );
  }

  getContactPEVC(entityId: any) {
    return this.http.post(
      this.phase_two_pevc_base_url +
        `/pevc/listed/firmprofile/contact?factset_entity_id=${entityId}`,
      {}
    );
  }

  getWebsitePEVC(entityId: any) {
    return this.http.post(
      this.phase_two_pevc_base_url +
        `/pevc/listed/firmprofile/website?factset_pevc_firm_entity_id=${entityId}`,
      {}
    );
  }

  getAddressPEVC(entityId: any) {
    return this.http.post(
      this.phase_two_pevc_base_url +
        `/pevc/listed/firmprofile/address?factset_entity_id=${entityId}`,
      {}
    );
  }

  getFundsSearchCompanies(searchTerm: any) {
    return this.http.post(
      this.phase_two_pevc_base_url +
        `/pevc/funds/searchcompanylist?company_name=${searchTerm}`,
      {}
    );
  }

  getFundsSector() {
    return this.http.get(
      this.phase_two_pevc_base_url + `/pevc/funds/sectordropdown`
    );
  }

  getFundMetadata(fundEntityId: any, entityId: any) {
    return this.http.post(
      this.phase_two_pevc_base_url +
        `/pevc/funds/metadataofcompany?factset_fund_entity_id=${fundEntityId}&factset_entity_id=${entityId}`,
      {}
    );
  }

  getNotListedMetadata(entityId: any) {
    return this.http.post(
      this.phase_two_pevc_base_url +
        `/pevc/notlisted/metadataofcompany?factset_entity_id=${entityId}`,
      {}
    );
  }

  // Screener Phase 3
  getScreenerCountry() {
    return this.http.get(
      this.screenerTwoBaseUrl + `/screener/dropdown/country`
    );
  }

  getScreenerIndustry() {
    return this.http.get(
      this.screenerTwoBaseUrl + `/screener/dropdown/industry`
    );
  }

  getScreenerCurrency() {
    return this.http.get(
      this.screenerTwoBaseUrl + `/screener/dropdown/currency`
    );
  }

  getScreenerRegion() {
    return this.http.get(this.screenerTwoBaseUrl + `/screener/dropdown/region`);
  }

  getScreenerSector() {
    return this.http.get(this.screenerTwoBaseUrl + `/screener/dropdown/sector`);
  }

  getScreenerMetrics(tabId: any) {
    return this.http.get(
      this.screenerTwoBaseUrl + `/screener/get/category/${tabId}`
    );
  }

  // Watchlist API
  getCurrencyData() {
    return this.http.get(
      this.phase_three_watchlist_base_url + `/watchlist/currencylist`
    );
  }
  createWatchlist(body: any) {
    return this.http.post<any>(
      this.phase_three_watchlist_base_url + `/watchlist/create`,
      body
    );
  }
  getCompanyDropdownData() {
    return this.http.get(
      this.phase_three_watchlist_base_url + `/watchlist//companylist`
    );
  }
  getCompanyDropdownDataOnSearch(filterKeys: any) {
    return this.http.post<any>(
      this.phase_three_watchlist_base_url +
        `/watchlist/searchcompanylist?company_name=${filterKeys}`,
      {}
    );
  }
  getWatchlistNames(userId: any, watchlistType: any) {
    return this.http.post<any>(
      this.phase_three_watchlist_base_url +
        `/watchlist/watchlistListofType?user_id=${userId}&watchlist_type=${watchlistType}`,
      {}
    );
  }
  removeCompanyFromDropdown(
    userId: any,
    watchlistName: any,
    watchlistType: any,
    entityId: any
  ) {
    return this.http.post<any>(
      this.phase_three_watchlist_base_url +
        `/watchlist/deletedataentiy?user_id=${userId}&watchlist_name=${watchlistName}&watchlist_type=${watchlistType}&data_entity_id=${entityId}`,
      {}
    );
  }
  getWatchlistTableData(userId: any, watchlistName: any, type: any) {
    return this.http.post<any>(
      this.phase_three_watchlist_base_url +
        `/watchlist/dataentityList?user_id=${userId}&watchlist_name=${watchlistName}&watchlist_type=${type}`,
      {}
    );
  }
}
