
// Please comment out authenticate() in the script2 function before running this test!

describe("initIdeas", function(){
	it("creates a new ideaBackBone.MainView obj", function(){
		initIdeas();
	});
});


describe('updatePageInfo ', function(){
	beforeEach(function(){
		auth = "fake user";

		var tempObj = {
			author: "author",
			avatar: "avatar",
			ideaTitle: "ideaTitle",
			ideaDesc: "ideaDesc",
			votes: "votes length",
			voted: "voted",
			ideaId: "ideaId",
			interest: "interest",
			interested: "interested"
		};
		updatePageInfo(tempObj);
	});

	afterEach(function(){
		$("#ideasFeed").empty();
	});

	it("successfully loads a fake idea with div.author === author", function(){
		expect($(".author").text()).toBe("author");
	});

	it("successfully loads a fake idea with div.ideaTitle === ideaTitle", function(){
		expect($(".ideaTitle").text()).toBe("ideaTitle");
	});

	it("successfully loads a fake idea with div.ideaDesc === desc", function(){
		expect($(".ideaDesc").text()).toBe("ideaDesc");
	});
});


describe("IndiView..", function(){
		beforeEach(function(){
			auth = { prop: "fake user"};

			tempObj = {
				data: {
					author: "author",
					avatar: "avatar",
					ideaTitle: "ideaTitle",
					ideaDesc: "ideaDesc",
					votes: [],
					voted: "+",
					ideaId: "ideaId",
					interest: [],
					interested: "interested"
				}
			};
			IndiViewTemp = new IndiView(tempObj);
		});

		it("creates a new obj and unloads data from obj and assigns it to itself", function(){
			expect(IndiViewTemp.data.author).toBe("author");
			expect(IndiViewTemp.data.avatar).toBe("avatar");
			expect(IndiViewTemp.data.ideaTitle).toBe("ideaTitle");
			expect(IndiViewTemp.data.ideaDesc).toBe("ideaDesc");
		});

		it("changes the text of the buttons if user has already voted or click on interested", function(){
			auth.user = { id: 1 };

			IndiViewTemp.data.votes.push(auth.user.id);
			IndiViewTemp.data.interest.push(auth.user);

			IndiViewTemp.render();
			expect($(IndiViewTemp.el).find(".voteUp").text()).toBe("voted");
			expect($(IndiViewTemp.el).find(".interest").text()).toBe("All in!");
		})

		it("runs a method render and returns the entire obj", function(){
			expect(IndiViewTemp.render()).toBe(IndiViewTemp);
		});

		it("runs a method render and sets filled out template to it's el", function(){
			expect(IndiViewTemp.el).not.toContain(".author");
			IndiViewTemp.render();
			expect(IndiViewTemp.el).toContain(".author");
		});

		it("sets an event listener to $('.interest)' to trigger updateInterest", function(){
			// We have to attach spy on to protoype and then re-create
			// a new object. Otherwise the spy is created after 
			// backbone has already constructed the view and thus not being created at all.
			//
			// Gilbert note: All of Backbone view's properties are attached to the prototype which is why
			// we target the prototype instead of the constructor function itself.

			spyOn(IndiView.prototype, "updateInterest");
			diffIndiView = new IndiView(tempObj);

			$("#ideasFeed").append(diffIndiView.render().el);
			$(".interest").click();

			expect(IndiViewTemp.updateInterest).toHaveBeenCalled();
		});


		it("sets an event listener to $('.voteUp') to trigger updateVote", function(){

			spyOn(IndiView.prototype, "updateVote");
			diffIndiView = new IndiView(tempObj);
			$("#ideasFeed").append(diffIndiView.render().el);
			$(".voteUp").click();

			expect(IndiViewTemp.updateVote).toHaveBeenCalled();
		});
});


describe("MainView..", function(){
	beforeEach(function(){
		tempObj = {
			author: "author",
			avatar: "avatar",
			ideaTitle: "ideaTitle",
			ideaDesc: "ideaDesc",
			votes: "votes length",
			voted: "voted",
			ideaId: "ideaId",
			interest: "interest",
			interested: "interested"
		};

		MainViewTemp = new MainView({});
	});

	afterEach(function(){
		$("#ideasFeed").empty();
	});


  it("creates an object with property called collection set to an empty array", function(){
  	expect(MainViewTemp.collection.length).toBe(0);
  });

  it("has a method to add a new Indi View and stores it in collection array", function(){
  	MainViewTemp.add_new(tempObj);
  	expect(MainViewTemp.collection.length).toBe(1);
  });

});


