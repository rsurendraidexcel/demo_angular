import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { openDB, deleteDB, wrap, unwrap } from 'idb';
declare var window: any;
declare var MD5: any;
@Injectable({
  providedIn: 'root'
})
export class CyncIndexdbService {
  public storeName: string = "bookmark";
  public recentStoreName: string = 'recentvisited';
  public reportStoreName = 'reports';
  public version: number = 1;
  public dbName: string;
  public requestdb: any = {};
  public bookMark = new Subject();
  public bookMarkedList: any = [];

  public recentVisit = new Subject();  

  constructor(private router: Router) { }
  // Getter and Setter BookMarked
  public setBookMark(dataItem: any) {
    this.bookMark.next(dataItem);
  }
  public getBookMark() {
    return this.bookMark.asObservable();
  }

  // Getter and Setter RecentVisited
  public setRecentVisit(dataItem: any) {
    this.recentVisit.next(dataItem);
  }
  public getRecentVisit() {
    return this.recentVisit.asObservable();
  }

  async cyncdbInitialize(userdata: string) {
    console.log("<==BookMarkDB Intialize==>", userdata);
    const urlpart = new URL(window.origin).hostname.split('.');
    this.dbName = `${urlpart[0]}_${MD5(userdata)}`;
    const dbname = this.dbName;
    const storeName = this.storeName;
    const recentStoreName = this.recentStoreName;
    const report_store_name = this.reportStoreName;
    const version = this.version;
    let thisObj = this;
    const loadidb = async (thisObj) => {
      const request = await openDB(dbname, version, {
        upgrade(request, oldVersion, newVersion, transaction) {
          let storeObj = request.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
          storeObj.createIndex('menu_hierarchy', 'menu_hierarchy', { unique: true });

          let recent = request.createObjectStore(recentStoreName, {keyPath:'id', autoIncrement: true });
          recent.createIndex('menu_hierarchy', 'menu_hierarchy', {unique: true});

          if (!request.objectStoreNames.contains(report_store_name)) {
            let reports = request.createObjectStore(report_store_name, {keyPath:'id', autoIncrement: true });
            reports.createIndex('menu_hierarchy', 'menu_hierarchy', {unique: true}); 
          }

        }
      });

      // Read Data in store
      const cyncTx = await request.transaction(storeName, 'readonly');
      const cyncStore = await cyncTx.objectStore(storeName);  
      let bm = await cyncStore.getAll();
      thisObj.setBookMark(bm.sort(this.comparisonByName));
      thisObj.bookMarkedList = bm.sort(this.comparisonByName);

       //RecentlyMenuSection
      const cyncRecentTx = await request.transaction(recentStoreName, 'readonly');
      const cyncRecentStore = await cyncRecentTx.objectStore(recentStoreName);  
      let recentBM = await cyncRecentStore.getAll();
      thisObj.setRecentVisit(recentBM.sort(this.sortingByDate));

      return request;
    }
    this.requestdb = await loadidb(thisObj);
  }

  // Add New Item Method 
  addBookMarkItem(item: any) {
    let storname = this.storeName;
    let thisObj = this;
    var newAction = async (thisObj) => {
      const tx = await thisObj.requestdb.transaction(storname, 'readwrite');
      const store = await tx.objectStore(storname);
      await store.add(item);
      tx.complete;
      thisObj.setBookMark(await store.getAll());
      thisObj.bookMarkedList = await store.getAll();
    };
    newAction(thisObj);
  }

  // Add RecentNavigation Link
  resentAddbookMark(item : any ){
    let recentStore = this.recentStoreName;
    let thisObj = this;
    const newRecent = async (thisObj) => {
      const recentTx = await thisObj.requestdb.transaction(recentStore, 'readwrite');
      const recentstObj = await recentTx.objectStore(recentStore);
      const  recentCheckStore = await recentstObj.getAll();
      let  availability = recentCheckStore.filter( elm => elm.menu_hierarchy === item.menu_hierarchy);
      if(item.name!=""){
          if(availability.length==0){
              if(recentCheckStore.length < 5){
                await recentstObj.add(item);
                let recentBM = await recentstObj.getAll();
                thisObj.setRecentVisit(recentBM.sort(thisObj.sortingByDate) );
                recentTx.complete;
              }else {
                await thisObj.recordUpdated(recentCheckStore, recentstObj, item);
                let recentBM = await recentstObj.getAll();
                thisObj.setRecentVisit(recentBM.sort(thisObj.sortingByDate));
                recentTx.complete;
              }
          }else {
            await thisObj.replaceRecentStore(availability, recentstObj, item);
            let recentBM = await recentstObj.getAll();
            thisObj.setRecentVisit(recentBM.sort(thisObj.sortingByDate));
            recentTx.complete;
          }
       }
    }; 
    newRecent(thisObj);
  }

  // Read all Store Data
  async readAllStore() {
    let storname = this.storeName;
    let thisObj = this;
    let allData;
    var readAction = async (thisObj) => {
      const tx1 = await thisObj.requestdb.transaction(storname, 'readonly');
      const store1 = await tx1.objectStore(storname);
      tx1.complete;
      allData = await store1.getAll();
      return allData.sort(thisObj.comparisonByName);
    };
    return await readAction(thisObj);
  }

  // filter Selected Item  
  getFilterItem(data: any): any {
    let mh=data.join(" > ");
    let selectedItem = this.bookMarkedList.filter(elm => {
      return elm.menu_hierarchy === mh;
    });
   // console.table(this.bookMarkedList);
    return selectedItem;
  }

  // Delete Item From Store
  deleteBookMarkItem(id: number) {
    let storename = this.storeName;
    let thisObj = this;
    var deleteAction = async (thisObj) => {
      const tx3 = await thisObj.requestdb.transaction(storename, 'readwrite');
      const store3 = await tx3.objectStore(storename);
      await store3.delete(id);
      tx3.complete;
      console.log(`id=${id} record is deleted`);
      thisObj.setBookMark(await store3.getAll());
      thisObj.bookMarkedList = await store3.getAll();
    }
    deleteAction(thisObj);
  }

 // Coparison by Name
 comparisonByName(a: any, b: any ) {
    if ( a.custom_name < b.custom_name ){
      return -1;
    }
    if( a.custom_name > b.custom_name ){
      return 1;
    }
    return 0;
  }

 // Update Records
 async recordUpdated(exittingArray: any, objStore: any, newItem: any) {
       let delItem = exittingArray[0];
       await objStore.delete(delItem.id);
       return await objStore.add(newItem);
  }

 // Replace Recent Store Update Records
 async replaceRecentStore(availability: any, objStore: any, newItem: any) {
      let delItem = availability[0];
      await objStore.delete(delItem.id);
      return await objStore.add(newItem);
}
  // Recently menu sorting by Date  
  sortingByDate(a: any, b: any) {
    return b.current_date - a.current_date;
  }

}