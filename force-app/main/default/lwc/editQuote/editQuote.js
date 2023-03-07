/*
 * Provus Services Quoting
 * Copyright (c) 2023 Provus Inc. All rights reserved.
 */

import { LightningElement, api, wire } from "lwc";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getQuoteRecordDetails from '@salesforce/apex/EditQuoteController.getQuoteRecordDetails';
import executeRecordOperations from '@salesforce/apex/EditQuoteController.executeRecordOperations';

export default class EditQuote extends LightningElement {
  @api recordId;
  error;
  quoteData = {
    id: '',
    name: '',
    startDate: '',
    endDate: ''
  };

  @wire(getQuoteRecordDetails, {recordId : '$recordId'})wiredQuoteRecordData({ data, error }) {   
    if(data){
      this.quoteData = data;
    } else if (error) { 
      this.error = error;
    }
  }

  fieldChangeHandler(event){
    if(event.target.name == 'StartDate'){
      this.quoteData = { ...this.quoteData, startDate: event.target.value };
    } else if(event.target.name == 'EndDate'){
      this.quoteData = { ...this.quoteData, endDate: event.target.value };
    }
  }

  saveHandler(){
    this.quoteData.sObj = { ...this.quoteData.sObj, StartDate__c: this.quoteData.startDate};
    this.quoteData.sObj = { ...this.quoteData.sObj, EndDate__c: this.quoteData.endDate};

    executeRecordOperations({recordInput : JSON.stringify(this.quoteData.sObj), operationType: 'update'}).then(result => {

    if(result){
        this.showToastMessage('Saved Quote Detail', null, 'success');
      } else {
        this.showToastMessage('Error Updating Recrod Details', null, 'error');
      }
    }).catch(error => {
      this.showToastMessage('Error Updating Recrod Details', error, 'error');
    });
  }

  showToastMessage(title, message, variant) {
      this.dispatchEvent(new ShowToastEvent({title: title, message: message, variant: variant,}));
  }
}
