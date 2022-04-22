import {Observable, BehaviorSubject} from 'rxjs';

export type ReadonlyBehaviorSubject<T> = Observable<T> & Pick<BehaviorSubject<T>, 'getValue'>;
