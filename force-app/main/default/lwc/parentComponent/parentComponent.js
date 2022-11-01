import { LightningElement,api } from 'lwc';
import modal from "@salesforce/resourceUrl/modalCss";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
//import Id from '@salesforce/schema/Opportunity.Id';

import getAllPriceBook from '@salesforce/apex/OpportunityProductController.getAllPriceBook';
import { loadStyle } from "lightning/platformResourceLoader";
export default class ParentComponent extends LightningElement {
    pboptions=[];
    isModelOpen=true;
    searchKey='';
    priceBookId='';

    @api recordId;

// @api set recordId(recordId) {
//     this._recordId = recordId;

//     // do your thing right here with this.recordId / value
// }

// get recordId() {
//     return this._recordId;
// }
    connectedCallback(){
        loadStyle(this, modal);
        //this.dispatchEvent(new CloseActionScreenEvent());
        getAllPriceBook()
        .then((result)=>{
            //console.log('RecordId:',this.recordId);
            let currData=[];
            result.forEach(element => {
                let row={
                    label:element.Name,value:element.Id
                }
                currData.push(row);
                
            });
            this.pboptions=currData;
            console.log('Options:',this.pboptions);

        })
        .catch((error)=>{
            console.log(error);
        })

    }
    openModel(){
        this.isModelOpen=true;
    }
    closeModel(){
        this.isModelOpen=false;

    }
    handleKeyChange( event ) {
        this.searchKey = event.target.value;
        console.log(this.searchKey);
        this.template.querySelector('c-price-book-product').searchProduct(this.searchKey);
    }
    handleChange(event) {
        this.priceBookId = event.detail.value;
        //console.log('PriceBookId:',this.priceBookId);
        //this.template.querySelector('c-price-book-product').getTableData(this.priceBookId);
    }
    saveChanges(event){
        try {
            console.log('Save Changes called');
            let value=this.template.querySelector('c-product-data-table').handleSave(event);
            console.log('value:',value);
            this.isModelOpen=value;
            console.log(this.isModelOpen);
        } catch (error) {
            console.log(error);
        }
        
    }


}