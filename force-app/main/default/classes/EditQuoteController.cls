public with sharing class EditQuoteController {
    /*
    * @Method:      getQuoteRecordDetails
    * @Created by:  Sanketkumar Patil
    * @Description: This method will return Quote Record Details.
    * @Param:       RecordId
    * @Return:      Quote Data Transfer Object
    */
    @AuraEnabled(cacheable=true)
    public static QuoteDto getQuoteRecordDetails(String recordId){
        QuoteDto qDto = null;
        try {
            if(Schema.sObjectType.Quote__c.isAccessible()){
                Quote__c qt = [SELECT Id, Name, StartDate__c, EndDate__c, TotalQuotedAmount__c FROM Quote__c where Id = :recordId WITH SECURITY_ENFORCED];
                qDto = new QuoteDto(qt);
            }
        } catch(Exception e){
            throw new AuraHandledException('Error in fetching Quote records:: '+e.getStackTraceString());
        }

        return qDto;
    }

    /*
    * @Method:      executeRecordOperations
    * @Created by:  Sanketkumar Patil
    * @Description: This method will perfrom DML on Quote Record based on Operation Type.
    * @Param:       RecordInput
    * @Return:      Boolean - Execution Status
    */
    @AuraEnabled
    public static Boolean executeRecordOperations(String recordInput, String operationType){
        Boolean actionStatus = false;

        QuoteDto qDto = new QuoteDto((Quote__c)System.JSON.deserialize(recordInput, Quote__c.class));
        qDto.operationType = operationType;

        try {
            Quote__c qt = (Quote__c)qDto.refreshSo();

            if(qDto.isInsert() &&  Schema.sObjectType.Quote__c.iscreateable()){
                insert qt;
                actionStatus = true;
            } else if(qDto.isUpdate() &&  Schema.sObjectType.Quote__c.isupdateable()){
                update qt;
                actionStatus = true;
            } else if(qDto.isDelete() &&  Schema.sObjectType.Quote__c.isdeletable()){
                delete qt;
                actionStatus = true;
            }
        } catch(Exception e){
            throw new AuraHandledException('Error in executing Quote record Operations:: '+e.getStackTraceString());
        }

        return actionStatus;
    }
}