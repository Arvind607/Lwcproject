@RestResource(urlMapping='/Accounts/*')
global with sharing class AccountRestResource {
    @HttpGet
    global static List<Account> getAccounts(){
        List<Account> accList=[Select Id,Name from Account LIMIT 20];
        return accList;
    }
    @HttpPost
    global static Boolean addContact(String actName,String actPhone,String conLastName,String conEmail){

        System.debug('AccountName:'+actName);
        System.debug('AccountPhone:'+actPhone);
        System.debug('Contact LastName:'+conLastName);
        System.debug('Contact Email:'+conEmail);

        Account ac=[Select Id from Account where Name=:actName AND Phone=:actPhone LIMIT 1];
        if(ac!=null){
        Contact con=new Contact(LastName=conLastName,Email=conEmail,AccountId=ac.Id);
        TriggerStatus.Status=false;
        System.debug('Status:'+TriggerStatus.Status);
        insert con;
        System.debug('Contact is Created>>>>>>:'+con);
        return true;
        }
        return false;

    }
    @HttpDelete
    global static Boolean deleteContact(){
        RestRequest request = RestContext.request;
        System.debug(request.params);
        String actName=request.params.get('actName');
        String actPhone=request.params.get('actPhone');
        String conLastName=request.params.get('conLastName');
        String conEmail=request.params.get('conEmail');
        
        Contact c=[Select Id from Contact where Account.Name=:actName AND Account.Phone=:actPhone AND LastName=:conLastName AND Email=:conEmail];
        if(c!=null){ 
            TriggerStatus.deleteStatus=false;
         delete c;
        return true;
        }
        return false;
    }


}
