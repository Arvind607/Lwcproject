public with sharing class NewsAPIHander {
    public NewsAPIHander() {

    }
    @AuraEnabled
    public static String getTopNews(){
        try {
            Http http = new Http();
            HttpRequest request = new HttpRequest();
            request.setEndpoint('https://newsapi.org/v2/top-headlines?country=in&apiKey=3abb7bb8143b49b1944e1cc42969e0d7');
            request.setMethod('GET');
            HttpResponse response = http.send(request);
            System.debug('Status Code:-'+response.getStatusCode());
            if(response.getStatusCode()==200){

                system.debug('Response Body:>>'+response.getBody());
                return response.getBody();
            }
            return null;

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static String getBusinessNews(){
        try {
            Http http = new Http();
            HttpRequest request = new HttpRequest();
            request.setEndpoint('https://newsapi.org/v2/top-headlines?country=in&category=business&apiKey=3abb7bb8143b49b1944e1cc42969e0d7');
            request.setMethod('GET');
            HttpResponse response = http.send(request);
            System.debug('Status Code:-'+response.getStatusCode());
            if(response.getStatusCode()==200){

                system.debug('Response Body:>>'+response.getBody());
                return response.getBody();
            }
            return null;

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static String getSportsNews(){
        try {
            Http http = new Http();
            HttpRequest request = new HttpRequest();
            request.setEndpoint('https://newsapi.org/v2/top-headlines?country=in&category=sports&apiKey=3abb7bb8143b49b1944e1cc42969e0d7');
            request.setMethod('GET');
            HttpResponse response = http.send(request);
            System.debug('Status Code:-'+response.getStatusCode());
            if(response.getStatusCode()==200){

                system.debug('Response Body:>>'+response.getBody());
                return response.getBody();
            }
            return null;

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static String getEntertainmentNews(){
        try {
            Http http = new Http();
            HttpRequest request = new HttpRequest();
            request.setEndpoint('https://newsapi.org/v2/top-headlines?country=in&category=entertainment&apiKey=3abb7bb8143b49b1944e1cc42969e0d7');
            request.setMethod('GET');
            HttpResponse response = http.send(request);
            System.debug('Status Code:-'+response.getStatusCode());
            if(response.getStatusCode()==200){

                system.debug('Response Body:>>'+response.getBody());
                return response.getBody();
            }
            return null;

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static String getTechnologyNews(){
        try {
            Http http = new Http();
            HttpRequest request = new HttpRequest();
            request.setEndpoint('https://newsapi.org/v2/top-headlines?country=in&category=technology&apiKey=3abb7bb8143b49b1944e1cc42969e0d7');
            request.setMethod('GET');
            HttpResponse response = http.send(request);
            System.debug('Status Code:-'+response.getStatusCode());
            if(response.getStatusCode()==200){

                system.debug('Response Body:>>'+response.getBody());
                return response.getBody();
            }
            return null;

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static String getHealthNews(){
        try {
            Http http = new Http();
            HttpRequest request = new HttpRequest();
            request.setEndpoint('https://newsapi.org/v2/top-headlines?country=in&category=health&apiKey=3abb7bb8143b49b1944e1cc42969e0d7');
            request.setMethod('GET');
            HttpResponse response = http.send(request);
            System.debug('Status Code:-'+response.getStatusCode());
            if(response.getStatusCode()==200){

                system.debug('Response Body:>>'+response.getBody());
                return response.getBody();
            }
            return null;

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }


}
