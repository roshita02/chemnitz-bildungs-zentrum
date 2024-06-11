import { OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * // constructor.ts
 * export type Constructor<T = {}> = new (...args: any[]) => T;
 * // subscribed-container.component.ts
 * https://gist.github.com/kaplan81/675730f2943daef26e6fec4fbed3dc0a
 *
 * See it in action:
 * https://stackblitz.com/github/kaplan81/auto-unsubscribe-mixin
 */
export type Constructor<T = {}> = new (...args: any[]) => T;

export const subscribedContainerMixin = <T extends Constructor>(base: T = class {} as T) =>
  class extends base implements OnDestroy {
    destroyed$ = new Subject<void>();

    ngOnDestroy(): void {
      this.destroyed$.next();
      this.destroyed$.complete();
    }
  };
