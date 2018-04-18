	//1.var变量提升
	function getValue(condition){
		if(condition){
			//value的TDZ
			let value = "yes";
			return value;
		}else{
			return value;
		}
	}

	console.log(getValue(false));
	const type='TEST'
	type = 'DEBUG'
	console.log(type);	

	//2.const声明对象，可以修改成员
	const person = {name:'nancy'};
	person.name= 'nike';
	console.log(person.name);
	person = {};

	for(let i = 0;i<5;i++){
		setTimeout(()=>{
			console.log(i);
		},1000);
	}
	console.log(i);

	//3.const变量可以用于for-in和for-of循环
	let arr = [1,2,3,4];
	for(const item of arr){
		console.log(item);
	}
	//let和const变量不会覆盖全局对象上的属性
	const RegExp = 'hello';
	console.log(window.RegExp);
	console.log(window.RegExp===RegExp);