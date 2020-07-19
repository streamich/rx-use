import { Observable } from 'rxjs';
import { Readable } from 'stream';

export const fromStream = <T = Buffer>(
  input: Readable,
): Observable<T> => {
  return new Observable<T>(subscriber => {
      const onComplete = () => subscriber.complete();
      const onError = (e: Error) => subscriber.error(e);
      const onNext = (data: T) => subscriber.next(data);

      input.addListener('end', onComplete);
      input.addListener('close', onComplete);
      input.addListener('error', onError);
      input.addListener('data', onNext);

      return () => {
          input.removeListener('end', onComplete);
          input.removeListener('close', onComplete);
          input.removeListener('error', onError);
          input.removeListener('data', onNext);
      };
  });
}
