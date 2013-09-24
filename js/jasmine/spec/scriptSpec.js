describe('IdeaView', function() {


	it('initializes a idea view', function() {

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

		expect(testView.author).toEqual("testAuthor");
	});
});