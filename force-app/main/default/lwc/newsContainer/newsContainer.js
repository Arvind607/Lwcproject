import { LightningElement } from 'lwc';
import getHeadlines from '@salesforce/apex/NewsAPIHander.getTopNews';
import getBusinessNews from '@salesforce/apex/NewsAPIHander.getBusinessNews';
import getSportsNews from '@salesforce/apex/NewsAPIHander.getSportsNews';
import getEntertainmentNews from '@salesforce/apex/NewsAPIHander.getEntertainmentNews';
import getTechnologyNews from '@salesforce/apex/NewsAPIHander.getTechnologyNews';
import getHealthNews from '@salesforce/apex/NewsAPIHander.getHealthNews';
export default class NewsContainer extends LightningElement {

    isModelOpen=false;
    topNewsData=[];
    healthNewsData=[];
    entertainmentNewsData=[];
    technologyNewsData=[];
    businessNewsData=[];
    sportsNewsData=[];
    showSpinner=true;
    openModel(){
        this.isModelOpen=true;
    }
    closeModel(){
        this.isModelOpen=false;
    }

    connectedCallback(){
        //this.showSpinner=true;
        getHeadlines()
        .then((result)=>{
            
            if(result!=null){
                var temp=JSON.parse(result).articles;
                //this.topNewsData.push(temp.articles);
                console.log('Result>>',JSON.parse(result));
               
                temp.forEach(Element => {
                    this.topNewsData.push(Element);
                    //console.log('Element>>>',Element);
                });
                console.log('Top News>>>>>',this.topNewsData);
               
            }
            else{
                console.log('Result=',result);
            }
        })
        .catch((error)=>{
            console.log(error);
        })
    }
    closeSpinner(){
        this.showSpinner=true;
        this.showSpinner=setInterval(()=>{
            this.showSpinner=false},2000);
        
        console.log('spinner>>>>>',this.showSpinner);

    }
    showBusinessNews(){
        this.closeSpinner();
        getBusinessNews()
        .then((result)=>{
            if(result!=null){
                var temp=JSON.parse(result).articles;
                console.log('Result>>',JSON.parse(result));
               
                temp.forEach(Element => {
                    this.businessNewsData.push(Element);
                });
                console.log('Business News>>>>>',this.businessNewsData);
               
            }
            else{
                console.log('Result=',result);
            }
        })
        .catch((error)=>{
            console.log(error);
        })
    }
    showSportsNews(){
        this.closeSpinner();
        getSportsNews()
        .then((result)=>{
            if(result!=null){
                var temp=JSON.parse(result).articles;
                console.log('Result>>',JSON.parse(result));
               
                temp.forEach(Element => {
                    this.sportsNewsData.push(Element);
                });
                console.log('Sports News>>>>>',this.sportsNewsData);
               
            }
            else{
                console.log('Result=',result);
            }
        })
        .catch((error)=>{
            console.log(error);
        })

    }
    showTechnologyNews(){
        this.closeSpinner();
        getTechnologyNews()
        .then((result)=>{
            if(result!=null){
                var temp=JSON.parse(result).articles;
                console.log('Result>>',JSON.parse(result));
               
                temp.forEach(Element => {
                    this.technologyNewsData.push(Element);
                });
                console.log('technology News>>>>>',this.technologyNewsData);
               
            }
            else{
                console.log('Result=',result);
            }
        })
        .catch((error)=>{
            console.log(error);
        })

    }
    showEntertainmentNews(){
        this.closeSpinner();
        getEntertainmentNews()
        .then((result)=>{
            if(result!=null){
                var temp=JSON.parse(result).articles;
                console.log('Result>>',JSON.parse(result));
               
                temp.forEach(Element => {
                    this.entertainmentNewsData.push(Element);
                });
                console.log('entertainment News>>>>>',this.entertainmentNewsData);
               
            }
            else{
                console.log('Result=',result);
            }
        })
        .catch((error)=>{
            console.log(error);
        })

    }
    showHealthNews(){
        this.closeSpinner();
        getHealthNews()
        .then((result)=>{
            if(result!=null){
                var temp=JSON.parse(result).articles;
                console.log('Result>>',JSON.parse(result));
               
                temp.forEach(Element => {
                    this.healthNewsData.push(Element);
                });
                console.log('Business News>>>>>',this.healthNewsData);
               
            }
            else{
                console.log('Result=',result);
            }
        })
        .catch((error)=>{
            console.log(error);
        })

    }
}