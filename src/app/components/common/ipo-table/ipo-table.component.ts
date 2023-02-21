import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UtilService } from 'src/app/services/util.service';
import { Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-ipo-table',
  templateUrl: './ipo-table.component.html',
  styleUrls: ['./ipo-table.component.scss'],
})
export class IpoTableComponent implements OnInit, OnChanges {
  @Input() ipo_table_data: any;
  @Input() paginate: any;
  @Input() currentPageSelected: any;
  @Input() mh: any;
  @Input() tableType: any;
  @Output() dashboardSelected = new EventEmitter<any>();
  @Output() rumoured_data = new EventEmitter<any>();
  @Output() changePage = new EventEmitter<any>();
  @Output() notesDataEmit = new EventEmitter<any>();
  @Output() notesEmitTableTwo = new EventEmitter<any>();
  @Output() nonotesAvailable = new EventEmitter<any>();
  @Output() sortedDataHandler = new EventEmitter<any>();
  @Input() itemsPerPage: any;
  @Input() display_none: any;
  @Input() type: any;
  @Input() fixedHeight: any;
  @Input() pageLength: any;
  @Input() pageChanged: any;
  @Input() sortType: any;
  iconIndex: any = 0;
  shortDown: boolean = false;
  shortUp: boolean = false;

  public labels: any = {
    previousLabel: '◄',
    nextLabel: '►',
  };

  constructor(
    public util: UtilService,
    public auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    let keyVal = this.ipo_table_data.title[0].key;
    this.ipo_table_data.value.sort(function (a: any, b: any) {
      var nameA = a[keyVal].toLowerCase(),
        nameB = b[keyVal].toLowerCase();
      if (nameA < nameB)
        //sort string ascending
        return -1;
      if (nameA > nameB) return 1;
      return 0; //default return value (no sorting)
    });
    console.log(this.sortType);
  }

  ngOnChanges(): void {
    if (this.pageChanged) {
      this.currentPageSelected = 1;
    }
  }

  onDataClick(data?: any, hover?: any) {
    if (this.type == 'forex-navigate') {
      this.dashboardSelected.emit(data);
    }
    if (this.type == 'ipo-navigate-comp') {
      if (hover) {
        // if (data?.rumoured) {

        this.rumoured_data.emit(data);
        this.auth.openIPOModal = false;
        // } else {
        // this.router.navigate(['financialmarketdata/company'], {
        //   queryParams: {
        //     comp_id: data.compId,
        //     company_name: data.companyName,
        //     currency: data.currency,
        //     tabName: 'company',
        //   },
        // });
        // this.rumoured_data.emit(data);
        // this.auth.openIPOModal = false;
        // }
      }
    }
  }

  dropCol(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.ipo_table_data.title,
      event.previousIndex,
      event.currentIndex
    );
  }

  sortByKey(key: any, i: any, sort?: any, sortingKey?: any) {
    if (this.sortType) {
      this.sortedDataHandler.emit(sortingKey);
    } else {
      if (sort) {
        this.iconIndex = i;
        this.shortDown = !this.shortDown;
        return this.ipo_table_data.value.sort((a: any, b: any) => {
          var x = a[key];
          var y = b[key];
          if (x == null || x == undefined) {
            x = isNaN(x) ? '' : 0;
          }
          if (y == null || y == undefined) {
            y = isNaN(y) ? '' : 0;
          }
          if (isNaN(x) && isNaN(y)) {
            if (this.shortDown == true) {
              return x < y ? 1 : x > y ? -1 : 0;
            } else {
              return x < y ? -1 : x > y ? 1 : 0;
            }
          }
          if (this.shortDown == true) {
            return x - y;
          } else {
            return y - x;
          }
        });
      }
    }
  }
  notesData = '';
  notesId = '';
  openNotesModal(content: any, key: any) {
    console.log(content);
    // console.log('clickd--', content);
    this.notesData = content.notes;
    this.notesId = content.compId;

    if (this.notesData !== 'null') {
      if (this.type == 'ipo-notes-one') {
        this.notesId = content.id;
        var obj = {
          notes: this.notesData,
          id: this.notesId,
        };
        this.notesDataEmit.emit(obj);
      }
      if (this.type == 'ipo-navigate-comp') {
        if (this.notesData !== '') {
          this.auth.openIPONotesModal = true;
        }
      }
      if (this.type == 'ipo-notes-two') {
        if (key === 'initialOffer') {
          this.notesEmitTableTwo.emit(content?.initalOffer);
        } else if (key === 'finalOffer') {
          this.notesEmitTableTwo.emit(content?.finalOfferNotes);
        } else if (key === 'revisedOffer') {
          this.notesEmitTableTwo.emit(content?.revisedOfferNotes);
        }
      }
    } else {
      this.nonotesAvailable.emit('');
    }
  }
  onPageChange(event: any) {
    this.currentPageSelected = event;
    this.changePage.emit(event);
  }
}
