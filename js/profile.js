

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

var sample = {
	data: {
		title: "Test Title",
		votes: 4,
		interest:7
	}
};

var sample1 = {
	data: {
		title: "Another Title",
		votes: 6,
		interest:3
	}
};

userIdeasView.add_new(sample);

userIdeasView.add_new(sample1);


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


