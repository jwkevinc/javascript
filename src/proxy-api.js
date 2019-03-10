
// Source: https://www.youtube.com/watch?v=7Cjb7Xj8fEI
// Reactive programming using javascript Proxy API

let data = { price: 100, quantity: 3, sale: 0.5 };
var target = null;

class Dep {
  constructor() {
    this.subscribers = [];
  }
  depend() {
    if (target && !this.subscribers.includes(target)) {
      this.subscribers.push(target);
    }
  }
  notify() {
    this.subscribers.forEach(sub => sub());
  }
}

let dep = new Map();
Object.keys(data).forEach(key => {
  dep.set(key, new Dep());
})

let nonProxiedData = data;
data = new Proxy(nonProxiedData, {
   get(obj, key) {
     dep.get(key).depend();
     return obj[key];
   },
   set(obj, key, newVal) {
     obj[key] = newVal;
     dep.get(key).notify();
     return;
   }
});

function watcher(myFn) {
  target = myFn;
  target();
  target = null;
}

var salePrice = 0;
var total = 0;

watcher(() => {
  total = data.price * data.quantity;
});

watcher(() => {
  salePrice = data.price * data.sale;
});

watcher(() => {
  saleTotal = (data.price * data.quantity) * data.sale;
})
