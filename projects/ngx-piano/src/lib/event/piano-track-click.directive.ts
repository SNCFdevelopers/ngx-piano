import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { ActionType } from './action-type';
import { PianoTracker } from '../piano-tracker';

/**
 * This directive only works with buttons
 */
@Directive({
  selector: '[appPianoTrackClick]'
})
export class PianoTrackClickDirective {
  @Input() pianoClickName?: string;
  @Input() pianoActionType?: ActionType;

  constructor(private readonly elementRef: ElementRef, private readonly pianoService: PianoTracker) {
  }

  @HostListener("click")
  private sendChangeEventToPiano() {
    // default values
    if (!this.pianoActionType) this.pianoActionType = "ACTION"
    if (!this.pianoClickName) this.pianoClickName = (this.elementRef.nativeElement as HTMLButtonElement).name ?? ''

    this.pianoService.trackClickEvent(this.pianoActionType, this.pianoClickName);
  }
}
