
var userIdeaTemplateHtml = $('.templates .user-idea-template').html();
var userIdeaTemplate = _.template(userIdeaTemplateHtml);


// Individual Idea View created______________________

var UserIdeaView = Backbone.View.extend({

	initialize: function(options) {
		this.data = options.data;
	},

	render: function() {
		var userIdeaHtml = userIdeaTemplate({
			ideaTitle: this.data.title,
			votes: this.data.votes,
			interest: this.data.interest
		});
		$(this.el).html(userIdeaHtml);
		return this;
	}

});



// Show IdeaViews created______________________

var ShowUserIdeasView = Backbone.View.extend({

	initialize: function(options) {
		this.userIdeaViews = [];
	},





	add_new: function(obj){
		var newUserIdeaView = new UserIdeaView(obj);

		var newUserIdeaHtml = newUserIdeaView.render().el;
		this.userIdeaViews.push(newUserIdeaView);
		$(this.el).append(newUserIdeaHtml);
	},

	render: function(){
		for(var i = 0; i < this.userIdeaViews.length; i++){
			var newUserIdeaHtml = this.userIdeaViews[i].render().el;
			$(this.el).append(newUserIdeaHtml);
		}
	}
});

var userIdeasView = new ShowUserIdeasView({
	el: $('#user-ideas')
});


//______________________Retreive Firebase Data from authorList_______________________________


// Take a snapshop of the list of ideaId's for the ideas the user authored.(Will be an array of Id's)

fireBUsers.child("5273755").child("authorList").once("value", function(snapshot){
	authorList = snapshot.val();

// Iterate through the array of ideaIds and grab a snapshot of each ideaId in the authorList.

	for(var i = 1; i < authorList.length; i++){

		fireBUsers.child("5273755").child("authorList").child(i).once("value", function(snapshot){

			var ideaId = snapshot.val();

// And for each of those ideaIds, take a snapshot of the idea object.

			fireBIdeas.child(ideaId).once("value", function(snapshot){
				var ideaOb = snapshot.val();

// Take out the data you want from the snapshot of the idea object.

				var tempData = {
					data: {
						title: ideaOb.ideaTitle,
						votes: ideaOb.voteCount.length - 1,
						interest: ideaOb.interestList.length
					}
				};

// Pass that data into a Backbone view.

				userIdeasView.add_new(tempData);

			});	
		});
	}
});


//_________________User Interested Idea View created______________________

var userInterestTemplateHtml = $('.templates .user-interests-template').html();
var userInterestTemplate = _.template(userInterestTemplateHtml);


var UserInterestView = Backbone.View.extend({

	initialize: function(options) {
		this.data = options.data;
	},

	render: function() {
		var userInterestHtml = userInterestTemplate({
			ideaTitle: this.data.title,
			votes: this.data.votes,
			numWanted: this.data.numWanted
		});
		$(this.el).html(userInterestHtml);
		return this;
	}

});



// Show IdeaViews created______________________

var ShowUserInterestsView = Backbone.View.extend({

	initialize: function(options) {
		this.userInterestViews = [];
	},

	add_new: function(obj){
		var newUserInterestView = new UserInterestView(obj);

		var newUserInterestHtml = newUserInterestView.render().el;
		this.userInterestViews.push(newUserInterestView);
		$(this.el).append(newUserInterestHtml);
	},

	render: function(){
		for(var i = 0; i < this.userInterestViews.length; i++){
			var newUserInterestHtml = this.userInterestViews[i].render().el;
			$(this.el).append(newUserInterestHtml);
		}
	}
});

var userInterestsView = new ShowUserInterestsView({
	el: $('#user-interests')
});


//______________________Retreive Firebase Data from iList_______________________________


// Take a snapshop of the list of ideaId's for the ideas the user is interested in.(Will be an array of Id's)
fireBUsers.child("5273755").child("iList").once("value", function(snapshot){

	interestList = snapshot.val();

// Iterate through the array of ideaIds and grab a snapshot of each ideaId in the iList.
	for(var i = 1; i < interestList.length; i++){

		fireBUsers.child("5273755").child("iList").child(i).once("value", function(snapshot){

			var ideaId = snapshot.val();

// And for each of those ideaIds, take a snapshot of the idea object.
			fireBIdeas.child(ideaId).once("value", function(snapshot){
				var ideaOb = snapshot.val();


// Take out the data you want from the snapshot of the idea object.
				var tempData = {
					data: {
						title: ideaOb.ideaTitle,
						votes: ideaOb.voteCount.length - 1,
						numWanted: ideaOb.numWanted
					}
				};
// Pass that data into a Backbone view.
				userInterestsView.add_new(tempData);

			});	
		});
	}
});


