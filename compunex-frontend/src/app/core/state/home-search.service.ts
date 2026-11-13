import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HomeSearchService {
  readonly query = signal('');
}
