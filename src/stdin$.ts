import { fromStream } from './fromStream';
import { share } from 'rxjs/operators';

export const stdin$ = fromStream(process.stdin).pipe(share());
