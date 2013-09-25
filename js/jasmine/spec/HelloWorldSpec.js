describe("Hello world", function(){
	it("says world", function(){
		expect(helloWorld()).toContain("world");
	});
});

describe('Gimmie A Number', function() {

    beforeEach(function() {
        this.addMatchers({
            toBeDivisibleByTwo: function() {
                return (this.actual % 2) === 0;
            }
        });
    });

    it('is divisible by 2', function() {
        expect(gimmeANumber(2)).toBeDivisibleByTwo();
    });

});

describe("Is number greater than...", function(){
	beforeEach(function(){
		this.addMatchers({
			toBeMoreThan: function(x){
				return this.actual > x;
			}
		});
	});

	it("5", function(){
		expect(gimmeANumber(3)).toBeMoreThan(2);
	});

	it("7", function(){
		expect(gimmeANumber(8)).toBeMoreThan(7);
	});
});

// This will make a fake person, for testing purposes. 
// This will spy on this fake person's sayHello() method. 
// Then we will do something that should trigger what we're spying on. 
// Then we should tell Jasmine what we expect.
//
describe("Person", function(){
	it("calls the sayHello() function", function(){
		var fakePerson = new Person();
		spyOn(fakePerson, "sayHello"); //fake Person has a method called sayHello
		fakePerson.helloSomeone("world"); //call function with argument helloSomeone("world")

		expect(fakePerson.sayHello).toHaveBeenCalled(); //Expcets sayHello to have been called
	});
});


describe("Person", function() {
    it("greets the world", function() {
        var fakePerson = new Person();
        spyOn(fakePerson, "helloSomeone");
        fakePerson.helloSomeone("world");

       	//toHaveBeenCalled and toHaveBeenCalledWith must use a spyOn
        //function. spyOn will keep track of the results of "helloSomeone"
        //and give it to toHaveBeenCalled/With
        expect(fakePerson.helloSomeone).toHaveBeenCalledWith("world");
    });
});


describe("Person", function() {
    it("says hello", function() {
        var fakePerson = new Person();
        //creates a dummy function. It does nothing, returns nothing.
        //We add a spy to be able to ensure that this function has been called.
        fakePerson.sayHello = jasmine.createSpy("disdfa");
        fakePerson.helloSomeone("world");

        expect(fakePerson.sayHello).toHaveBeenCalled();
    });
});

describe("Person", function() {
    it("says hello", function() {
        var fakePerson = new Person();
        //creates a dummy spy and makes it return something.
        //In this case "ello ello"
        fakePerson.sayHello = jasmine.createSpy('Anything can go in here').andReturn("ello ello");
        fakePerson.helloSomeone("hi");

        expect(fakePerson.sayHello).toHaveBeenCalled();
    });
});

describe("Person", function() {
    it("says hello", function() {
        var fakePerson = new Person();
        //creates a dummy function and spy and has the function do something.
        fakePerson.sayHello = jasmine.createSpy(
        '"Say hello", spy').andCallFake(function(){
        	//document.write("Time to say hello!");
        	return "bonjour";
        })

        //when this expect is used it calls the function
        //thus the next line evaluates true so that we don't
        //have to call it on our own.
        //fakePerson.sayHello("Bob");
        expect(fakePerson.sayHello()).toEqual("bonjour");
        expect(fakePerson.sayHello).toHaveBeenCalled();
    });
});


