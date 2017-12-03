import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [DatePipe]
})
export class AppComponent {

  constructor(private datePipe: DatePipe) { }

  title = 'app';
  date = new Date();
  entryTime = { hour: 8, minute: 0 };
  exitTime = { hour: 17, minute: 0 };
  pickerDate: any;
  todayPicker: any;
  searchedEntryTime: any;
  searchedExitTime: any;
  searchedDifference: any;
  currentDifference: any;
  saveMessage: string = null;

  ngOnInit() {
    const results = this.searchToday();
    if (results && results['entry'] && results['exit']){
      this.entryTime = { hour: results['entry'].hour, minute: results['entry'].minute };
      this.exitTime = { hour: results['exit'].hour, minute: results['exit'].minute };
      this.currentDifferenceCheck();
    }
  }
  saveTime() {
    let data = {};
    data['day'] = this.date;
    data['entryTime'] = JSON.stringify(this.entryTime);
    data['exitTime'] = JSON.stringify(this.exitTime);
    // this.currentDifferenceCheck();
    this.setCookie(`${this.datePipe.transform(this.date, 'dd-M-yyyy')}`, JSON.stringify(data));
  }

  currentDifferenceCheck() {
    const start = `${this.pad(this.entryTime.hour, 2)} : ${this.pad(this.entryTime.minute, 2)}`;
    const end = `${this.pad(this.exitTime.hour, 2)} : ${this.pad(this.exitTime.minute, 2)}`;
    this.currentDifference = this.timeDifference(start, end);
  }

  searchTime() {
    const searchResults = this.getCookie(`${this.datePipe.transform(this.pickerDate, 'dd-M-yyyy')}`);
    if (searchResults) {
      const entry = JSON.parse(searchResults.entryTime);
      const exit = JSON.parse(searchResults.exitTime);
      this.searchedEntryTime = `${this.pad(entry.hour, 2)} : ${this.pad(entry.minute, 2)}`;
      this.searchedExitTime = `${this.pad(exit.hour, 2)} : ${this.pad(exit.minute, 2)}`;
      this.searchedDifference = this.timeDifference(this.searchedEntryTime, this.searchedExitTime);
    }
  }

  searchToday() {
    const searchResults = this.getCookie(`${this.datePipe.transform(this.date, 'dd-M-yyyy')}`);
    if (searchResults) {
      const entry = JSON.parse(searchResults.entryTime);
      const exit = JSON.parse(searchResults.exitTime);
      const data = [];
      data['entry'] = entry;
      data['exit'] = exit;
      return data;
    }
  }


  getCookie(key: string) {
    return JSON.parse(window.localStorage.getItem(key));
  }

  setCookie(key, value) {
    return window.localStorage.setItem(key, value);
  }

  clearStorage() {
    return Object.keys(window.localStorage)
      .forEach(function (key) {
        if (/[0-9]{2}[-|\/]{1}[0-9]{2}[-|\/]{1}[0-9]{4}/.test(key)) {
          window.localStorage.removeItem(key);
        }
      });
  }

  pad(num, size) {
    let s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
  }

  timeDifference(entry, exit) {
    const t1 = entry.split(':');
    const t2 = exit​​​​​​​.split(':');
    const d1: any = Math.abs(t2[0] - t1[0]);
    const d2: any = Math.abs(t2[1] - t1[1]);
    return `${this.pad(d1 - 1, 2)} : ${this.pad(d2, 2)}`;
  }

  tappedEntry() {
    let time = new Date();
    let data = {};
    data['day'] = this.date;
    this.entryTime = {
      hour: time.getHours(),
      minute: time.getMinutes()
    }
    data['entryTime'] = JSON.stringify(this.entryTime);
    data['exitTime'] = JSON.stringify(this.exitTime);
    // this.currentDifferenceCheck();
    this.setCookie(`${this.datePipe.transform(this.date, 'dd-M-yyyy')}`, JSON.stringify(data));
    this.saveMessage = "Entry saved";
    setTimeout(() => {
      this.saveMessage = null;
    }, 1500);
  }

  tappedExit() {
    let time = new Date();
    let data = {};
    data['day'] = this.date;
    data['entryTime'] = JSON.stringify(this.entryTime);
    this.exitTime = {
      hour: time.getHours(),
      minute: time.getMinutes()
    }
    data['exitTime'] = JSON.stringify(this.exitTime);
    // this.currentDifferenceCheck();
    this.setCookie(`${this.datePipe.transform(this.date, 'dd-M-yyyy')}`, JSON.stringify(data));
    this.saveMessage = "Exit saved";
    setTimeout(() => {
      this.saveMessage = null;
    }, 1500);

  }

  onNotifyEntry(data) {
    if (data.hour && data.minute) {
      if (data.time == 'PM') {
        data.hour = Number(data.hour) + 12;
      }
      this.entryTime = { hour: data['hour'], minute: data['minute'] };
    }
  }

  onNotifyExit(data) {
    if (data.hour && data.minute) {
      if (data.time == 'PM') {
        data.hour = Number(data.hour) + 12;
      }
    }
    this.exitTime = { hour: data['hour'], minute: data['minute'] };
  }

}


