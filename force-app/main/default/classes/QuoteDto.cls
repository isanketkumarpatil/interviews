public with sharing class QuoteDto extends BaseDto {
  @AuraEnabled public Date endDate;
  @AuraEnabled public Date startDate;
  @AuraEnabled public Decimal totalQuotedAmount;

  public QuoteDto() {
    System.debug('Initializing Quote DTO'); //Added to avoid PDM Emtpy block exception
  }

  public QuoteDto(Quote__c quote) {
    super(quote);
    this.name = quote.Name;
    this.startDate = quote.StartDate__c;
    this.endDate = quote.EndDate__c;
    this.totalQuotedAmount = quote.TotalQuotedAmount__c;
  }

  public override SObject refreshSo() {
    return this.sObj;
  }
}
