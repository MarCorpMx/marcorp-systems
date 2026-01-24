import { Directive, ElementRef, OnDestroy, OnInit, effect, EffectRef } from '@angular/core';
import { LoadingService } from '../../core/services/loading.service';

@Directive({
  selector: '[appDisableWhileLoading]',
})

export class DisableWhileLoading implements OnInit, OnDestroy {
  private stopEffect!: EffectRef;
  //private stopEffect!: () => void;

  constructor(
    private el: ElementRef<HTMLButtonElement>,
    private loading: LoadingService
  ) {}

  ngOnInit() {
    this.stopEffect = effect(() => {
      const isLoading = this.loading.loading();

      this.el.nativeElement.disabled = isLoading;

      if (isLoading) {
        this.el.nativeElement.classList.add('is-loading');
      } else {
        this.el.nativeElement.classList.remove('is-loading');
      }
    });
  }

  ngOnDestroy() {
    //this.stopEffect?.();
    this.stopEffect.destroy();
  }

}
