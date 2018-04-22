//属性构造器的速记法
		function createPerson(name,age){
			return {
				name,
				age
			}
		}

		console.log(createPerson('hello',18));

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

		需计算属性名
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
		console.log(person);

		Object.is()方法
		console.log(+0==-0);
		console.log(+0===-0);
		console.log(Object.is(+0,-0));

		console.log(NaN==NaN);
		console.log(NaN===NaN);
		console.log(Object.is(NaN,NaN));

		console.log(5=='5');
		console.log(5==='5');
		console.log(Object.is(5,'5'))

		Object.assign()
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
		console.log(obj);

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

		//重复的属性
		let person = {
			name:'hello',
			name:'world'
		}

		console.log(person.name); 

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

		Object.setPrototypeOf方法
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
		console.log(friend.getName());
		console.log(Object.getPrototypeOf(friend)===person);

		Object.setPrototypeOf(friend,dog);
		console.log(friend.getName());
		console.log(Object.getPrototypeOf(friend)===dog);

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

		let dog ={
			getNanem:function (){
				return super.getName()+' world';
			}
		}

		

		Object.setPrototypeOf(dog,person);
		console.log(dog.getName()); //hello world