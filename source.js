"use strict";

let user={
    name:"john",
    startAge:29,
    endAge:40,
    say(str){
        const context = document.createElement('p');
        const word = document.createTextNode(str+this._password);
        context.appendChild(word);
        let target = document.getElementById('here');
        target.appendChild(context);
    },
    _tel:110,
    _password:"pass",
};

user = new Proxy(user,{
    get(target,prop){
        if(prop.startsWith('_')){
            throw new Error('ゲッターのアクセス制限プロパティです');
        }else{
            let value = target[prop];
            return (typeof value === 'function') ? value.bind(target) : value;
        }
    },
    set(target,prop,value){
        if(prop.startsWith('_')){
            throw new Error('セッターのアクセス制限プロパティです');
        }else{
            target[prop] = value;
            return true;
        }
    },
    deleteProperty(target,prop){
        if(prop.startsWith('_')){
            throw new Error('デリートのアクセス制限プロパティです');
        }else{
            delete target[prop];
            return true;
        }
    },
    ownKeys(target){
        return Object.keys(target).filter(key => !key.startsWith('_'));
    },
    has(target,prop){
        return prop >= target.startAge && prop <= target.endAge;
    },
});
alert(30 in user);
/*
//getter
try{ alert(user._password); }
catch(e){ console.log(e.message); }

//setter
try{ user._tel = 119; }
catch(e){ console.log(e.message)}

//deleter
try{ delete user._password; }
catch(e){ console.log(e.message); }

for(let key in user){
    alert(user[key]);
}
user.say("!@#$%^&*");
*/

/*
//Array.from(b)のbの中身はキーでソート、0からlengthまででlength以降は未処理
let b = {
    2: "1",
    3: "0",
    1: "3",
    0: "2",
    length:4,
  };
  
  let a = Array.from(b);
  alert(a);
*/


/*
// start-endをソートして、map
function* generate(start,end){
    if(start>end) [start,end]=[end,start];
    for(let i = start; i <= end; i++){
        yield i;
    }
}
let nums = [...generate(15,7)];
nums.map(num=>console.log(num));
*/


/*
async function wait() {
    await new Promise(resolve => setTimeout(resolve, 1000));
    //throw new Error("new error");
    return 10;
}
  
function f() {
    wait().then((result) => alert(result))
        .catch((error) => alert(error));
} 
f();
*/


/*
class HttpError extends Error {
    constructor(response) {
      super(`${response.status} for ${response.url}`);
      this.name = 'HttpError';
      this.response = response;
    }
  }

async function loadJson(url){
    let res = await fetch(url);
        if(res.status == 200){
            let json = await res.json();
            return json;
        }else{
            throw new HttpError(res);
        }
}

async function demoGithubUser(){
    let user, name;

    while(true){
        name = prompt("your name?",'ktwj');
        try{
            user = await loadJson(`https://api.github.com/users/${name}`);
            alert(`Full name: ${user.name}.`);
            return user;
        }catch(err){
            if(err instanceof HttpError && err.response.status == 404){
                alert("no such user,please reenter");
            }else{
                throw err;
            }
        }
    }
}

demoGithubUser();
*/


/*
function promisify(f,manyArgs=false){
    return function(...args){
        return new Promise(
            function(resolve,reject){
                function callback(err,...results){
                    if(err){
                        return reject(err);
                    }else{
                        resolve(manyArgs ? results : results[0]);
                    }
                }
                args.push(callback);
                f.call(this,...args);
            }
        );
    };
};

let loadScriptPromise = promisify(loadScript);
*/


/*
let urls = [
    'https://api.github.com/users/iliakan',
    '/',
    'https://nothing',
];
Promise.all(
    urls.map(url => fetch(url).catch(err => err))
    )
    .then(responses => Promise.all(
            responses.map(r => r instanceof Error ? r : r.json().catch(err => err))
        )
    )
    .then(results => {
        results.map(result => {
            alert(`${result.name} : ${result}`);
        });
    }
    );
*/


/*
let lists = [
    fetch("https://tetsudo.rti-giken.jp/free/delay.json"),
    "",
    fetch("https://tetsudo.rti-giken.jp/free/delay.json"),
    fetch("https://tetsudo.rti-giken.jp/free/delay.json"),
    "",
];

Promise.all(lists.map(list => fetch(word)))



/*
//urlのjsonをfetch(とってきて)、trainfo[]へ格納
//forで<li></li>を作ってinfoを入れるを繰り返し、それをid="here"に表示
let url = "https://tetsudo.rti-giken.jp/free/delay.json";
let trainfo = [];
fetch(url)
    .then(response => response.json())
    .then(trainJson => {
        let info;
        for(let i = 0; i < trainJson.length; i++){
            info = `${trainJson[i].name}(${trainJson[i].company})：遅延中`;
            console.log(info);
            trainfo.push(info);
        }
    })
    .then(() => {
        for(let j = 0; j < trainfo.length; j++){
            let pelem = document.createElement('li');
            let infotext = document.createTextNode(`${trainfo[j]}`);
            pelem.appendChild(infotext);
            
            let target = document.getElementById("here");
            target.appendChild(pelem);
        }
    });
*/

/*
//scriptをonloadならresolve >> .then(f),onerrorならreject(new Error) >> .catch(f)
function loadScript(src){
    return new Promise(
        function(resolve,reject){
            let script = document.createElement('script');
            script.src = src;

            script.onload  = () => resolve(script);
            script.onerror = () => reject(new Error("script-load-error " + src));
            
            document.head.append(script);
        }
    );
}
let promise = new loadScript("https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.2.0/lodash.js")

promise.then(
    function(resolve){
        alert(`${resolve.src} is loaded!`);
    },
    function(reject){
        alert(`Error : ${reject}`);
    }
);

promise.then(script => alert('once more'));
*/

/*
//Promise resolve('a'),reject('b') .then (A(resolve){},funcB(reject){}) .finally
let num;
let sample = new Promise(
    function(resolve, reject) {
        num = +prompt("number",0);
        if(num<0){
            resolve("negative");
        }else if(num>0){
            resolve("positive");
        }else{
            if(num==0){
                reject("zero");
            }else{
                reject(new Error("non number"));
            }
        }
    })
    .finally(
        function(){
            alert("promise is ready!");
        }
    )
    .then(
        function(result){
            console.log(`numberは${result}の ${num} `);
        },
        function(error){
            alert(error);
            console.log(`${error}が入力されています`);
        },
    )

console.log("先に出力");
console.log("先に出力");
*/

/*
//クラスはコンストラクタとsetter,getterで_なし、それ以外は_あり
class User{
    constructor(name,age){
        this.name = name;
        this.age = age;
    }
    
    get name(){
        return this._name;
    }

    set name(value){
        if(value.length<2){
            alert("name is too short");
            return;
        }
        this._name = value
    }

    get age(){
        return this._age;
    }

    set age(value){
        if(agematch(value) == 1 && value >= 0){
            this._age = value;
            return;
        }else if(value<0){
            alert('this value is not positive');
        }else if(typeof value != Number){
            alert('this age is not Number');
        }
        return;

    }
}
function agematch(value){
    if(String(value).match(/^\d+$/)){return 1}else{return 0}
};

let user = new User("jack",28);
alert(`${user.name}(${user.age})`);

user.name = prompt("name:","char");
user.age = prompt("age:",30);
alert(`${user.name}(${user.age})`);
*/

/*
class Clock {
    constructor({ template }) {
      this._template = template;
    }
    _render(){
        let date = new Date();
        let hours = date.getHours();
        let mins = date.getMinutes();
        let secs = date.getSeconds();
        if (hours < 10) hours = '0' + hours;
        if (mins < 10) min = '0' + mins;
        if (secs < 10) secs = '0' + secs;
    let output = this._template
      .replace('h', hours)
      .replace('m', mins)
      .replace('s', secs);
        console.log(output);
    }
    stop(){
        clearInterval(this._timer);
    }
    start(){
        this._render();
        this._timer = setInterval( () => this._render(), 1000);
    }
}
    let clock = new Clock({template: 'h:m:s'});
    clock.start();
*/

/*
//コンソールで現時刻の時計
let timer;

function Clock({template}){
  this._template = template;
}

Clock.prototype._render = function(){
  let date = new Date();
  let hours = date.getHours();
  let mins = date.getMinutes();
  let secs = date.getSeconds();
  if (hours < 10) hours = '0' + hours;
  if (mins < 10) mins = '0' + mins;
  if (secs < 10) secs = '0' + secs;
  let output = this._template
    .replace('h', hours)
    .replace('m', mins)
    .replace('s', secs);
  console.log(output);
};
Clock.prototype._stop = function(){
  clearInterval(this._timer);
};
Clock.prototype._start = function(){
  this._render();
  this._timer = setInterval(() => this._render(),1000);
};
let clock = new Clock({template: 'h:m:s'});
clock._start();
*/


/*
//AnimalクラスをRabbitクラスとつなげる Rabbit - Rabbit.prototype - Animal.prototype
function Animal(name){
    this._name = name;
}

Animal.prototype.eat = function(food){
    alert(`${this._name} eats ${food}`);
};

let animal = new Animal("Peter");

function Rabbit(name){
    this._name = name;
}

Rabbit.prototype.jump = function(){
    alert(this._name + " jumps!");
};

Rabbit.prototype.__proto__ = Animal.prototype;

let rabbit = new Rabbit("Peter Rabbit");
rabbit.jump();
rabbit.eat('lemon glass');
*/

/*
//throttleはイベントが実行されて一定時間内は再度イベントが実行されないようにする
function f(a){
    console.log(a)
}

function throttle(f,ms){
    let isThrottled = false;
    let savedArgs,savedThis;

    //1回目はすぐにf.apply を実行、2回目以降はisThrottledがtrueなのでif内でreturnした結果、最後の1回のArgsとthisが保存される
    function wrapper(){
        if(isThrottled){
            savedArgs = arguments;
            savedThis = this;
            return;
        }
        f.apply(this,arguments);
        isThrottled = true;
        //ms秒後にThrottedを解除して、保存した最後のArgsとthisで、f.apply(this,arguments)をする。
        setTimeout(function(){
            isThrottled = false;
            if(savedArgs){
                wrapper.apply(savedThis,savedArgs);
                savedArgs = savedThis = null;
            }
        },ms);
    };
    return wrapper;
};

//f1000は、5000ms毎に最大1回fを実行する
let func = throttle(f,1000);
for(let i = 1;i<100000;i++){
    func(`${i}回目`);
}
*/


/*
//debounceは一定時間待っていたら実行させる。10秒設定のイベントが5秒時点で実行されたとき0秒地点に戻す、残り時間は5秒ではなく10秒。
let f = debounce(alert, 1000);

f(1); // すぐに処理され、実行される、0ms地点に戻される
f(2); // すぐに処理され、1000ms経過してないので無視される、0ms地点に戻される
//以下はほぼ同時に読み込み
setTimeout( () => f(3), 100); // f(2)から100ms時点で処理され、無視される、0ms時点に戻される
setTimeout( () => f(4), 1100); // f(2)から1000msの時点( f(3)実行から1000ms )で処理され、実行される、0ms時点に戻される
setTimeout( () => f(5), 1500); // f(2)から1500msの時点( f(4)実行から500msの時点 )に処理され、無視される

function debounce(f,ms){
    let isCool = false;
    return function(){
        if(isCool) return;

        f.apply(this,arguments);
        isCool = true;
        setTimeout(()=>isCool = false,ms);
    };
}
*/


/*
//fをsetTimeoutさせるデコレータdelayを作る。
function f(x){
    alert(x);
}

function delay(f,ms){
  return function(){
    setTimeout(() => f.apply(this,arguments), ms);
  }
}
let f4 = delay(f,4000);
f4("4秒");
*/

/*
//slowをデコレータcachingDecoratorでデコレートして、プロンプトで入力された数字から最大と最少をとり、それをキーとバリューをcacheマップにいれる
//もしcache内にキーが一致するものがあれば、cacheからgetし、そうでなければ、新たにcacheにsetする

let worker = {
    slow(){
        //引数を配列化
        let args = [].slice.call(arguments);
        let min = Number(args.reduce( (a,b)=> a<b ?a:b ));
        let max = Number(args.reduce( (a,b)=> a>b ?a:b ));
        alert(`Caller with min:${min} , max:${max}`);
        return min + max;
    }
};

function cachingDecorator(func,hash){
    let cache = new Map();
    return function(){
        //引数をハッシュ化(,で結合)してkeyにする
        let key = [].join(arguments);
        //キャッシュのMapに、keyをキーにしたものがあるなら、返す
        if(cache.has(key) && key != NaN){
            alert("from cache");
            return cache.get(key);
        }
        //keyをキーにしたものがなければ、argumentsを引数にするfuncを、this(worker)で呼び出してresultに入れる
        let result = func.apply(this,arguments);
        //resultをkeyをキーにしてキャッシュにセットしてresultを返す
        cache.set(key,result);
        return result;
    };
};

//引数を配列化してcompare順に並べる
function hash(args){
    return [].slice.call(args).sort();
}
//小さい順に並べる
function compare(){
    if(a>b) return 1;
    if(a==b) return 0;
    if(a<b) return -1;
}

//work.slowを開くときはcacheingDecoratorでデコレートする
worker.slow = cachingDecorator(worker.slow,hash);

let a1 = prompt('number1',2);
let a2 = prompt('number2',7);
let a3 = prompt('number3',5);
let a4 = prompt('number4',8);
alert(worker.slow(a1,a2,a3,a4));

let b1 = prompt('number1',3);
let b2 = prompt('number2',4);
let b3 = prompt('number3',8);
let b4 = prompt('number4',2);
alert("Again"+worker.slow(b1,b2,b3,b4));

*/

/*
let salaries = {
    "John": 100,
    "Pete": 300,
    "Mary": 250
  };

const topSalary = (salaries)=> {
        let maxName;
        let maxSalary = null;
        for(let [name,salary] of Object.entries(salaries)){
            if(salary > maxSalary){
                maxSalary = salary;
                maxName = name;
            }
        }
        return maxName;
}
alert(topSalary(salaries));
*/

/*
let John = {
    name: "John Jack",
    age : "28",
    job : "writer",
    gender:"male",
};
let Elsa = {
    name: "Elsa Jack",
    age : "26",
    job : "officer",
    gender:"female",
};
let users1 = new Map();
users1.set('john',John)
    .set('elsa',Elsa);

users1.forEach( (user) => {
    for(let [key,value] of Object.entries(user)){
        alert(`${key}は${value}です。`);
    }
});

let users2 = [John,Elsa];
for(let user of Object.values(users2)){
    for(let [key,value] of Object.entries(user)){
        alert(`${key}は${value}だ`);
    }
}
*/
