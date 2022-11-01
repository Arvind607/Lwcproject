import { LightningElement,api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getOpportunityProducts from '@salesforce/apex/OpportunityProductController.getOpportunityProducts';
import updateOpptLineItem from '@salesforce/apex/OpportunityProductController.updateOpptLineItem';
//import deleteProduct from '@salesforce/apex/OpportunityProductController.removeProduct';
import { CurrentPageReference } from 'lightning/navigation';
import {fireEvent, registerListener, unregisterAllListeners} from 'c/pubsub';

// const actions = [{ label: 'Remove', name: 'Remove',type:"button" }]
const columns = [
    { label:'Action',type: "button", typeAttributes: {  
        label: 'Remove',  
        name: 'Remove',  
        title: 'Remove',  
        disabled: false,  
        value: 'Remove',  
        iconPosition: 'left'  
    } },
    { label: 'Product Name', fieldName: 'ProductLink',type: 'url', editable:false, typeAttributes:{label:{fieldName:'Name',target:'_blank'}}},
    { label: 'Product Quantity', fieldName: 'Quantity', editable: true },
    // { label: 'Id', fieldName: 'Id', editable: false },
    { label: 'Price Per Unit', fieldName: 'UnitPrice', editable: true },
    { label: 'Total Price', fieldName: 'TotalPrice', type: 'text', editable: false },
    { label: 'Product Code', fieldName: 'ProductCode', type: 'text', editable: false },
    { label: 'Product Family', fieldName: 'Family', type: 'text', editable: false },

    
];

export default class ProductDataTable extends LightningElement {
    data = [];
    @api recid;
    columns = columns;
    rowOffset = 0;
    productData=[];
    newRows=[];
    totalItem=0;
    draftValues = [];
    isDelete=false;
    removeProductData=[];
    

    
    @wire(CurrentPageReference)
    pageRef;



    showToast(t,m,v){
        console.log('>>>>>',t);
        const event1 = new ShowToastEvent({
            title: t,
            message:m,
            variant:v
                
        });
        this.dispatchEvent(event1);

    }



    connectedCallback(){
        registerListener('addItem',this.handleEvent,this);
        console.log('RecordId:--->',this.recid);
        getOpportunityProducts({'recordId':this.recid})
        .then((result)=>{
            this.productData=result;
            //let row={};
            let currData=[];
            if(result!=null){
                console.log(result);
                result.forEach(e => {
                    let row={};
                    row.Id=e.Id;
                    row.Product2Id=e.Product2Id;
                    row.ProductLink='/lightning/r/Product2/'+e.Product2Id+'/view';
                    row.Name=e.Product2.Name;
                    row.Family=e.Product2.Family;
                    row.ProductCode=e.ProductCode;
                    row.UnitPrice=e.UnitPrice;
                    row.Quantity=e.Quantity;
                    row.TotalPrice=e.TotalPrice;
                    currData.push(row);

                });
                this.data=currData;
                this.totalItem=this.data.length;
                console.log('Data:',this.data);
        }
        else{
            this.data=[];
        }

        })
        .catch((error)=>{
            console.log(error);
        }

        )
    }

   



    @api
    handleSave(event) {
        try {
            var count=0;
            //console.log('Handle Save called');
            console.log('Data to delete>>>>',this.removeProductData);
        console.log('New Rows:',this.newRows);
        var updatedRecord=[];
        //this.template.querySelector('lightning-datatable').getSelectedRows();
        console.log('>>>>>>>',this.template.querySelector("lightning-datatable").draftValues);
        const records=this.template.querySelector("lightning-datatable").draftValues;
        var draftRecords=JSON.parse(JSON.stringify(records));
        console.log('Draft values:',draftRecords);
        console.log('Length:',draftRecords.length);
        for(var i=0;i<draftRecords.length;i++){
           console.log('Data:');
           let row={};
           if(draftRecords[i].Id.includes('row')){
            console.log('Inside if');
            //console.log('Inif',e.Id.include('row'));
            //row.Id=e.Id;
            let index=draftRecords[i].Id.slice(draftRecords[i].Id.indexOf('-')+1,draftRecords[i].Id.length);
            console.log(index);
            //console.log();
            row.OpportunityId=this.recid;
            //console.log('>>>>>',this.newRows[index]);
            //console.log('>>>>>pbentryId',this.newRows[index].PriceBookEntryId);
            row.PricebookEntryId=this.newRows[index].PriceBookEntryId;
            //console.log('>>>>>Product',this.newRows[index].Product2Id);
            row.Product2Id=this.newRows[index].Product2Id;
            //console.log('>>>>>ProductCode',this.newRows[index].ProductCode);
            row.ProductCode=this.newRows[index].ProductCode;
            if(draftRecords[i].Quantity==null||draftRecords[i].Quantity==''){
                this.showToast('Error','Please Fill Quantity','error');
                count++;
            }
            else if(draftRecords[i].Quantity<=0){
                this.showToast('Error','Quantity cannot be zero or less than zero','error');
                count++;
            }
            if(draftRecords[i].UnitPrice==null||draftRecords[i].UnitPrice==''){
                this.showToast('Error','Please Fill Unit Price','error');
                count++;
            }
            else if(draftRecords[i].UnitPrice<=0){
                this.showToast('Error','Unit Price cannot be zero or less than zero','error');
                count++;
            }
            if(draftRecords[i].UnitPrice!=null && draftRecords[i].Quantity!=null){
                console.log('nested If');
            row.UnitPrice=draftRecords[i].UnitPrice;
            row.Quantity=draftRecords[i].Quantity;
            
            }
           }
           else{
            console.log('inside Else');
            row.Id=draftRecords[i].Id;
            if(draftRecords[i].Quantity==null||draftRecords[i].Quantity==''){
                this.showToast('Error','Please Fill Quantity','error');
                count++;
            }
            else if(draftRecords[i].Quantity<=0){
                this.showToast('Error','Quantity cannot be zero or less than zero','error');
                count++;
            }
            if(draftRecords[i].UnitPrice && (draftRecords[i].UnitPrice==null||draftRecords[i].UnitPrice=='')){
                this.showToast('Error','Please Fill Unit Price','error');
                count++;
            }
            else if((draftRecords[i].UnitPrice)&&(draftRecords[i].UnitPrice<=0)){
                this.showToast('Error','Unit Price cannot be zero or less than zero','error');
                count++;
            }
            
            if(draftRecords[i].UnitPrice!=null){
               
                row.UnitPrice=draftRecords[i].UnitPrice;
            }
            if(draftRecords[i].Quantity!=null){
                
                row.Quantity=draftRecords[i].Quantity;
            }

           }
           updatedRecord.push(row);
         
        }
        console.log('New Rows to upsert:',updatedRecord);
        if(count==0){
        updateOpptLineItem({'oliList':updatedRecord,'listOfRemove':this.removeProductData});
        this.showToast('Success','Records has been updated successfully','success');
        return false;
        }
        else{
            return true;
        }
       
            
        } catch (error) {
            console.log(error);
            return false;
        }
        
       
    }
    handleEvent(rowData){
        //console.log('connect callback is call again');
        // this.connectedCallback();
        //console.log('RowData:',rowData);
        try {
            let newObj={
                // Id:null,
                OpportunityId:this.recid,
                Product2Id:rowData.Product2Id,
                Name:rowData.Name,
                PriceBookEntryId:rowData.Id,
                ProductCode:rowData.ProductCode,
                ProductLink:'/lightning/r/Product2/'+rowData.Product2Id+'/view',
                UnitPrice:'',
                Quantity:'',
                Family:rowData.Family,
                TotalPrice:'',
            }
            console.log('data:',this.data);
        
            console.log('New Object:',newObj);
            //allData.push(newObj);
            this.newRows.push(JSON.parse(JSON.stringify(newObj)));
            if(this.data.length==0){
                console.log('>>>>>In');
                let arr=[];
                arr.push(newObj);
                this.data=arr;
            }
            else{
                console.log('>>>>>Into');
                let arr=this.data;
                arr.push(newObj);
                this.data=arr;
            }
            
            this.data = [...this.data];
            console.log('Data of table:>>',this.data);
            this.totalItem=this.data.length;
        } catch (error) {
            console.log(error);
            
        }
        
    }
    disconnectCallback() {
        unregisterAllListeners(this);
    }

    handleRowAction(event) {
        // console.log('Handle called',event.detail.row);
        const actionName = event.detail.action.name;
        const rowData=event.detail.row;
        const row = event.detail.row.Id;
        switch (actionName) {
            case 'Remove':
                console.log('Handle called');
                this.removeProduct(row,rowData);
                break;
        }
    }
   
    removeProduct(row,rowData){
        try {
            console.log('Row Data:',JSON.parse(JSON.stringify(rowData)));
            console.log('Row Id:',row);
            //var list=[];
            let dataToRemove=[];
            var rData=JSON.parse(JSON.stringify(rowData));
            var alldata=this.data;
            for(let i=0;i<alldata.length;i++){
                if((alldata[i].Id&&alldata[i].Id==rData.Id)||(alldata[i].Name==rData.Name)){
                    console.log('index',i);
                    this.data.splice(i,1);
                    break;
                }
                
            }
            if(rData.Id){
                dataToRemove.push(rData);
                this.removeProductData=dataToRemove;
        }
            console.log('Data To Be Removed:',this.removeProductData);
            fireEvent(this.pageRef, 'removeItem', rowData);
            this.data = [...this.data];
            //this.data=tempData;
            this.totalItem=this.data.length;
            console.log('Data:',this.data);
     
            
        } catch (error) {
           console.log(error); 
        }
        }


    
}