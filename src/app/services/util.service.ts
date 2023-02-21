import { Injectable } from '@angular/core';
import { LoaderServiceService } from '../modules/financialmarketdata/components/loader-service.service';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  startDate: any;
  selectedDatetype: any = '1Y';
  today = new Date();
  endDate: any = new Date(
    this.today.getFullYear(),
    this.today.getMonth(),
    this.today.getDate() - 1
  );
  // For redirection instance
  tabInstance: any;
  constructor(public loaderService: LoaderServiceService) {}

  /*customized standard format*/

  standardformatCustom(n: any, todec: any, unit: any) {
    if (typeof n == 'string') {
      if (n === 'N/A') return 'N/A';
      else n = parseFloat(n);
    }

    if (n === null) return '';
    else if (n < 0) {
      /** this is you negative number* */

      return '-' + this.formatNumberWithCommasCustom(-n, todec, unit);
    } else {
      /** *** this is your positive number****** */

      return this.formatNumberWithCommasCustom(n, todec, unit);
    }
  }

  formatNumberWithCommasCustom(x: any, todec: any, unit: any) {
    var ranges = [
      {
        divider: 1e18,
      },
      {
        divider: 1e15,
      },
      {
        divider: 1e12,
      },
      {
        divider: 1e9,
      },
      {
        divider: 1e6,
      },
      {
        divider: 1e3,
      },
    ];
    if (x % 10 == 0 && x < 10000000) {
      if (unit.indexOf('%') >= 0 || unit.indexOf('x') >= 0) {
        return x
          ?.toFixed(todec)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      } else if (x >= 1000 && x <= 9999999) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      } else {
        return x
          ?.toFixed(1)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
    } else if (x >= 1000 && x <= 9999999) {
      if (unit.indexOf('%') >= 0 || unit.indexOf('x') >= 0) {
        x = x.toFixed(todec);
      } else {
        x = x?.toFixed(0);
      }
      var parts = x.toString().split('.');
      if (typeof parts[1] !== 'undefined') {
        parts[1] = parts[1].substring(
          0,
          parts[1].length > todec ? todec : parts[1].length
        );
        // parts[1] = parts[1].substring(0,todec);
      }
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      if (unit.indexOf('%') >= 0 || unit.indexOf('x') >= 0)
        return parts.join('.');
      return parts[0];
    } else if (x > 10000000) {
      if (typeof x !== 'undefined')
        return x.toLocaleString(undefined, { maximumFractionDigits: 0 });
    } else {
      if (x < 10) {
        return x?.toFixed(todec);
      } else {
        // check if number have decimal place or not if not return as it is
        let _t = x.toString().split('.');
        todec = 1;
        if (unit.indexOf('x') >= 0) {
          todec = 2;
        }
        if (typeof _t[1] !== 'undefined') {
          return (
            Math.round(parseFloat(x) * Math.pow(10, todec)) /
            Math.pow(10, todec)
          )
            ?.toFixed(todec)
            .toString();
        } else return x?.toFixed(todec);
      }
    }
  }

  setDateHandler(key: any) {
    this.selectedDatetype = key;
    let end_date = this.endDate;
    switch (key) {
      case '1W':
        this.startDate = new Date(
          end_date.getFullYear(),
          end_date.getMonth(),
          end_date.getDate() - 7
        );
        break;
      case '1M':
        this.startDate = new Date(
          end_date.getFullYear(),
          end_date.getMonth() - 1,
          end_date.getDate() - 1
        );
        break;
      case '3M':
        this.startDate = new Date(
          end_date.getFullYear(),
          end_date.getMonth() - 3,
          end_date.getDate() - 1
        );
        break;
      case '6M':
        this.startDate = new Date(
          end_date.getFullYear(),
          end_date.getMonth() - 6,
          end_date.getDate() - 1
        );
        break;
      case '1Y':
        this.startDate = new Date(
          end_date.getFullYear() - 1,
          end_date.getMonth(),
          end_date.getDate() - 1
        );
        break;
      case '5Y':
        this.startDate = new Date(
          end_date.getFullYear() - 5,
          end_date.getMonth(),
          end_date.getDate() - 1
        );
        break;
      case '10Y':
        this.startDate = new Date(
          end_date.getFullYear() - 10,
          end_date.getMonth(),
          end_date.getDate() - 1
        );
        break;
      case 'MAX':
        this.startDate = '';
        break;
      default:
    }
  }

  numberWithCommas(x: any) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  standardFormat(n: any, todec: any, unit: any) {
    if (n === '-') {
      return '-';
    }
    if (typeof n == 'string') {
      if (n === 'N/A') return 'N/A';
      else n = parseFloat(n);
    }
    if (n === null) return '';
    else if (n < 0) {
      /** this is you negative number* */
      return '-' + this.formatNumberWithCommas(-n, todec, unit);
    } else {
      /** *** this is your positive number****** */
      return this.formatNumberWithCommas(n, todec, unit);
    }
  }

  formatNumberWithCommas(x: any, todec: any, unit: any) {
    var ranges = [
      {
        divider: 1e18,
        suffix: ' P',
      },
      {
        divider: 1e15,
        suffix: ' Q',
      },
      {
        divider: 1e12,
        suffix: ' T',
      },
      {
        divider: 1e9,
        suffix: ' B',
      },
      {
        divider: 1e6,
        suffix: ' M',
      },
      {
        divider: 1e3,
        suffix: ' k',
      },
    ];

    if (x == 0) {
      return x.toFixed(2).toString();
    }

    if (x % 10 == 0 && x < 1000000) {
      // return x.toFixed(todec).toString().replace(/\B(?=(\d{3})+(?!\d))/g,
      // ",");
      if (unit.indexOf('%') >= 0 || unit.indexOf('x') >= 0)
        return x
          .toFixed(todec)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      else {
        if (x < 1000) {
          return x
            .toFixed(1)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        } else {
          return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
      }
    } else if (x >= 1000 && x <= 999999) {
      if (unit.indexOf('%') >= 0 || unit.indexOf('x') >= 0) {
        x = x.toFixed(todec);
      } else {
        x = x.toFixed(0);
      }
      var parts = x.toString().split('.');
      if (typeof parts[1] !== 'undefined') {
        parts[1] = parts[1].substring(
          0,
          parts[1].length > todec ? todec : parts[1].length
        );
        // parts[1] = parts[1].substring(0,todec);
      }
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      if (unit.indexOf('%') >= 0 || unit.indexOf('x') >= 0)
        return parts.join('.');
      return parts[0];
    } else if (x >= 1000000) {
      for (var i = 0; i < ranges.length; i++) {
        if (x >= ranges[i].divider) {
          var val = (x / ranges[i].divider).toString() + ranges[i].suffix;
          if (val.indexOf('.') >= 0)
            return (
              val.substring(0, val.indexOf('.') + (1 + todec)) +
              ranges[i].suffix
            );
          else return val;
        }
      }
      if (typeof x !== 'undefined') return x.toString();
    } else {
      if (x < 10) {
        return x.toFixed(todec);
      } else {
        // check if number have decimal place or not if not return as it is
        let _t = x.toString().split('.');
        todec = 1;
        if (unit.indexOf('x') >= 0) {
          todec = 2;
        }

        if (typeof _t[1] !== 'undefined') {
          return (
            Math.round(parseFloat(x) * Math.pow(10, todec)) /
            Math.pow(10, todec)
          )
            .toFixed(todec)
            .toString();
        } else return x.toFixed(todec);
      }
    }
  }

  loader: boolean = false;
  checkCountValue(total_count: any, current_count: any) {
    if (current_count == total_count) {
      this.loaderService.display(false);
    }
  }
}
