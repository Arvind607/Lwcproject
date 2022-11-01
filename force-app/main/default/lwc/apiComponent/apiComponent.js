import { LightningElement,wire,api } from 'lwc';
import makeCallOut from '@salesforce/apex/APIHandler.getDataUsingAPI';
export default class ApiComponent extends LightningElement {

@api recordId;

// @wire(makeCallOut,{'recId':this.recordId})
// // wireHandler(){
//     console.log('RecordId=',this.recordId);
// }
// connectedCallback(){
//     console.log('APi Called');
// }
@api 
async invoke(){
    let params={
        'recId':this.recordId
    };
    makeCallOut(params)
    .then((result)=>{
        console.log('Api Called');

    })
}

}