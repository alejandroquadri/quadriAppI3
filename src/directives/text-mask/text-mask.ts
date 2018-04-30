// import { Directive } from '@angular/core';

// @Directive({
//   selector: '[text-mask]' // Attribute selector
// })
// export class TextMaskDirective {

//   constructor() {
//     console.log('Hello TextMaskDirective Directive');
//   }

// }

import { Directive, HostListener, ElementRef, OnInit } from "@angular/core";
import { DecimalPipe } from '@angular/common';
// import { MyCurrencyPipe } from "./my-currency.pipe";

@Directive({
  selector: '[textMask]' // Attribute selector
})
export class TextMaskDirective implements OnInit {

  private el: HTMLInputElement;

  constructor(
    private elementRef: ElementRef,
    private decimal: DecimalPipe,
    // private currencyPipe: MyCurrencyPipe
  ) {
    console.log(this.elementRef, this.elementRef.nativeElement, this.elementRef.nativeElement.getElementsByTagName('input')[0]);
    // if (this.elementRef.nativeElement.localName === "ion-input") {
    //   this.el = this.elementRef.nativeElement.getElementsByTagName('input')[0];
    // } else {
    // }
    this.el = this.elementRef.nativeElement;
    console.log(this.el);

  }

  ngOnInit() {
    this.el.value = this.decimal.transform(this.el.value, '1.0-2');
  }

  @HostListener("focus", ["$event.target.value"])
  onFocus(value) {
    this.el.value = this.decimal.transform(value, '1.0-2'); // opossite of transform
    console.log('focus', value, this.decimal.transform(value, '1.0-2'), this.el.value)
  }

  @HostListener("blur", ["$event.target.value"])
  onBlur(value) {
    console.log('blur', value, this.decimal.transform(value, '1.0-2'), this.el.value)
    setTimeout( () => {
      // this.el.value = this.decimal.transform(value, '1.0-2');
      console.log('blur', this.el.value);
      this.el.value = '200';
    }, 500);
  }

}
