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

var sample = {
	data: {
		title: "test title",
		votes: 4,
		interest:7
	}
};

userIdeasView.add_new(sample);