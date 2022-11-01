import { LightningElement,api } from 'lwc';
import sendWhatsAppMessage from '@salesforce/apex/APIHandler.sendWhatsAppMessage';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


export default class WhatsAppSender extends LightningElement {

    @api recordId;
    message;
    showToast(t,m,v){
        console.log('>>>>>',t);
        const event1 = new ShowToastEvent({
            title: t,
            message:m,
            variant:v
                
        });
        this.dispatchEvent(event1);

    }
    handleMessage(event){
        this.message=event.target.value;
        console.log(this.message);
    }

    sendMessage(){
        console.log('RecordId:',this.recordId);
        console.log('Message:',this.message);
        sendWhatsAppMessage({'contId':this.recordId,'message':this.message})
        .then((result)=>{
            if(result==true){
                this.showToast('Success','Message has been sent successfully','success');
            }
        })
    }
}