import { fromStream } from './fromStream';
import { share } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';

export const stdin$: Observable<Buffer> = typeof process === 'object' && process && (typeof process.stdin === 'object')
  ? fromStream(process.stdin).pipe(share())
  : new Subject<Buffer>();
