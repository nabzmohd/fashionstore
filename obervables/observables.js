import {Subject} from 'rxjs';

const loginStateObserver = new Subject();

export const observables = {
  getLoginStateObservable() {
    return loginStateObserver.asObservable();
  },

  triggerLoginStateObservable(data) {
    loginStateObserver.next(data);
  },
};
