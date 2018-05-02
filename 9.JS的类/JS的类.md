> 主要知识点：类声明、类表达式、类的重要要点以及类继承


![迭代器与生成器的知识点](https://github.com/CL0610/ES6-learning/blob/master/9.JS的类/JS的类.png)



# 1. 类的声明 #

> 基本的类声明

类声明以`class`关键字开始，其后是类的名称；类中的方法就像是对象字面量中的方法简写，并且方法之间不需要使用逗号：


	class PersonClass{
	
	
		constructor(name){
			this.name = name;
		}
		sayName(){
			console.log(this.name);
		}
	}
	
	let person = new PersonClass("hello class");
	person.sayName();

类声明语法允许使用`constructor`直接定义一个构造器，而不需要先定义一个函数，再把它当做构造器来使用。类中的方法使用的函数简写语法，省略了关键字`function`。

使用class关键字来定义一个类型，有这样几个要点：

1. 类声明不会被提升，这与ES6之前通过函数定义不同。类声明与使用`let`定义一样，因此也存在暂时性死区；
2. 类声明中的所有代码会自动运行在严格模式下，并且无法退出严格模式；
3. 类的所有方法都是不可枚举的；
4. 类的所有内部方法都没有`[[Constructor]]`，因此使用`new`来调用他们会抛出错误；
5. 调用类构造器时不使用`new`，会抛出错误；
6. 试图在类的内部方法中重写类名，会抛出错误；

# 2. 类表达式 #

类与函数有相似之处，都有两种形式：声明与表达式。函数声明与类声明都以关键词开始（分别是function和class），之后就是标识符（即函数名或者类名）。如果需要定义匿名函数，则function后面就无需有函数名，类似的，如果采用类表达式，关键是class后也无需有类名；

> 基本的类表达式

使用类表达式，将上例改成如下形式：


	let PersonClass = class {
	
	
		constructor(name){
			this.name = name;
		}
		sayName(){
			console.log(this.name);
		}
		
	}
	
	let person = new PersonClass("hello class");
	person.sayName(); //hello  class


**示例代码中就定义了一个匿名的类表达式，如果需要定义一个具名的类表达式，只需要像定义具名函数一样，在class关键字后面写上类名即可。**

# 3. 类的重要要点 #

> 作为一级公民的类

在编程中，**能够被当作值来使用的就成为一级公民（first-class citizen）**。既然都当作值使用，就说明它能够作为参数传递给函数、能作为函数的返回值也能用来给变量赋值。JS中的函数是一等公民，类也是一等公民。


例如，将类作为参数传递给函数：

	function createObj(classDef){
		return new classDef();
	}
	
	let obj = createObj(class{
		sayName(){
			console.log('hello'); //hello
		}
	})
	
	obj.sayName();

**类表达式另一个重要用途是实现立即调用类构造器以创建单例。**语法是使用`new`来配合类表达式使用，并在表达式后面添加括号()：


	//立即调用构造器
	
	let person = new class{
		constructor(name){
			this.name = name;
		}
		sayName(){
			console.log(this.name);
		}
	}('hello world');
	
	person.sayName(); //hello world


> 访问器属性

自有属性需要在类构造器中创建，而类还允许创建访问器属性。为了创建一个`getter`，要使用`get`关键字，并要与后面的标识符之间留出空格；创建`setter`使用相同的方式，只需要将关键字换成`set`即可：


	class PersonClass{
		constructor(name){
			this.name = name;
		}
		get name(){
			return name; //不要使用this.name会导致无限递归
		}
	
		set name(value){
			name=value; //不要使用this.value会导致无限递归
		}
	}
	let person = new PersonClass('hello');
	console.log(person.name); // hello
	person.name = 'world';
	console.log(person.name); //world
	let descriptor = Object.getOwnPropertyDescriptor(PersonClass.prototype,'name');
	console.log('get' in descriptor); //true

> 需计算属性名

对象字面量和类之间的相似点有很多，类方法与类访问器属性都能使用需计算属性名的方式，语法与对象字面量中需计算属性名一样，都是使用方括号[]来包裹表达式：


	//需计算属性名
	let methodName ='sayName';
	let propertyName = 'name';
	
	class PersonClass{
		constructor(name){
			this.name = name;
		}
		get [propertyName](){
			return name;
		}
		set [propertyName](value){
			name = value;
		}
		[methodName](){
			return console.log(this.name);
		}
	}
	let person = new PersonClass('hello world');
	person.sayName(); //hello world
	console.log(person.name); //hello world

> 生成器方法

在对象字面量中定义一个生成器：只需要在方法名前附加一个星号`*`即可，这一语法对类同样有效，允许将类的任意内部方法编程生成器方法：


	//生成器方法：
	
	class GeneClass{
	
		*generator(){
			yield 1;
			yield 2;				
		}
	}
	
	let obj = new GeneClass();
	let iterator = obj.generator();
	console.log(iterator.next().value); //1
	console.log(iterator.next().value); //2
	console.log(iterator.next().value); //undefined

可迭代对象用于`Symbol.iterator`属性，并且该属性指向生成器函数。因此，在类定义中同样可以使用`Symbol.iterator`属性来定义生成器方法，从而定义出类的默认迭代器。同时也可以通过生成器委托的方式，将数组、Set、Map等迭代器委托给自定义类的迭代器：

	class Collection {
		constructor() {
			this.items = [];
		} 
		*[Symbol.iterator]() {
			for(let item of this.items){
				yield item;
			}				
		}
	} 
	let collection = new Collection();
	collection.items.push(1);
	collection.items.push(2);
	collection.items.push(3);
	for (let x of collection) {
		console.log(x);
	}
	输出：1 2 3

> 静态成员

ES6的类简化了静态成员的创建，只要在方法与访问器属性的名称前添加`static`关键字即可：

	class PersonClass {
		// 等价于 PersonType 构造器
		constructor(name) {
			this.name = name;
		}
		static create(name) {
			return new PersonClass(name);
		}
	}
	
	let person = PersonClass.create("Nicholas");

通过在方法前加上`static`关键字，使其转换成静态方法。能在类中的任何方法与访问器属性上使用 `static` 关键字，唯一限制是不能将它用于 `constructor` 方法的定义。**静态成员不能用实例来进行访问，始终需要用类自身才能访问它们。**


> 类继承

使用关键字extends可以完成类继承，同时使用super关键字可以在派生类上访问到基类上的方法，包括构造器方法：

	
	//类继承
	
	class Rec{
		constructor(width,height){
			this.width = width;
			this.height = height;
		}
	
		getArea(){
			return this.width*this.height;
		}
	
	}
	
	class Square extends Rec{
		constructor(width,height){
			super(width,height);
		}
	
	}
	
	let square = new Square(100,100);
	console.log(square.getArea()); //10000


关于类继承，还有这样几个要点：
1. **在派生类中方法会覆盖掉基类中的同名方法，**例如在派生类`Square`中有`getArea()`方法的话就会覆盖掉基类`Rec`中的`getArea()`方法；
2. 如果基类中包含了静态成员，那么这些静态成员在派生类中也是可以使用的。注意：**静态成员只能通过类名进行访问，而不是使用对象实例进行访问**；


> 从表达式中派生类

在ES6中派生类**最大的能力就是能够从表达式中派生类**，只要一个表达式能够返回的对象具有`[[Constructor]]`属性以及原型，你就可以对该表达式使用`extends`进行继承。**由于extends后面能够接收任意类型的表达式，这就带来了巨大的可能性，可以动态决定基类，因此一种对象混入的方式：**

	//从表达式中派生类
	
	let SerializableMixin = {
		serialize() {
			return JSON.stringify(this);
	}
	};
	let AreaMixin = {
		getArea() {
			return this.length * this.width;
		}
	};
	function mixin(...mixins) {
		var base = function() {};
		Object.assign(base.prototype, ...mixins);
		return base;
	} 
	class Square extends mixin(AreaMixin, SerializableMixin) {
		constructor(length) {
		super();
		this.length = length;
		this.width = length;
		}
	} 
	let x = new Square(3);
	console.log(x.getArea()); // 9
	console.log(x.serialize()); // "{"length":3,"width":3}"


`mixin() `函数接受代表混入对象的任意数量的参数，它创建了一个名为 `base` 的函数，并将每个混入对象的属性都赋值到新函数的原型上。此函数随后被返回，于是 `Square` 就能够对其使用 `extends` 关键字了。注意由于仍然使用了 `extends` ，你就必须在构造器内调用 `super()`。若多个混入对象拥有相同的属性，则只有最后添加
的属性会被保留。

# 4. 继承内置对象 #

在E6中能够通过`extends`继承JS中内置对象，例如：

	class MyArray extends Array {
	// 空代码块
	} 
	let colors = new MyArray();
	colors[0] = "red";
	console.log(colors.length); // 1
	colors.length = 0;
	console.log(colors[0]); // undefined


> Symbol.species

属性`Symbol.species`被用于**定义静态访问器属性**，该属性值**用来指定类的构造器**。当创建一个新的对象实例时，就需要通过`Symbol.species`属性获取到构造器，从而新建对象实例。

下面内置对象都定义了`Symbol.species`属性：

- Array;
- ArrayBuffer;
- Map;
- Promise;
- RegExp;
- Set;
- 类型化数组

例如在自定义类型中，使用`Symbol.species`:


	class MyClass {
		static get [Symbol.species]() {
			return this;
		} 
		constructor(value) {
			this.value = value;
		} 
		clone() {
			return new this.constructor[Symbol.species](this.value);
		}
	} 
	class MyDerivedClass1 extends MyClass {
		// 空代码块
	} 
	class MyDerivedClass2 extends MyClass {
		static get [Symbol.species]() {
			return MyClass;
		}
	} 
	let instance1 = new MyDerivedClass1("foo"),
	clone1 = instance1.clone(),
	instance2 = new MyDerivedClass2("bar"),
	clone2 = instance2.clone();
	console.log(clone1 instanceof MyClass); // true
	console.log(clone1 instanceof MyDerivedClass1); // true
	console.log(clone2 instanceof MyClass); // true
	console.log(clone2 instanceof MyDerivedClass2); // false

此处, `MyDerivedClass1` 继承了 `MyClass` ，并且未修改 `Symbol.species` 属性。由于
`this.constructor[Symbol.species]` 会返回 `MyDerivedClass1` ，当 `clone()` 被调用时，它就
返回了 `MyDerivedClass1` 的一个实例。 `MyDerivedClass2` 类也继承了 `MyClass` ，但重写了
`Symbol.species `，让其返回 `MyClass` 。当 `clone()` 在 `MyDerivedClass2` 的一个实例上被调
用时，返回值就变成 `MyClass` 的一个实例。使用 `Symbol.species `，任意派生类在调用应当
返回实例的方法时，都可以判断出需要返回什么类型的值。


> 在类构造器中使用new.target


使用`new.target`属性能够判断当前实例对象是由哪个类构造器进行创建的，简单的情况下，`new.target`属性就等于该类的构造器函数，同时new.target属性也只能在构造器内被定义。


	class Rec{
		constructor(){
			console.log(new.target===Rec);
		}
	}
	
	class Square extends Rec{
	
	}
	
	let rec = new Rec();
	let square = new Square();
	
	输出：true false

当创建`Rec`对象实例时，`new.target`指代的是`Rec`自身的构造器，因此`new.target===Rec`会返回`true`，而`Rec`的派生类`Square`的`new.target`会指向它自身的构造器，因此`new.target===Rec`会返回false;

**可以使用new.target来创建一个抽象基类：**

	class Rec{
		constructor(){
			if(new.target===Rec){
				throw new Error('abstract class');
			}
		}
	}
	
	class Square extends Rec{
	
	}
	
	let rec = new Rec(); //Uncaught Error: abstract class
	let square = new Square(); //不会报错

当试图创建一个Rec实例对象时，会抛出错误，因此Rec可以当做一个抽象基类。

# 5. 总结 #

1. ES6中的类使用关键字class进行定义，即可以采用类声明的方式也可以采用类表达式进行定义。 此外，类构造器被调用时不能缺少 new ，确保了不能意外地将类作为函数来调用用。 

2. 基于类的继承允许你从另一个类、函数或表达式上派生新的类。这种能力意味着你可以调用一个函数来判断需要继承的正确基类，也允许你使用混入或其他不同的组合模式来创建一个新类。新的继承方式让继承内置对象（例如数组） 也变为可能，并且其工作符合预期。

3. 可以使用`new.target`来判断创建实例对象时所用的类构造器。利用`new.target`可以用来创建一个抽象基类；

总之，类是 JS 的一项新特性，它提供了更简洁的语法与更好的功能，通过安全一致的方式来自定义一个对象类型。