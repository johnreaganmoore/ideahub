
// Must diable redirects in script.js to run test.

describe('updatePageInfo ', function(){
	beforeEach(function(){
		var tempObj = {
			author: "author",
			avatar: "avatar",
			ideaTitle: "ideaTitle",
			ideaDesc: "ideaDesc",
			votes: "votes.length",
			voted: "voted",
			ideaId: "ideaId",
			interest: "interest",
			interested: "interested"
		};
		updatePageInfo(tempObj);
	});

	it("successfully loads a fake idea with div.author author === author", function(){
		expect($(".author").text()).toBe("author");
	});
});



describe('Test if views..', function () {
  it("Are being populated on the page", function(){
  	expect($('#ideas-feed')).toExist;
  })
});