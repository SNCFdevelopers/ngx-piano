import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { ActionType } from './action-type';
import { PianoTracker } from '../piano-tracker';

/**
 * This directive only works with buttons
 */
@Directive({
  selector: '[ngxPianoTrackClick]'
})
export class PianoTrackClickDirective {
  @Input() ngxPianoClickName?: string;
  @Input() ngxPianoActionType?: ActionType;

  constructor(private readonly elementRef: ElementRef, private readonly pianoService: PianoTracker) {
  }

  @HostListener("click")
  private sendChangeEventToPiano() {
    // default values
    if (!this.ngxPianoActionType) this.ngxPianoActionType = "ACTION"
    if (!this.ngxPianoClickName) this.ngxPianoClickName = (this.elementRef.nativeElement as HTMLButtonElement).name ?? ''

    this.pianoService.sendClickEvent(this.ngxPianoActionType, this.ngxPianoClickName);
  }
}
