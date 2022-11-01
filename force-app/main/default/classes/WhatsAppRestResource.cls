@RestResource(urlMapping='/webhooks/*')
global class WhatsAppRestResource {

    @HttpGet
    global static Integer doGet(){
        // RestRequest request=RestContext.request;
        // RestResponse response=RestContext.response;
        // if(request.params.get('hub.verify_token')=='6Cel800D5g00000FoWEv8885g000009CGHDcbnTNEed6WiLP4kCEngvOvX94FS44iAlglwzre2YVmwhpEXyhpeTn866vYqCcz3qhP5XMtUg'){
        //     response.responseBody=Blob.valueOf(request.params.get('hub.challenge'));
        // }
        RestRequest req = RestContext.request;
        Map<String,String> retRespo = req.params;
        RestResponse res = RestContext.response;
        System.debug(res.responseBody);
        System.debug(res.headers);
        // Map<String,String> mp = req.headers;
        // System.debug('mp : '+mp);
        // for(String str: mp.keySet()){
        //     System.debug(str+' :: '+mp.get(str));
        // }
      return Integer.valueOf(retRespo.get('hub.challenge'));


    }
    @HttpPost
    global static void doPost(){

        System.debug('WhatsApp message request: '+RestContext.request.requestBody.toString());

    }
}
