describe('IdeaView', function() {

	// beforeEach(function(){

	// 	this.addMatchers({
	// 		prop: function(x) {
	// 			return this.actual.x 
	// 		}
	// 	});
	// });



		var options = {
			author: "testAuthor",
			avatar: "testAvatar",
			title: "testTitle",
			content: "testContent",
			votes: 'testVotes',
			voted: "testVoted",
			ideaId: "testId",
			interest: "testInterest",
			interested: "testInterested"
		};

		var testView = new IdeaView(options);

	it('initializes an idea view', function() {
	
		expect(testView.author).toEqual("testAuthor");
	});

	it('renders an html view of the object', function() {

		testView.render();

		expect($('.ideas-feed')).toContain("testContent");
	});
});