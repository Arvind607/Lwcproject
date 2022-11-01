import { LightningElement, wire, api, track} from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getStudents from '@salesforce/apex/studentDatatable.getStudents';    
import { ShowToastEvent } from 'lightning/platformShowToastEvent'; // for toast notification
import Student__c from '@salesforce/schema/Student__c';  // import object
import Name from '@salesforce/schema/Student__c.Name';  // import fields
import Phone__c from '@salesforce/schema/Student__c.Phone__c';
import Gender__c from '@salesforce/schema/Student__c.Gender__c';
import Father_s_Name__c from '@salesforce/schema/Student__c.Father_s_Name__c';
import Email__c from '@salesforce/schema/Student__c.Email__c';
import DOB__c from '@salesforce/schema/Student__c.DOB__c';
import Class__c from '@salesforce/schema/Student__c.Class__c';

const columns = [{
        label: 'Name',
        fieldName: 'Name',
        type: 'text',
        sortable: true
    },
    {
        label: 'Phone',
        fieldName: 'Phone__c',
        sortable: true
    },
    {
        label: 'Gender',
        fieldName: 'Gender__c',
        sortable: true
    },
    {
        label: "Father's Name",
        fieldName: 'Father_s_Name__c',
        sortable: true
    },
    {
        label: 'Email',
        fieldName: 'Email__c',
        sortable: true
    },
    {
        label: 'DOB',
        fieldName: 'DOB__c',
        sortable: true
    }
];

export default class LightningDatatableExample extends LightningElement {
    @track value;
    @track error;
    @track data;
    @api sortedDirection = 'asc';
    @api sortedBy = 'Name';
    @api searchKey = '';
    result;
    @track allSelectedRows = [];
    @track page = 1; 
    @track items = []; 
    @track data = []; 
    @track columns; 
    @track startingRecord = 1;
    @track endingRecord = 0; 
    @track pageSize = 5; 
    @track totalRecountCount = 0;
    @track totalPage = 0;
    isPageChanged = false;
    initialLoad = true;
    mapoppNameVsOpp = new Map();;

    Studentobject = Student__c;  // object type
    StudentFields =[Name, Phone__c,Gender__c, Father_s_Name__c, Email__c, DOB__c,Class__c]; // fields to be showin in form
    // shows toast message after student creation
    handleStudentCreated(){
        // Run code when student is created.
        const showSuccess = new ShowToastEvent({
            title: 'Success!!',
            message: 'Student has been registered',
            variant: 'Success',
        });
        this.dispatchEvent(showSuccess);
    }
  
    @wire(getStudents, {searchKey: '$searchKey', sortBy: '$sortedBy', sortDirection: '$sortedDirection'})
    wiredAccounts({ error, data }) {
        if (data) {
            this.processRecords(data);
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.data = undefined;
        }
    }

    processRecords(data){
        this.items = data;
            this.totalRecountCount = data.length; 
            this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize); 
            
            this.data = this.items.slice(0,this.pageSize); 
            this.endingRecord = this.pageSize;
            this.columns = columns;
    }
    //clicking on previous button this method will be called
    previousHandler() {
        this.isPageChanged = true;
        if (this.page > 1) {
            this.page = this.page - 1; //decrease page by 1
            this.displayRecordPerPage(this.page);
        }
          var selectedIds = [];
          for(var i=0; i<this.allSelectedRows.length;i++){
            selectedIds.push(this.allSelectedRows[i].Id);
          }
        this.template.querySelector(
            '[data-id="table"]'
          ).selectedRows = selectedIds;
    }

    //clicking on next button this method will be called
    nextHandler() {
        this.isPageChanged = true;
        if((this.page<this.totalPage) && this.page !== this.totalPage){
            this.page = this.page + 1; //increase page by 1
            this.displayRecordPerPage(this.page);            
        }
          var selectedIds = [];
          for(var i=0; i<this.allSelectedRows.length;i++){
            selectedIds.push(this.allSelectedRows[i].Id);
          }
        this.template.querySelector(
            '[data-id="table"]'
          ).selectedRows = selectedIds;
    }

    //this method displays records page by page
    displayRecordPerPage(page){

        this.startingRecord = ((page -1) * this.pageSize) ;
        this.endingRecord = (this.pageSize * page);

        this.endingRecord = (this.endingRecord > this.totalRecountCount) 
                            ? this.totalRecountCount : this.endingRecord; 

        this.data = this.items.slice(this.startingRecord, this.endingRecord);
        this.startingRecord = this.startingRecord + 1;
    }    
    
    sortColumns( event ) {
        this.sortedBy = event.detail.fieldName;
        this.sortedDirection = event.detail.sortDirection;
        return refreshApex(this.result);
        
    }
    
    onRowSelection(event){
        if(!this.isPageChanged || this.initialLoad){
            if(this.initialLoad) this.initialLoad = false;
            this.processSelectedRows(event.detail.selectedRows);
        }else{
            this.isPageChanged = false;
            this.initialLoad =true;
        }
        
    }
    processSelectedRows(selectedOpps){
        var newMap = new Map();
        for(var i=0; i<selectedOpps.length;i++){
            if(!this.allSelectedRows.includes(selectedOpps[i])){
                this.allSelectedRows.push(selectedOpps[i]);
            }
            this.mapoppNameVsOpp.set(selectedOpps[i].Name, selectedOpps[i]);
            newMap.set(selectedOpps[i].Name, selectedOpps[i]);
        }
        for(let [key,value] of this.mapoppNameVsOpp.entries()){
            if(newMap.size<=0 || (!newMap.has(key) && this.initialLoad)){
                const index = this.allSelectedRows.indexOf(value);
                if (index > -1) {
                    this.allSelectedRows.splice(index, 1); 
                }
            }
        }
    }
    
    handleKeyChange( event ) {
        this.searchKey = event.target.value;
        var data = [];
        for(var i=0; i<this.items.length;i++){
            if(this.items[i]!= undefined && this.items[i].Name.includes(this.searchKey)){
                data.push(this.items[i]);
            }
        }
        this.processRecords(data);
    }

    // modal

    @track isModalOpen = false;
    openModal() {
        // to open modal set isModalOpen tarck value as true
        this.isModalOpen = true;
    }
    closeModal() {
        // to close modal set isModalOpen tarck value as false
        this.isModalOpen = false;
    }
    submitDetails() {
        // to close modal set isModalOpen tarck value as false
        //Add your code to call apex method or do some processing
        this.isModalOpen = false;
    }

}