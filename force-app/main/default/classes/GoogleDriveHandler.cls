public with sharing class GoogleDriveHandler {
    private static string clientId='391618701711-4osiuhtk9kifb8i3ja765arapnrr5alf.apps.googleusercontent.com';
    private static string clientSecret='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';
    private static string authUrl='https://accounts.google.com/o/oauth2/auth';
    private static string tokenUrl='https://oauth2.googleapis.com/token';
    private static string redirectUrl='https://d5g00000fowevean-dev-ed.develop.lightning.force.com/c/GDriveApp.app';
    
    @AuraEnabled
    public static String createAuthUrl(){
        try {
            String key = EncodingUtil.urlEncode(clientId,'UTF-8');
            String uri = EncodingUtil.urlEncode(redirectUrl,'UTF-8');
            String authuri = '';
            authuri = 'https://accounts.google.com/o/oauth2/auth?'+
            'client_id='+clientId+
            '&response_type=code'+
            '&scope=https://www.googleapis.com/auth/drive'+
            '&redirect_uri='+redirectUrl+'&prompt=consent'+
            '&include_granted_scopes=true'+
            '&access_type=offline';
            return authuri;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static String getAccessToken(String code){
        try {
              //Getting access token from google
        HttpRequest req = new HttpRequest();
        req.setMethod('POST');
        req.setEndpoint('https://oauth2.googleapis.com/token');
        req.setHeader('content-type', 'application/x-www-form-urlencoded');
        String messageBody = 'code='+code+'&client_id='+clientId+'&client_secret='+clientSecret+'&redirect_uri='+redirectUrl+'&grant_type=authorization_code';
        req.setHeader('Content-length', String.valueOf(messageBody.length()));
        req.setBody(messageBody);
        req.setTimeout(60*1000);

        Http h = new Http();
        String resp;
        HttpResponse res = h.send(req);
        resp = res.getBody();
         Map<String,object> responseMap =(Map<String,object>)JSON.deserializeUntyped(res.getBody()) ;  
          String token =  String.valueOf(responseMap.get('access_token'));
         return token;

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static Object getDriveData(String access_token){
        try {
            //GoogleApi__c gapi=[Select AccessToken__c from GoogleApi__c where ApiName__c='Drive'];

        system.debug('Access Info:'+access_token);
        HttpRequest req1 = new HttpRequest();
        req1.setMethod('GET');
        req1.setEndpoint('https://www.googleapis.com/drive/v3/files');
        req1.setHeader('content-type', 'application/x-www-form-urlencoded');
        req1.setHeader('Content-length', '0');
        req1.setHeader('Authorization', 'Bearer '+access_token);
        req1.setTimeout(60*1000);
        Http h2 = new http();
        HttpResponse res1 = h2.send(req1);
        system.debug('RES>>'+res1);
        //system.debug('response1 body>>'+ res1.getBody());
        system.debug('response1 body>>'+ res1.getStatus());
        //system.debug('response1 body>>'+ res1.getBodyAsBlob());
        //system.debug('Body:'+res1.getBody());
        Map<String,Object> results = (Map<String,Object>) JSON.deserializeUntyped(res1.getBody());
        Object resultList=results.get('files');
        System.debug('List of Object:'+resultList);
        system.debug('Result:'+results);
        //system.debug('Files>>'+res1.getBodyAsBlob().get('files'));

        return resultList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static Boolean uploadFileToDrive(String AccessToken,String base64File,String fileType,String fileName){
        try {
            // String payload = '{\"filename\": \"' + fileName +
            // ',\"fileType\": ' + fileType + 
            // ',\"base64\": ' + EncodingUtil.base64Decode(base64File) + '}';
            System.debug('Access Token:-'+AccessToken);
            String boundary = 'not_so_random_boundary';
            String delimiter = '\r\n--' + boundary + '\r\n';
            String close_delim = '\r\n--' + boundary + '--';
            String url = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=media';
            string authorizationHeader = 'Bearer ' + AccessToken; 
            //String bodyEncoded = EncodingUtil.base64Encode(base64File);  
            HttpRequest req = new HttpRequest();
            Blob bodyEncoded = EncodingUtil.base64Decode(base64File);
            //String body=delimiter + 'Content-Type: application/json; charset=UTF-8\r\n\r\n' + '{ "title" : "' + fileName + '","mimeType" : "'+ fileType + '"}' + delimiter + 'Content-Type:' + fileType + '\r\n' + 'Content-Transfer-Encoding: base64\r\n' + '\r\n' + bodyEncoded + close_delim;  
            req.setheader('Authorization',authorizationHeader);
            req.setHeader('Content-Type', 'image/'+fileType);
            req.setHeader('Content-Length',String.valueOf(bodyEncoded.size()));
            req.setMethod('POST'); 
            req.setEndpoint(url); 
            req.setBodyAsBlob(bodyEncoded); 
            //req.setBody(payload);
            Http h = new Http(); 
            Httpresponse resp = h.send(req);
            system.debug('Status Code=='+resp.getStatusCode());
            if(resp.getStatusCode()==200){
                System.debug('Request Body:'+req.getBody());
                System.debug('Response Body:'+resp.getBody());

            return true;
            }
            System.debug('Request Header:'+req.getHeader('Content-Type'));
            System.debug('Request Body:'+req.getBody());
            System.debug('Response Body:'+resp.getBody());
            return false;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

}
