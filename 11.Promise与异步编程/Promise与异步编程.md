> 主要知识点：Promise生命周期、Promise基本操作、Promise链、响应多个Promise以及集成Promise

![迭代器与生成器的知识点](https://github.com/CL0610/ES6-learning/blob/master/11.Promise与异步编程/Promise与异步编程.png)


# 1. Promise基础 #

> 什么是回调地狱？

当使用回调函数来进行事件处理的时候，如果嵌套多层回调函数的时候，就会出现回调地狱，例如：


	method1(function(err, result) {
		if (err) {
			throw err;
		} 
		method2(function(err, result) {
			if (err) {
				throw err;
			} 
			method3(function(err, result) {
				if (err) {
					throw err;
				} 
				method4(function(err, result) {
					if (err) {
						throw err;
					} 
					method5(result);
				});
			});
		});
	});


像本例一样嵌套多个方法调用会创建错综复杂的代码，会难以理解与调试。当想要实现更复
杂的功能时，回调函数也会存在问题。要是你想让两个异步操作并行运行，并且在它们都结
束后提醒你，那该怎么做？要是你想同时启动两个异步操作，但只采用首个结束的结果，那
又该怎么做？而使用Promise就能避免回调地狱的情况。


Promise可以当做是一个占位符，表示异步操作的执行结果。函数可以返回一个Promise，而不必订阅一个事件或者向函数传递一个回调函数。

> Promise的生命周期

每个 Promise 都会经历一个短暂的生命周期，初始为挂起状态（pending state） ，这表示异步操作尚未结束。一个挂起的 Promise 也被认为是未决的（unsettled )。一旦异步操作结束， Promise就会被认为是已决的（settled ） ，并进入两种可能状态之一：

1. **已完成（fulfilled ）** ： Promise 的异步操作已成功结束；
2. **已拒绝（rejected ）** ： Promise 的异步操作未成功结束，可能是一个错误，或由其他原因导致。


内部的` [[PromiseState]]` 属性会被设置为` "pending"` 、 `"fulfilled"` 或 "rejected"` ，以反映 `Promise` 的状态。该属性并未在 Promise 对象上被暴露出来，`因此你无法以编程方式判断 `Promise` 到底处于哪种状态。不过你可以使用` then() `方法在 Promise 的状态改变时执行一些特定操作。

1. **then()方法**

	`then() `方法在所有的 Promise 上都存在，并且接受两个参数。第一个参数是 Promise 被完成时要调用的函数，异步操作的结果数据都会被传入这个完成函数。第二个参数则是 Promise 被拒绝时要调用的函数，与完成函数相似，拒绝函数会被传入与拒绝相关联的任何附加数据。then()方法的两个参数是可选的，因此可以自由组合监听完成和失败的处理函数；
2. **catch()方法**

	Promise有catch()方法，等同于只传递拒绝处理函数给then()方法：

		promise.catch(function(err) {
			// 拒绝
			console.error(err.message);
		});
		// 等同于：
		promise.then(null, function(err) {
			// 拒绝
			console.error(err.message);
		});

> 创建未决的Promise

使用Promise构造器可以创建一个Promise实例，此构造器接收一个参数：一个被称之为执行器（excutor）的函数，该函数包含了`resolve()`函数和`reject()`函数这两个参数。`resolve()`函数在异步任务执行成功时调用，而`reject()`函数在异步任务执行失败时调用。例如：


	let promise = new Promise(function(resolve,reject){
		console.log('hi, promise');
		resolve();
	
	});
	
	promise.then(()=>{
		console.log('hi, then');
	
	});
	
	console.log('hi');

	输出：
	hi, promise
	hi
	hi then

从输出结果可以看出，Promise构造器中的代码是最先执行的，而`then()`代码是最后执行的，这是因为只有在Promise中的处理器函数执行结束之后，then()方法中的完成处理函数或者拒绝处理函数才会添加到作业队列的尾部。

> 创建已决的Promise

1. 使用`Promise.resolve()`

`Promise.resolve()`方法接收一个参数，并会返回一个处于已完成状态的 `Promise` ，在`then()`方法中使用完成处理函数才能提取该完成态的`Promise`传递的值，例如：

	let promise = Promise.resolve('hi');
	promise.then((value)=>{
		console.log(value); //hi
	});

2. 使用Promise.reject()

可以使用`Promise.reject()`方法来创建一个已拒绝状态的`Promise`，同样只有在拒绝处理函数中或者`catch()`方法中才能接受`reject()`方法传递的值：

	let reject = Promise.reject('reject');
	
	reject.catch((value)=>{
		console.log(value); //reject
	})

> 非Promise的thenable

当一个对象拥有一个能接受`resolve`与`reject`参数的`then()`方法时，该对象就会被认为是一个非`Promise`的`thenable`，例如：


	let thenable = {
	
		then:function(resolve,reject){
			resolve('hi');
		}
	}

`Promise.resolve()`与`Promise.reject()`方法都能够接受非Promise的thenable作为参数，当传入了非Promise的thenable时，这些方法会创建一个新的Promise，并且可以使用then()方法对不同状态进行操作：

创建一个已完成的Promise

	let thenable = {
	
		then:function(resolve,reject){
			resolve('hi');
		}
	}
	
	let promise = Promise.resolve(thenable);
	promise.then((value)=>{
		console.log(value); //hi
	});

同样利用thenable可以创建一个已拒绝的Promise:

	let thenable = {
	
		then:function(resolve,reject){
			reject('hi');
		}
	}
	
	let promise = Promise.resolve(thenable);
	promise.then(null,(value)=>{
		console.log(value);
	});


> 执行器错误

当执行器内部抛出错误，那么Promise的拒绝处理函数就会被调用，例如：


	let promise = new Promise(function(resolve,reject){
		throw new Error('Error!');
	
	})
	
	promise.catch(function(msg){
		console.log(msg); //error
	})

# 2. Promise链 #

除了使用单个Promise外，多个Promise可以进行级联使用，实际上`then()`方法或者`catch()`方法会返回一个新的Promise，仅当前一个Promise被决议之后，后一个Promise才会进行处理。

> 串联Promise

	let p1 = new Promise(function(resolve,reject){
		resolve('hi');
	});
	
	p1.then((value)=>{
		console.log(value);
		throw new Error('Error!');
	}).catch(function(error){
		console.log(error);
	})

可以看出当p1的`then()`方法执行结束后会返回一个Promise，因此，在此基础上可以继续执行`catch()`方法。同时，**Promise链允许捕获前一个Promise的错误**。

> Promise链中传递值

**Promise链的另一个重要方面是能从一个Promise传递数据给另一个Promise的能力。**前一个Promise的完成处理函数的返回值，传递到下一个Promise中。

	//Promise链传递值
	
	let p1 = new Promise(function(resolve,reject){
		resolve(1);
	})
	
	p1.then(value=>value+1)
	.then(value=>{
		console.log(value);
	})

p1的完成处理函数返回了`value+1`，也就是`2`，会传入到下一个Promise的完成处理函数，因此，第二个`then()`方法中的完成处理函数就会输出`2`。拒绝处理函数同样可以被用于在Promise链中传递数据。

> Promise链中传递Promise

在完成或者拒绝处理函数中可以返回基本类型值，从而可以在Promise链中传递。另外，在Promise链中也可以传递对象，如果传递的是Promise对象，就需要额外的处理：

**传递已完成状态的Promise**：

	let p1 = new Promise(function(resolve,reject){
		resolve(1);
	});
	
	let p2 = new Promise(function(resolve,reject){
		resolve(2);
	})
	
	p1.then(value=>{
		console.log(value);
		return p2;
	}).then(value=>{
		console.log(value);
	});
	输出：1  2

p1中返回了Promise对象`p2`，当`p2`完成时，才会调用第二个`then()`方法，将值`value`传到完成处理函数中。若`Promise`对象`p2`被拒绝后，第二个`then()`方法中的完成处理函数就不会执行，只能通过拒绝处理函数才能接收到p2传递的值：


	let p1 = new Promise(function(resolve,reject){
		resolve(1);
	});
	
	let p2 = new Promise(function(resolve,reject){
		reject(2);
	})
	
	p1.then(value=>{
		console.log(value);
		return p2;
	}).catch(value=>{
		console.log(value);
	});


# 3. 响应多个Promise #

如果想监视多个Promise的状态，从而决定下一步动作，可以使用ES6提供的两个方法：`Promise.all()`和`Promise.race()`；


> Promise.all()

Promise.all()方法能接受单个可迭代对象（如数组）作为参数，可迭代对象的元素都是Promise。该方法会返回一个Promise，只有传入所有的Promise都已完成，所返回的Promise才会完成，例如：


	//Promise.all()
	let p1 = new Promise(function(resolve,reject){
		resolve(1);
	})
	
	let p2 = new Promise(function(resolve,reject){
		resolve(2);
	})
	
	let p3 = new Promise(function(resolve,reject){
		resolve(3);
	})
	
	let p4 = Promise.all([p1,p2,p3]);
	p4.then(value=>{
		console.log(Array.isArray(value)); //true
		console.log(value); //[1,2,3]
	})


对 `Promise.all()` 的调用创建了新的`Promise p4 `，在 `p1` 、 `p2` 与 `p3` 都被完成后， `p4` 最终会也被完成。传递给 `p4` 的完成处理函数的结果是一个包含每个决议值（1 、 2 与 3 ） 的数组，这些值的存储顺序保持了待决议的 `Promise` 的顺序（与完成的先后顺序无关） ，因此你可以将结果匹配到每个`Promise`。


**若传递给` Promise.all()` 的某个 Promise 被拒绝了，那么方法所返回的 Promise 就会立刻被拒绝，而不必等待其他的 Promise 结束**：


	//Promise.all()
	let p1 = new Promise(function(resolve,reject){
		resolve(1);
	})
	
	let p2 = new Promise(function(resolve,reject){
		reject(2);
	})
	
	let p3 = new Promise(function(resolve,reject){
		resolve(3);
	})
	
	let p4 = Promise.all([p1,p2,p3]);
	p4.catch(value=>{
		console.log(Array.isArray(value)); //true
		console.log(value); //2
	})

在此例中， p2 被使用数值 2 进行了拒绝，则 p4 的拒绝处理函数就立刻被调用，而不会
等待 p1 或 p3 结束执行（它们仍然会各自结束执行，只是 p4 不等它们） 。

**拒绝处理函数总会接受到单个值，而不是一个数组。该值是被拒绝的Promise所返回的拒绝值。**


> Promise.race()

`Promise.race()`方法接收一个元素是Promise的可迭代对象，并返回一个新的Promise。一旦传入`Promise.race()`的可迭代对象中有一个Promise是已决状态，那么返回的Promise对象就会立刻成为已决状态。

而`Promise.all()`方法得必须等到所有传入的Promise全部变为已决状态，所返回的Promise才会已决。


	let p1 = new Promise(function(resolve,reject){
		resolve(1);
	})
	
	let p2 = new Promise(function(resolve,reject){
		resolve(2);
	})
	
	let p3 = new Promise(function(resolve,reject){
		resolve(3);
	})
	
	let p4 = Promise.race([p1,p2,p3]);
	p4.then(value=>{
		console.log(Array.isArray(value)); //false
		console.log(value); //1
	})


Promise.race() 方法传入的Promise中哪一个Promise先变成已完成状态，就会将值传递给所返回的Promise对象的完成处理函数中。若哪一个Promise最先变成已拒绝状态，同样的，会将值传递给`p4`的拒绝处理函数中。


# 4. 继承Promise #

可以继承Promise实现自定义的Promise，例如：

	class MyPromise extends Promise {
		// 使用默认构造器
		success(resolve, reject) {
			return this.then(resolve, reject);
		} 
		failure(reject) {
			return this.catch(reject);
		}
	} 
	let promise = new MyPromise(function(resolve, reject) {
		resolve(42);
	});
	promise.success(function(value) {
		console.log(value); // 42
	}).failure(function(value) {
		console.log(value);
	});

在此例中， MyPromise 从 Promise 上派生出来，并拥有两个附加方法。 `success()` 方法模拟了 `resolve()` ， `failure()` 方法则模拟了 `reject()` 。


# 5. 总结 #

1. Promise 具有三种状态：挂起、已完成、已拒绝。一个 `Promise` 起始于挂起态，并在成功时转为完成态，或在失败时转为拒绝态。 `then()` 方法允许你绑定完成处理函数与拒绝处理函数，而 `catch()` 方法则只允许你绑定拒绝处理函数；

2. 能够将多个Promise串联起来组成Promise链，并且能够在中间传递值，甚至是传递Promise对象。 then() 的调用都创建并返回了一个新的 Promise ，只有在前一个 Promise 被决议过，新 Promise 也会被决议。 同时也可以使用Promise.all()和Promise.race()方法来管理多个Promise。