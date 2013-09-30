
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


//______________________Sample Data________________________________


fireBUsers.child("5273755").child("authorList").once("value", function(snapshot){
	authorList = snapshot.val();

	for(var i = 1; i < authorList.length; i++){

		fireBUsers.child("5273755").child("authorList").child(i).once("value", function(snapshot){

			var ideaId = snapshot.val();

			fireBIdeas.child(ideaId).once("value", function(snapshot){
				var tempOb = snapshot.val();

									console.log(tempOb.ideaTitle);

				var tempData = {
					data: {
						title: tempOb.ideaTitle,
						votes: tempOb.voteCount.length - 1,
						interest: tempOb.interestList.length
					}
				};

						userIdeasView.add_new(tempData);

			});		



		});
	}
});



//Functional Idea Profile Display Hardcoded________________


// fireBIdeas.child("25").once("value", function(snapshot){
// 	tempOb = snapshot.val();

// 	var sample2 ={
// 		data: {
// 			title: tempOb.ideaTitle,
// 			votes: tempOb.voteCount.length - 1,
// 			interest: tempOb.interestList.length
// 		}

// 	};

// 	userIdeasView.add_new(sample2);

// });



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
			response: this.data.response
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

var sample = {
	data: {
		title: "Test Title",
		votes: 4,
		response:"Denied"
	}
};

var sample1 = {
	data: {
		title: "Another Title",
		votes: 6,
		response:"Accepted"
	}
};

userInterestsView.add_new(sample);

userInterestsView.add_new(sample1);


