public with sharing class OpportunityProductController {
    public OpportunityProductController() {

    }
    @AuraEnabled
    public static List<OpportunityLineItem> getOpportunityProducts(String recordId){
        try {
            System.debug('RecordId:'+recordId);
            if(recordId!=null){
                List<OpportunityLineItem> oliList=[Select Product2.Name,Product2.Family,ProductCode,Quantity,TotalPrice,UnitPrice from OpportunityLineItem where OpportunityId=:recordId];
                if(!oliList.isEmpty()){
                    return oliList;
                }
                return null;
            }
            return null;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    @AuraEnabled
    public static Boolean removeProduct(String recordId){
        try {
            if(recordId!=null){
                System.debug(recordId);
                List<OpportunityLineItem> oliList=[Select Id from OpportunityLineItem where Id=:recordId];
                delete oliList;
                System.debug('Record Deleted');
                return true;
            }
            return false;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

        @AuraEnabled
        public static List<PriceBook2> getAllPriceBook(){
            try {
                List<PriceBook2> priceBookList=[Select Id,Name from PriceBook2];
                if(!priceBookList.isEmpty()){
                    return priceBookList;
                }
                return null;
            } catch (Exception e) {
                throw new AuraHandledException(e.getMessage());
            }
        }
        @AuraEnabled
        public static List<PriceBookEntry> getAllProductRelatedPriceBook(String priceBookId){
            try {
                System.debug(priceBookId);
                if(priceBookId!=null){
                    List<PriceBookEntry> pbEntryList=[Select Id,Product2Id,Product2.Name,Product2.Family,Product2.ProductCode from PriceBookEntry where PriceBook2Id=:priceBookId];
                    if(!pbEntryList.isEmpty()){
                        return pbEntryList;
                    }
                    return null;
                }
                return null;
            } catch (Exception e) {
                throw new AuraHandledException(e.getMessage());
            }
        }
        @AuraEnabled
        public static void updateOpptLineItem(List<OpportunityLineItem> oliList,List<OpportunityLineItem> listOfRemove){
            try {
                System.debug(oliList);
                System.debug(listOfRemove);
                if(!oliList.isEmpty()){
                    upsert oliList;
                    System.debug('Oli Records:'+oliList);
                }
                if(!listOfRemove.isEmpty()){
                    delete listOfRemove;
                }
                    
            } catch (Exception e) {
                throw new AuraHandledException(e.getMessage());
            }
        }
        @AuraEnabled
        public static Boolean addOpptLineItem(String optId,String pbEntryId){
            try {
                System.debug('OptId:'+optId);
                System.debug('PriceBookentryId:'+pbEntryId);
                if(optId!=null&&pbEntryId!=null){
                    PriceBookEntry pbEntry=[Select Id,UnitPrice,Product2Id from PriceBookEntry where Id=:pbEntryId];
                    OpportunityLineItem oli=new OpportunityLineItem(OpportunityId=optId,PriceBookEntryId=pbEntryId,Product2Id=pbEntry.Product2Id,UnitPrice=pbEntry.UnitPrice,Quantity=1);
                    insert oli;
                    return true;
                }
                return false;
            } catch (Exception e) {
                throw new AuraHandledException(e.getMessage());
            }
        }

        @AuraEnabled
        public static List<PriceBookEntry> getOpportunityRelatedProduct(String optId){
            try {
                System.debug('OppotunityId:'+optId);
                if(optId!=null){
                    Opportunity opt=[Select Id,HasOpportunityLineItem,PriceBook2Id from Opportunity where Id=:optId];
                    if(opt.HasOpportunityLineItem==false&&opt.PriceBook2Id!=null){
                        List<PriceBookEntry> pbEntryList=[Select Id,Product2Id,Product2.Name,Product2.Family,Product2.ProductCode from PriceBookEntry where PriceBook2Id=:opt.PriceBook2Id];
                        if(!pbEntryList.isEmpty()){
                            return pbEntryList;
                        }
                        return null;
                    }
                    else if(opt.HasOpportunityLineItem==true) {

                        List<OpportunityLineItem> oliList=[Select PricebookEntryId from OpportunityLineItem where OpportunityId=:opt.Id];
                        Set<Id> pbEntryIdSet=new Set<Id>();
                        for(OpportunityLineItem oli:oliList){
                            pbEntryIdSet.add(oli.PricebookEntryId);
                        }
                        List<PriceBookEntry> pbEntryList=[Select Id,Product2Id,Product2.Name,Product2.Family,Product2.ProductCode from PriceBookEntry where PriceBook2Id=:opt.PriceBook2Id AND Id NOT IN:pbEntryIdSet];
                        return pbEntryList;

                    }
                return null;
            }
                return null;
            } catch (Exception e) {
                throw new AuraHandledException(e.getMessage());
            }
        }
}

