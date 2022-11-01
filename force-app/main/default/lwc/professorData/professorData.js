import { LightningElement } from 'lwc';
import image from '@salesforce/resourceUrl/ImageResource';
import getProfessors from '@salesforce/apex/UniversityController.getProfessorData';
export default class ProfessorData extends LightningElement {
    techImage=image+'/UniversityImage/teacher.png';
    professorData=[];
    connectedCallback(){
        getProfessors()
        .then((result)=>{
            let currentData=[];
            result.forEach(element => {
                currentData.push(element);
            });
            
            this.professorData=currentData;
            console.log(this.professorData);

        })
        .catch((error)=>{
            console.log(error);
        })
    

    }
}