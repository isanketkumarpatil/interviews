/*
 * Provus Services Quoting
 * Copyright (c) 2023 Provus Inc. All rights reserved.
 */

import { LightningElement } from "lwc";

export default class QuoteTotalSummary extends LightningElement {
    showAdjustQuoteDialog(){
        this.dispatchEvent(new CustomEvent('showdialog'));
    }
}
