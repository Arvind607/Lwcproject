import { LightningElement, wire,track,api } from 'lwc';
import getAccessToken from '@salesforce/apex/GoogleDriveHandler.getAccessToken';
import getAuthUrl from '@salesforce/apex/GoogleDriveHandler.createAuthUrl';
import getDriveData from '@salesforce/apex/GoogleDriveHandler.getDriveData';
import uploadFileToDrive from '@salesforce/apex/GoogleDriveHandler.uploadFileToDrive';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// import { NavigationMixin } from 'lightning/navigation';


const columns = [
    { label: 'File Name', fieldName: 'name' },
    { label: 'File Type', fieldName: 'fileType', type: 'text',cellAttributes: {
        iconName: { fieldName: 'fileIcon' },
        iconPosition: 'right',
        

    } },
];

export default class GoogleDriveCmp extends LightningElement {
    
    
    @track code='';
    isModelOpen=false;
    @track url='';
    accessToken='';
    showData=false;
    divData='';
    data=[];
    columns=columns;
    fileData='';
    fileName='';

   
    connectedCallback() {
    //console.log('Url>>>:',this.pageRef);
    let urlString=window.location.href;
    let paramString = urlString.split('?')[1];
        let queryString = new URLSearchParams(paramString);
        for(let pair of queryString.entries()) {
            if(pair[0]=='code'){
            this.code=pair[1];
            console.log("Key is:" + pair[0]);
            console.log("Value is:" + pair[1]);
        }}
        if(this.code!=''){
            console.log('Code is:',this.code);
            getAccessToken({'code':this.code})
            .then((result)=>{
                this.accessToken=result;
                console.log('Access Token=',result);

            })

        }

    }
    // @wire
    doAuth(){
        console.log('Called do auth>>>>>>>>>>>');
        console.log('Code:',this.code);
        getAuthUrl()
        .then((result)=>{
            console.log(result);
            window.location.href=result;


        })
        .catch((error)=>{
            console.log(error);
        })

    }
    getData(){
        console.log('called getDrive data');
        console.log('Access Token:'+this.accessToken);
        if(this.accessToken!=''){
        getDriveData({'access_token':this.accessToken})
        .then((result)=>{
            console.log('>>>>>>>rs');
            result.forEach(element => {
                let row={};
                row.name=element.name;
                let index=element.mimeType.lastIndexOf('.');
                //console.log(index);
                console.log('MIME TYpe>>>',element.mimeType);
                row.fileType=element.mimeType.substring(index+1);
                if(row.fileType=='document'){
                    row.fileIcon='doctype:gdoc';
                }
                else if(row.fileType=='spredsheet'){
                    row.fileIcon='doctype:gsheet';
                }
                else if(row.fileType=='pdf'){
                    row.fileIcon='doctype:pdf';
                }
                else if(row.fileType=='folder'){
                    row.fileIcon='doctype:folder';
                }
                else{
                    row.fileIcon='doctype:video';
                }
                row.ResourceType=element.kind;
                this.data.push(row);
                row={};
                
            });
            console.log('Data>>>',this.data);
            if(this.data){
                this.showData=true;
            }
            //console.log('Result:'+result);

        })
        .catch((error)=>{
            console.log(error);
        })

        }
    }
    showModel(){
        this.isModelOpen=true;
    }
    closeModel(){
        this.isModelOpen=false;
    }
    handleFilesChange(event){
        try {
            const file =  event.target.files[0];
            
            console.log();
        console.log('File>>>>>>>:'+JSON.stringify(file));
        var fileType=file.type.split('/')[0];
        console.log('File Type:',fileType);
        var reader = new FileReader();
        reader.onload = () => {
            var base64 = reader.result.split(',')[1];
            this.fileData = {
                'filename': file.name,
                'base64': base64,
                'fileType':fileType
            }
            this.fileName=file.name;
            //console.log('File Type',file.name.substring(file.name.lastIndexOf('.')+1));
            console.log(this.fileData);
        }
        reader.readAsDataURL(file);
        } catch (error) {
            console.log(error);
        }
        
    }
    uploadFileData(){
        //this.accessToken='ya29.a0Aa4xrXPbRwHLtdu0x7k-pgLwo4FqfRGWLjadnO_Xw9SxjT9UjAfVZSTrOsYS9AF72Y4gnQ3PALPpWy9Okv9SQOTQ50TQt7cmDZtvZF5GFPRffbS80YJxc9STh1mYaYKhTDZUNAy5BH__TRfpQki9h_8eVEAsaCgYKATASARMSFQEjDvL9NSWzjQg3EPvjlz-qUyt7SA0163';
        //this.accessToken='ya29.a0Aa4xrXPhFIiPxxGLKcGSWsH_ryAf5Weh-8c59WCzsxq9iOAOQyRyVL2kztTbvshLJM1QmweY7yb5JYHHTTTmAqhaf1NnSAicbLR-Xiz_bytirZca3MhBg3QGCXslor1Zp70KBKT7ag2XjcbXD6XUE9s9R-wKaCgYKATASARISFQEjDvL97mGyr3S3p7Gq5kiSVsnHnQ0163';
        //this.accessToken='ya29.a0Aa4xrXMtb8NneLcl2D9fY_5mkh6pzfvnRT_ZHx5NrmxowlP3UXaWoCMuYhA86O7Xy78AVMpVH_0WDKZ50EV1Y6J9StK5nezFwB40ouNiiMvcvZldeGpstfeZL9IIepcK64Mzjqt7n8e-fOj9vWhPMEr6H0hCaCgYKATASARASFQEjDvL93thZZK-O7W3_eGhQChPalw0163';
        console.log('File Data:',this.fileData);
        console.log('Base:',this.fileData.base64);
        console.log('File Name:',this.fileData.filename);
        console.log('File Type:',this.fileData.fileType);
        if(this.accessToken!=''){
        uploadFileToDrive({'AccessToken':this.accessToken,'base64File':this.fileData.base64,'fileType':this.fileData.fileType,'fileName':this.fileData.filename})
        .then((result)=>{
            console.log('Result:',result);
            if(result=='true'){
                console.log('Result:',result);
            const event1 = new ShowToastEvent({
                title: 'Success',
                message:'File has been successfully uploaded',
                variant:'Sucess'
                    
            });
            this.dispatchEvent(event1);
        }
        })
        .catch((error)=>{
            console.log(error);
        })
    }}
}