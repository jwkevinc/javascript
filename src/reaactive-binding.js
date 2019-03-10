

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
    console.log(this.subscribers);
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
  total = data.price * data.quantity;  // so this is the trick
});

watcher(() => {
  salePrice = data.price * data.sale;  // so this is the trick
});

watcher(() => {
  saleTotal = (data.price * data.quantity) * data.sale;
})
