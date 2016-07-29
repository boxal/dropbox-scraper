const Rx = require('rx');
const R = require('ramda');
const Nightmare = require('nightmare');

module.exports = R.curry((fn, url) => {
  return Rx.Observable.create((observer) => {
    const nightmare = Nightmare();
      nightmare
        .goto(url)
        .evaluate(fn)
        .then((data) => {
          observer.onNext(data);
        })
        .catch((error) => {
          observer.onError(error);
        })
        .then(() => observer.onCompleted());

    return () => setTimeout(() => {
      nightmare.end((error) => observer.onError(error));
    }, 5000);
  });
});
