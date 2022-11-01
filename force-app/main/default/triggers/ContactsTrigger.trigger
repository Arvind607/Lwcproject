trigger ContactsTrigger on Contact (before insert,before update,after insert,after update,before delete) {
    if(trigger.isBefore&&trigger.isInsert){
        System.debug('Trigger called>>>>>>>');
        if(TriggerStatus.Status==true){
            System.debug('Trigger called--->>');
        //TriggerEx.StopCreatContactHaveSameUserAndCmpnyCntry(Trigger.new);
        Set<Id> actIds=new Set<Id>();
        for(Contact c:trigger.new){
            if(c.AccountId!=null){
            actIds.add(c.AccountId);
           }
        }
        system.debug('SetOf Id:'+actIds);
        if(!actIds.isEmpty()){
            TriggerStatus.Status=false;
            System.debug('Status:'+TriggerStatus.Status);
            Map<Id,Account> mpofAccount=new Map<Id,Account>([Select Id,Name,Phone from Account where Id IN:actIds]);
            system.debug('Map of Account:'+mpofAccount);
            for(Contact c:trigger.new){
                if(mpofAccount.containsKey(c.AccountId)&&mpofAccount.get(c.AccountId).Phone!=null){
                    system.debug('In Map');
                    String actPhone=String.valueOf(mpofAccount.get(c.AccountId).Phone);
                    String actName=String.valueOf(mpofAccount.get(c.AccountId).Name);
                    APIIntegrationController.sendContact(actName,actPhone,c.LastName,c.Email);
                }
            }
            
        }
        
    
        }
    }
    if(trigger.isBefore&&trigger.isDelete){
        System.debug('Delete Trigger called>>>>>>');
        if(TriggerStatus.deleteStatus==true){
            System.debug('Trigger called--->>');
        //TriggerEx.StopCreatContactHaveSameUserAndCmpnyCntry(Trigger.new);
        Set<Id> actIds=new Set<Id>();
        for(Contact c:trigger.old){
            if(c.AccountId!=null){
            actIds.add(c.AccountId);
           }
        }
        system.debug('SetOf Id:'+actIds);
        if(!actIds.isEmpty()){
            TriggerStatus.deleteStatus=false;
            System.debug('Status:'+TriggerStatus.deleteStatus);
            Map<Id,Account> mpofAccount=new Map<Id,Account>([Select Id,Name,Phone from Account where Id IN:actIds]);
            system.debug('Map of Account:'+mpofAccount);
            for(Contact c:trigger.old){
                if(mpofAccount.containsKey(c.AccountId)&&mpofAccount.get(c.AccountId).Phone!=null){
                    system.debug('In Map');
                    String actPhone=String.valueOf(mpofAccount.get(c.AccountId).Phone);
                    String actName=String.valueOf(mpofAccount.get(c.AccountId).Name);
                    APIIntegrationController.sendDelContact(actName,actPhone,c.LastName,c.Email);
                }
            }
            
        }
        }
    }

}