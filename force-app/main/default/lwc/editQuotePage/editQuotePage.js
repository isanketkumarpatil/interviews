/*
 * Provus Services Quoting
 * Copyright (c) 2023 Provus Inc. All rights reserved.
 */

import { LightningElement, api, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import AdjustQuoteDialogHeader from '@salesforce/label/c.AdjustQuoteDialogHeader';
import adjustQuotePrice from 'c/adjustQuotePrice';
import getQuoteRecordDetails from '@salesforce/apex/EditQuoteController.getQuoteRecordDetails';
import executeRecordOperations from '@salesforce/apex/EditQuoteController.executeRecordOperations';

export default class EditQuotePage extends LightningElement {
  @api recordId;
  quoteData = {
    id: '',
    totalQuotedAmount: ''
  };

  labels = {
    AdjustQuoteDialogHeader
  }

  @wire(getQuoteRecordDetails, {recordId : '$recordId'})wiredQuoteRecordData({ data, error }) {   
    if(data){
      this.quoteData = data;
    } else if (error) { 
      this.error = error;
    }
  }

  async showAdjustQuoteDialogHandler(){
    //To display Adjust Quote Price Dialog
    let result = await adjustQuotePrice.open({
        label: this.labels.AdjustQuoteDialogHeader,
        size: 'small',
        description: 'Modal to Adjust Quote Price',
        content: this.quoteData,
    });

    if(result.operation == 'save'){
      this.quoteData = result.content;

      //Update Modfied Value in Data Object
      this.quoteData.sObj = { ...this.quoteData.sObj, TotalQuotedAmount__c: this.quoteData.totalQuotedAmount};

      //Update Modfied Value 
      await executeRecordOperations({recordInput : JSON.stringify(this.quoteData.sObj), operationType: 'update'}).then(result => {
        if(result){
          this.showToastMessage('Saved Quote Detail', null, 'success');
        } else {
          this.showToastMessage('Error Updating Recrod Details', null, 'error');
        }
      }).catch(error => {
        this.showToastMessage('Error Updating Recrod Details', error, 'error');
      });
    }
  }

  //Generic method for Toast Message
  showToastMessage(title, message, variant) {
    this.dispatchEvent(new ShowToastEvent({title: title, message: message, variant: variant,}));
  }
}
