import { Component, OnInit } from '@angular/core';
import { WatchlistServiceService } from '../watchlist-service.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-import-watchlist-model',
  templateUrl: './import-watchlist-model.component.html',
  styleUrls: ['./import-watchlist-model.component.scss'],
})
export class ImportWatchlistModelComponent implements OnInit {
  displayStyle = 'none';
  PopUpFlag: any;
  title = 'xlsRead';
  file: any;
  arrayBuffer: any;
  filelist: any;
  constructor(private service: WatchlistServiceService) {}

  ngOnInit(): void {
    this.service.$ispopUp.subscribe((res: any) => {
      if (res == 'watchlist') {
        this.openPopup();
      }
    });
  }
  openPopup() {
    this.displayStyle = 'block';
  }
  closePopup() {
    this.displayStyle = 'none';
  }
  tablemodel() {
    const formData = new FormData();
    formData.append('myfile', this.uploadFile, this.uploadFile.name);
    // console.log('hurreyyyyyy', formData);
    this.service.tablemodel();
    this.displayStyle = 'none';
  }
  uploadFile: any;
  addfile(event: any) {
    // this.file = event.target.files[0];
    // let fileReader = new FileReader();
    // fileReader.readAsArrayBuffer(this.file);
    // fileReader.onload = (e) => {
    //   this.arrayBuffer = fileReader.result;
    //   var data = new Uint8Array(this.arrayBuffer);
    //   var arr = new Array();
    //   for (var i = 0; i != data.length; ++i)
    //     arr[i] = String.fromCharCode(data[i]);
    //   var bstr = arr.join('');
    //   var workbook = XLSX.read(bstr, { type: 'binary' });
    //   var first_sheet_name = workbook.SheetNames[0];
    //   var worksheet = workbook.Sheets[first_sheet_name];
    //   console.log(XLSX.utils.sheet_to_json(worksheet, { raw: true }));
    //   var arraylist = XLSX.utils.sheet_to_json(worksheet, { raw: true });
    //   this.filelist = [];
    //   console.log('dataa', arraylist);
    this.uploadFile = event.target.files[0];
    console.log(this.uploadFile);
    // };
  }
}
