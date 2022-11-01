import { LightningElement,api, wire, track } from 'lwc';
import getOpportunityRelatedProduct from '@salesforce/apex/OpportunityProductController.getOpportunityRelatedProduct';
//import addOpptLineItem from '@salesforce/apex/OpportunityProductController.addOpptLineItem';
import { fireEvent } from 'c/pubsub';
import { registerListener, unregisterAllListeners} from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';
const columns = [
    { label:'Select',type: "button", typeAttributes: {  
        label: 'Select',  
        name: 'Select',  
        title: 'Select',  
        disabled: false,  
        value: 'Select',  
        iconPosition: 'left'  
    } },
    { label: 'Product Name', fieldName: 'ProductLink',type: 'url', editable:false, typeAttributes:{label:{fieldName:'Name',target:'_blank'}}},
    { label: 'Product Code', fieldName: 'ProductCode', type: 'text', editable: false },
    { label: 'Product Family', fieldName: 'Family', type: 'text', editable: false }

];
export default class PriceBookProduct extends LightningElement {
   //@api searchtext;
    //@api pricebookid;
    @api recid;
    priceBookData=[];
    columns=columns;
    data=[];
    myMessage='Hello';
    isChanged=true;
    //currentPageRef=currentPageRef;

    @wire(CurrentPageReference)
    pageRef;



    connectedCallback(){
        registerListener('removeItem',this.handleRemove,this);
        console.log('RecId===>>',this.recid);
        getOpportunityRelatedProduct({'optId':this.recid})
        .then((result)=>{
            let currData=[];
            result.forEach(element => {
                let row={};
                row.Id=element.Id;
                row.Product2Id=element.Product2Id;
                row.Name=element.Product2.Name;
                row.ProductLink='/lightning/r/Product2/'+element.Product2Id+'/view';
                row.ProductCode=element.Product2.ProductCode;
                row.Family=element.Product2.Family;
                currData.push(row);
            });
            this.priceBookData=currData;
            this.data=currData;
        })
        .catch((error)=>{
            console.log(error);
        })
}

    // @api
    // getTableData(){
    //     console.log('getTableData called');
    //     console.log('PriceBookId:',priceBookId);
    //     getOpportunityRelatedProduct({'optId':this.recordId})
    //     .then((result)=>{
    //         let currData=[];
    //         result.forEach(element => {
    //             let row={};
    //             row.Id=element.Id;
    //             row.Product2Id=element.Product2Id;
    //             row.Name=element.Product2.Name;
    //             row.ProductLink='/lightning/r/Product2/'+element.Product2Id+'/view';
    //             row.ProductCode=element.Product2.ProductCode;
    //             row.Family=element.Product2.Family;
    //             currData.push(row);
    //         });
    //         this.priceBookData=currData;
    //         this.data=currData;


    //         console.log('PriceBook Data:',this.priceBookData);
    //     })


    // }
    handleRemove(rowData){
        try {
            console.log(';;;;;;;;');
        let currData=this.data;
        console.log('-->>>>>>:',rowData);
        let row={};
                row.Id=rowData.PriceBookEntryId;
                row.Product2Id=rowData.Product2Id;
                row.Name=rowData.Name;
                row.ProductLink='/lightning/r/Product2/'+rowData.Product2Id+'/view';
                row.ProductCode=rowData.ProductCode;
                row.Family=rowData.Family;
                currData.push(row);
                this.data=currData;
                console.log('Data:>>>>>',this.data);
                this.data=[...this.data];
        } catch (error) {
            console.log(error);
            
        }
        
    }


    disconnectCallback() {
        unregisterAllListeners(this);
    }

    @api
    searchProduct(searchKey){
        this.priceBookData=this.data;
        console.log('serach called');
        console.log('searchKey:',searchKey);
        let allRecords = this.priceBookData;
        var tempArray=[];
       
        var listIndex=[];
            for (let i = 0; i < allRecords.length; i++) {
            if(allRecords[i].Name.toLowerCase().includes(searchKey.toLowerCase())){
                console.log('inside if');
                listIndex.push(i);
            }}
            console.log(listIndex);
            listIndex.forEach(e=>{
                tempArray.push(allRecords[e]);
            })
        console.log('temp:',tempArray);
        this.data=tempArray;
        //console.log(this.priceBookData);

    }
    


    handleRowAction(event) {
        console.log('Handle called',event.detail.row);
        const actionName = event.detail.action.name;
        const rowData=event.detail.row;
        const row = event.detail.row;
        switch (actionName) {
            case 'Select':
                console.log('Handle called');
                this.addProduct(row);
                break;
        }
    }
    addProduct(deleteRow){
        try {
        
        let tempArr=JSON.parse(JSON.stringify(this.data));
        //this.priceBookData=[];
        let rowData=JSON.parse(JSON.stringify(deleteRow));
        // console.log('Row Dats:',rowData);
        fireEvent(this.pageRef, 'addItem', rowData);
        for(let i=0;i<tempArr.length;i++){
            if(rowData.Id==tempArr[i].Id){
                console.log('log');
                tempArr.splice(i,1);
                break;
            }
            
        }
        console.log('tempArr:',tempArr);
       //console.log('this.pricebook:',this.priceBookData);
        //this.data = tempArr;
        //tempArr=[];
        //tempArr=this.data;
        // console.log('data:',this.data);
        this.data  = Object.assign([], tempArr);
        //this.data = tempArr;
        console.log('Dataset:',this.data);
        // this.isChanged=false;
        // setInterval(() => {
        //     this.isChanged=true;
        // }, 5000);

        //this.isChanged=true;
            
        } catch (error) {
            console.log(error);
        }
        
    }
//

//let child = this.template.querySelector('c-price-book-product').save();

}