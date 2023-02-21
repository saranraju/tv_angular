import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FinancialMarketDataService } from 'src/app/services/financialmarketdata.service';
import { saveAs } from 'file-saver';
@Component({
  selector: 'app-ipo-notes-modal',
  templateUrl: './ipo-notes-modal.component.html',
  styleUrls: ['./ipo-notes-modal.component.scss'],
})
export class IpoNotesModalComponent implements OnInit {
  @Input() notesData: any;
  @Input() notesID: any;
  // note_detail = {
  // detail: '',
  //     `
  //     (As on 08/12/2020) USNASDAQ_A​

  // Daily List Date 12/08/2020 13:09​

  // Effective Date 12/10/2020​

  // Issue Event Anticipated Security Additions​

  // Symbol ABNB​

  // Company Name Airbnb, Inc. Class A Common Stock​

  // Market Category Q​

  // Listing Center NASDAQ Stock Market​

  // First Date Traded​

  // NOTES for each Entry Pending SEC Release​

  // Description Class A Common Stock​

  // Issue Type c​

  // Trade Unit Quantity 100​

  // Transfer Agent Computershare Trust Company, Inc.​

  // ​

  // (As on 01/12/2020) US_SEC_IPO​

  // AIRBNB, INC.​

  // FORM S-1/A​

  // 51,914,894 Shares Class A Common Stock​

  // This is an initial public offering of shares of Class A common stock of Airbnb, Inc. We are offering 50,000,000 shares of our Class A common stock. The selling stockholders identified in this prospectus are offering 1,914,894 shares of Class A common stock. We will not receive any of the proceeds from the sale of shares by the selling stockholders. Prior to this offering, there has been no public market for our Class A common stock. It is currently estimated that the initial public offering price will be between USD44.00 and USD50.00 per share. We have applied to list our Class A common stock on the Nasdaq Global Select Market under the symbol  ABNB.​

  // Initial public offering price  Per Share USD​

  // We have granted to the underwriters the option for a period of 30 days to purchase up to an additional 5,000,000 shares of Class A common stock from us on the same terms as set forth above​

  // The underwriters expect to deliver the shares of Class A common stock to purchasers on , 2020.​

  // ​

  // the offering​

  // Class A common stock offered by us 50,000,000 shares​

  // Option to purchase additional shares of Class A common stock offered by us 5,000,000 shares​

  // Class A common stock offered by the selling stockholders 1,914,894 shares​

  // Class A common stock to be outstanding after this offering​

  // 98,224,667 shares (or 103,224,667 shares if the underwriters exercise their option to purchase additional shares of Class A common stock in full)​

  // ​

  // ​

  // (As on 16/11/2020) US_SEC_IPO_0051​

  // AIRBNB, INC.​

  // FORM S-1 (Securities Registration Statement)​

  // Filed 11/16/20​

  // Address 888 BRANNAN ST.​

  // SAN FRANCISCO, CA, 94103
  //     `,
  // };
  constructor(
    public auth: AuthService,
    private financialMarketData: FinancialMarketDataService
  ) {}

  note_detail: any;
  ngOnInit(): void {
    console.log('w3333333100000', this.notesData, 'notr', this.notesID, 'iddd');
    // this.getIpoNotes();
  }
  // notesData: any;
  // getIpoNotes() {
  //   this.financialMarketData.getIpoNotesData().subscribe((res: any) => {
  //     this.notesData = res;
  //   });
  // }

  ipoModalClose() {
    this.auth.openIPONotesModal = false;
    this.auth.ipoNotesModalOne = false;
  }

  downloadNotes() {
    var params = this.notesID;
    this.financialMarketData.downloadIpoData(`notes-sheet/${params}`).subscribe(
      (res: any) => {
        // ++this.count_res;
        // this.util.checkCountValue(this.total_count_res, this.count_res);
        const blob = new Blob([res.body], {
          type: 'application/vnd.ms.excel',
        });
        const file = new File([blob], '' + `ipo-notes.xlsx`, {
          type: 'application/vnd.ms.excel',
        });
        saveAs(file);
      },
      (err) => {
        console.error(err);
      }
    );
  }
}
