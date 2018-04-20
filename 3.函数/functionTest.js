<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Document</title>
</head>
<body>
	<script type="text/javascript">
		//函数参数默认值
		let defaultFunc = function(url,tomeout=2000,callback={}){};
		defaultFunc('/url');
		defaultFunc('/url',100);
		defaultFunc('/url',100,function(body){
			doSomething(body);
		})
		//ES5非严格模式下具名参数对arguments对象的影响
		function testArgs(a,b){
			console.log(a===arguments[0]);
			console.log(b===arguments[1]);
			a='c';
			b='d';
			console.log(a===arguments[0]);
			console.log(b===arguments[1]);
		}
		testArgs('a','b');
		//函数参数默认值表达式
		function getValue(){return 5};
		function test(a,b=getValue()){
			return a+b;
		}
		console.log(test(1));
		console.log(test(1,2));

		function add(a,b=1){return a+b};
		console.log(add(1,1));
		function addition(a=b,b){return a+b};
		console.log(addition(undefined,1));

		function rp(...keys){console.log(keys.length)}
		rp(1,2);

		let person ={
			set name(...names);
		}

		var add = new Function("first","second","return first+second");
		console.log(add(1,1));

		//扩展运算符

		console.log(Math.min(0,...[1,2,3,4]));

		//new.target属性
		function target(){
			if(new.target!=='undefined'){
				console.log('通过new来调用');
			}else{
				console.log('不是通过new来调用');
			}
		}

		let test = new target();

		//箭头函数没有arguments对象绑定
		let outer = function(arg){
			return ()=>arguments[0];
		}
		let inner = outer(7);
		console.log(inner());

		//尾递归优化
		'use strict'

	function doSomething(){
		//满足尾调用优化条件
		return doElse();
	}	


	function doSomething(){
		let tmp = doElse();
		//尾调用函数结果没有直接返回，因此不满足
		//尾调用优化条件
		return tmp;
	}	


	function doSomething(){
		//尾调用函数后有其他额外操作，结果没有
		//立即返回，因此不满足尾调用优化条件
		return 1+doElse();
	}

	</script>


</body>
</html>