
> 主要知识点有对象类别、属性速记法、方法简写、需计算属性名、Object.is()方法、Object.assign()方法、可允许重复的属性、自有属性的枚举顺序、Object.setPrototypeOf()方法、super引用、方法定义

![扩展的对象功能知识点](https://github.com/CL0610/ES6-learning/blob/master/4.扩展的对象功能/扩展的对象功能.png)

# 1. 对象类别 #
对象有以下几种类别：

- 普通对象：拥有JS对象所有默认的内部行为；
- 奇异对象：其内部行为在某些方面有别于默认行为；
- 标准对象：在ES6中被定义的对象，例如Array,Date等；
- 内置对象：在脚本开始运行的时候由JS运行环境提供的对象，所有的标准对象都是内置对象

# 2. 对象字面量语法的扩展 #

> 属性初始化的速记法

属性初始化器的速记法可以用来消除属性名和本地变量的重复情况，可以使用作用域内的变量值赋值给同名属性：

	function createPerson(name,age){
		return {
			name:name,
			age:age
		}
	}

	//由于属性名和本地变量名相同，可以采用
	//属性初始化器的速记法，等价于


	function createPerson(name,age){
		return {
			name,
			age
		}
	}
	
> 方法简写

在对象字面量的写法中，为一个对象添加一个方法，需要指定对象的属性以及具体的函数声明。ES6提供了一种方法简写语法，通过省略function关键字，能够让为对象添加方法的语法更加简洁。有一个重要的区别是：**方法简写能够使用`super`，而非简写的方法不能使用`super`**。

	//方法简写法
	
	let person = {
		sayName:function(){
			return name;
		}
	
	}
	
	//等价于
	let person = {
		sayName(){
			return name;
		}
	
	} 


> 需计算属性名

需计算属性名规则允许对象字面量中属性名是变量、字符串字面量或者由变量计算而得的，具体写法是通过方括号[]包含属性名。

	//需计算属性名
	let person = {};
	let firstName = 'first name';
	let suffix = '@github.com'
	let email = 'email';
	//变量
	person[firstName] = 'hello';
	//字符串字面量
	person['last name']= 'world';
	//变量计算而得到的
	person[email+suffix] = 'example@github.com'


> Object.is()

JS中比较两个值是否相同的时候会使用严格等于运算符`===`，但是，使用严格运算符式，+0和-0会认为这两者是相等的，而`NaN===NaN`是不相等的，使用Object.is()方法来判断这两者情况与使用严格相等符会有所不同，其他情况和使用严格相等运算符基本一致；

	console.log(+0==-0);  //true
	console.log(+0===-0); //true
	console.log(Object.is(+0,-0)); //false
	
	console.log(NaN==NaN); //false
	console.log(NaN===NaN); //false
	console.log(Object.is(NaN,NaN)); //true
	
	console.log(5=='5'); //true
	console.log(5==='5'); //false
	console.log(Object.is(5,'5')) //false

> Object.assign()

一个对象从另外一个对象获取属性和方法，这是典型的混入（Mixin）模式，Object.assign()方法可以更简洁的实现对象混入，该方法需要一个接受者对象和若干个供应者对象。接收者会按照供应者在参数中的顺序来依次接收它们的属性，这意味着，第二个供应者可能会覆盖第一个供应者相同的属性；

	let person={
		name:'hello',
		age:18
	}
	let car ={
		brand:'BWM',
		age:5
	}
	let obj = {};
	Object.assign(obj,person,car);
	console.log(obj); //{name: "hello", age: 5, brand: "BWM"}

Object.assign()方法并未在接受者上创建访问器属性，即使供应者拥有访问器属性，由于Object.assign()方法使用赋值运算符，供应者的访问器属性会转换成接受者的数据属性；

	let receiver = {},
	supplier = {
		get name() {
			return "file.js"
		}
	};
	Object.assign(receiver, supplier);
	let descriptor = Object.getOwnPropertyDescriptor(receiver, "name");
	console.log(descriptor.value); // "file.js"
	console.log(descriptor.get); // undefined

> 允许重复的属性

在ES5严格模式下，为对象字面量中属性会检查是否重复，如果重复的话就会抛出一个错误。而在ES6中，无论是在严格模式下还是非严格模式下，都不再检查属性是否重复，当属性重复的时候，后面的属性会覆盖前面的属性；
	
	//重复的属性
	
		let person = {
			name:'hello',
			name:'world'
		}
	
		console.log(person.name); //world

		


> 自有属性的枚举顺序

ES6规定了自有属性的枚举顺序，会依次按照数字类型键->字符串类型键->符号类型键的枚举顺序：

1. 所有的数字类型键，按升序排列；
2. 所有的字符串类型键，按被添加到对象的顺序排列；
3. 所有的符号类型，也按添加顺序排列


	//自有属性的枚举顺序
	
	var obj = {
		a: 1,
		0: 1,
		c: 1,
		2: 1,
		b: 1,
		1: 1
		};
	obj.d = 1;
	console.log(Object.getOwnPropertyNames(obj).join(""));//012acbd


# 3. 更强大的原型 #

> 修改对象原型

在ES6中可以通过Object.setPrototypeOF()方法修改对象的原型，该方法包含了两个参数：一个是被修改原型的对象，一个是将被指定的原型；

	let person = {
		getName(){
			return 'hello';
		}
	}
	let dog ={
		getName(){
			return 'world';
		}
	}
	
	let friend = Object.create(person); 
	console.log(friend.getName()); //hello
	console.log(Object.getPrototypeOf(friend)===person); //true
	
	Object.setPrototypeOf(friend,dog); 
	console.log(friend.getName()); //world
	console.log(Object.getPrototypeOf(friend)===dog); //true


> 使用super引用

能够使用`super`引用，来访问原型中的方法，假如需要覆盖对象中的同名方法可以这样做：


	let person = {
		getName(){
			return 'hello';
		}
	}
	let dog ={
		getName(){
			return super.getName()+' world';
		}
	}
	
	
	
	Object.setPrototypeOf(dog,person);
	console.log(dog.getName()); //hello world

**如果使用super引用的话，只能在方法简写中才能使用，否则就会报错：**

	let dog ={
		getNanem:function (){
			return super.getName()+' world';
		}
	}
	报错：Uncaught SyntaxError: 'super' keyword unexpected here

> 方法定义

在ES6之前，方法的概念从未被正式定义，而在ES6中做出了正式定义：方法是拥有一个[[HomeObject]]内部属性的函数，此内部属性指向该方法所属的对象；

	//方法
	let person = {
		getName(){
			return 'hello';
		}
	}
	//不是方法
	function getName(){
		return 'hello world';
	}


# 4. 总结 #

ES6通过对对象功能的扩展，让ES6更加简单易用和更加强大，在对象功能上具体有这样一些改进：

**针对对象字面量：**

1. 速记法属性能够更加轻易的将作用域内的变量值赋值给同名属性；
2. 需计算属性名规则能够更方便的将，变量、字符串字面量以及通过变量计算的结果作为属性；
3. 方法简写法能够省略function关键字以及冒号：，让方法的定义更加简洁；
4. 舍弃了重复属性的检查，让后面的属性覆盖掉前面同名属性的属性值；
5. 指定了数字类型键->字符串类型键->符号类型键的对象自有属性的枚举顺序。

**针对对象原型：**
1. Object.assign()方法能够将多个提供者对象的属性整合到接受者对象中，能够方便实现对象的混入模式；
2. Object.is()方法在处理特殊值时比严格比较符更加安全；
3. Object.setPrototypeOf()方法能够更加方便更改一个对象的原型；
4. 提供super关键字，访问原型上的方法。