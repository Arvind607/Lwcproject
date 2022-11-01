import { LightningElement,api } from 'lwc';
import getStudent from '@salesforce/apex/UniversityController.getCourseRelatedStudent';


const columns = [
    { label: 'Name', fieldName: 'StudentLink',type:'url',typeAttributes:{label:{fieldName:'Name'}}},
];

export default class StudentList extends LightningElement {
    data=[];
    columns = columns;
    @api recordId;
    connectedCallback(){
        console.log(this.recordId);
        getStudent({'courseId':this.recordId})
            .then((result)=>{
                console.log('Result:',result);
                let row={};
                let currentData=[];
                result.forEach(element => {
                   row.StudentLink='/lightning/r/Student__c/'+element.Student__c+'/view';
                   row.Name=element.Student__r.Name;
                   currentData.push(row);
                });
                console.log('CurrentData:',currentData);
                this.data=currentData;
                console.log('Data',this.data);

            })
            .catch((error)=>{
                console.log(error);
            })
        
        
    }

}