function helloWorld(){
	return "Hello world!";
}

function gimmeANumber(num){
	return num;
}

var Person = function() {};

Person.prototype.helloSomeone = function(toGreet) {
    return this.sayHello() + " " + toGreet;
};

Person.prototype.sayHello = function() {
    return "Hello";
};