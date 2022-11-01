public class APIHandler {
    // @AuraEnabled
    // public static void makeCallout(String recId){
    //     System.debug('RecordId:-'+recId);
    //     Http http = new Http();
    //     HttpRequest request = new HttpRequest();
    //     request.setEndpoint('callout:SFDCB/services/apexrest/Accounts');
    //     Account ac=[Select Id,Name,Phone from Account where Id=:recId];
    //     system.debug('Account Detail:-'+ac);
    //     request.setMethod('GET');
    //     request.setHeader('Name',String.valueOf(ac.Name));
    //     request.setHeader('Phone',String.valueOf(ac.Phone));
    //     HttpResponse response = http.send(request);
    //     system.debug('request>>>'+request);
    //     // If the request is successful, parse the JSON response.
    //     system.debug('Response Code:-'+response.getStatusCode());
    //     system.debug('Response>>>'+response);
    //     if(response.getStatusCode() == 301 || response.getStatusCode() == 302)
    //     {    
    //      request.setEndpoint(response.getHeader('Location'));
    //      response = new Http().send(request);
    //     }
    //     if(response.getStatusCode() == 200) {
    //         system.debug('Response:'+response.getBody());
    //       List<Object> results = (List<Object>) JSON.deserializeUntyped(response.getBody());
    //         if(!results.isEmpty()){
    //             List<Contact> conList=new List<Contact>();
    //             for(Object result:results){
    //                 Map<String,Object> mpOfContact=(Map<String,Object>) result;
    //                 Contact c=new Contact();
    //                 c.AccountId=recId;
    //                 c.LastName=String.valueOf(mpOfContact.get('Name'));
    //                 c.Phone=String.valueOf(mpOfContact.get('Phone'));
    //                 c.Email=String.valueOf(mpOfContact.get('Email'));
    //                 conList.add(c);
    //             }
    //             system.debug('ContactList:-'+conList);
    //             if(!conList.isEmpty()){
    //                 system.debug('ContactList:-'+conList);
    //                 insert conList;
    //             }
    //         }
    //         system.debug(results);
    //     }
    //     else{
    //         system.debug('Response:-'+response.getBody());
    //     }
    // }
    @AuraEnabled
    public static void getDataUsingAPI(String recId){
        try {
            System.debug('RecordId:-'+recId);
            Http http = new Http();
            HttpRequest request = new HttpRequest();
            request.setEndpoint('callout:SFDCB/services/apexrest/Accounts');
            Account ac=[Select Id,Name,Phone from Account where Id=:recId];
            system.debug('Account Detail:-'+ac);
            request.setMethod('GET');
            request.setHeader('Name',String.valueOf(ac.Name));
            request.setHeader('Phone',String.valueOf(ac.Phone));
            HttpResponse response = http.send(request);
            system.debug('request>>>'+request);
            // If the request is successful, parse the JSON response.
            system.debug('Response Code:-'+response.getStatusCode());
            system.debug('Response>>>'+response);
            if(response.getStatusCode() == 301 || response.getStatusCode() == 302)
            {    
             request.setEndpoint(response.getHeader('Location'));
             response = new Http().send(request);
            }
            if(response.getStatusCode() == 200 && response.getBody()!='') {
                system.debug('Response:'+response.getBody());
              List<Object> results = (List<Object>) JSON.deserializeUntyped(response.getBody());
                if(!results.isEmpty()){
                    List<Contact> conList=new List<Contact>();
                    for(Object result:results){
                        Map<String,Object> mpOfContact=(Map<String,Object>) result;
                        Contact c=new Contact();
                        c.AccountId=recId;
                        c.LastName=String.valueOf(mpOfContact.get('Name'));
                        c.Phone=String.valueOf(mpOfContact.get('Phone'));
                        c.Email=String.valueOf(mpOfContact.get('Email'));
                        conList.add(c);
                    }
                    system.debug('ContactList:-'+conList);
                    if(!conList.isEmpty()){
                        system.debug('ContactList:-'+conList);
                        insert conList;
                    }
                }
                system.debug(results);
            }
            else{
                system.debug('Response:-'+response.getBody());
            }
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static Boolean sendWhatsAppMessage(String contId,String message){
        try {
            System.debug('RecordId:-'+contId);
            String apiToken='EAALuZBSbZBvpABADN399PK3wp8ay6kBde6bYJ5cr5o2uzMAtc9J6iGlCrVJbGxIHPjj3YoPAM4XUZCZAJ9PcaZA98BGPqGUwKhq77s1ZCBrIoeGCo5JEfd4NsoaHKV5pv0ytX8ZA9x48XzOOhV7yGwovMFCanPhKefhqmkJi328xA9ql4l8GhYn';
            Http http = new Http();
            HttpRequest request = new HttpRequest();
            request.setEndpoint('https://graph.facebook.com/v14.0/109355808618616/messages');
            Contact con=[Select Id,Name,Phone from Contact where Id=:contId];
            System.debug('Phone:'+con.Phone);
            request.setHeader('Authorization','Bearer '+apiToken);
            //String body='{"messaging_product":"whatsapp","to":"'+con.Phone+'","type":"template", "template":{"name":"hello_world","language":{"code":"en_US"}}';
            //String body='{"messaging_product":"whatsapp", "to":"'+con.Phone+'","type":"template","template":{"name":"salesforce_msg","language":{"code":"en","policy": "deterministic"},"components": [{"type": "body","parameters": [{"type":"text","text":"'+con.Name+'"},{"type":"text","text":"'+message+'"}]}]}}';
            request.setBody(body);
            request.setMethod('POST');
            request.setHeader('Content-type','application/json');
            HttpResponse response = http.send(request);
            system.debug('request>>>'+request);
            // If the request is successful, parse the JSON response.
            system.debug('Response Code:-'+response.getStatusCode());
            system.debug('Response>>>'+response.getBody());
            if(response.getStatusCode()==200){
                return true;
            }
            return false;

                

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}