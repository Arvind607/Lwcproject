public with sharing class APIIntegrationController {
    @future(callout=true)
    public static void sendContact(String actName,String actPhone,String conLastName,String conEmail){
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint('callout:SFDCB/services/apexrest/Accounts');
        request.setMethod('POST');
        JSONGenerator gen = JSON.createGenerator(true);    
        gen.writeStartObject();
        gen.writeStringField('actName',actName);
        gen.writeStringField('actPhone',actPhone);
        gen.writeStringField('conLastName',conLastName);
        gen.writeStringField('conEmail',conEmail);
        gen.writeEndObject();
        String jsonS=gen.getAsString();
        System.debug('Json String:'+jsonS);
        request.setBody(jsonS);
        request.setHeader('Content-Type','application/json');
        HttpResponse response = http.send(request);
        system.debug('request>>>'+request);
        // If the request is successful, parse the JSON response.
        system.debug('Response Code:-'+response.getStatusCode());
        system.debug('Response>>>'+response);

    }
    @future(callout=true)
    public static void sendDelContact(String actName,String actPhone,String conLastName,String conEmail){
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint('callout:SFDCB/services/apexrest/Accounts/?actName='+actName+'&actPhone='+actPhone+'&conLastName='+conLastName+'&conEmail='+conEmail);

        request.setMethod('DELETE');
        request.setHeader('Content-Type','application/json');
        HttpResponse response = http.send(request);
        system.debug('request>>>'+request);
        // If the request is successful, parse the JSON response.
        system.debug('Response Code:-'+response.getStatusCode());
        system.debug('Response>>>'+response);
    }


}
