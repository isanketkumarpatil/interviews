/*
 * Provus Services Quoting
 * Copyright (c) 2023 Provus Inc. All rights reserved.
 */

import { api } from 'lwc';
import LightningModal from 'lightning/modal';

export default class AdjustQuotePrice extends LightningModal {
    @api label;
    @api content;

    handleSave(){
        this.content = { ...this.content, totalQuotedAmount: this.refs.adjustedAmount.value};
        this.close({operation: 'save', content: this.content});
    }

    handleCancel(){
        this.close({operation: 'close', content: null});
    }
}