var ideaTemplateHtml = $('.templates .idea-template').html();
var ideaTemplate = _.template(ideaTemplateHtml);

var IdeaView = Backbone.View.extend({

	initialize: function(options) {
		this.author = options.author;
		this.authorImage =options.authorImage;
		this.title = options.title;
		this.content = options.content;
		this.votes = options.votes;
	},

	render: function() {
		var ideaHtml = ideaTemplate({
			author: this.author,
			authorImageUrl: this.authorImage,
			ideaTitle: this.title,
			ideaDesc: this.content,
			votes: this.votes
		});
		$(this.el).html(ideaHtml);
		return this;
	}
});

var ShowIdeasView = Backbone.View.extend({

	initialize: function(options) {
		this.ideaViews = [];
	},

	add_new: function(obj){
		var newIdeaView = new IdeaView(obj);
		var newIdeaHtml = newIdeaView.render().el;
		this.ideaViews.push(newIdeaView);
		$(this.el).append(newIdeaHtml);
		console.log(newIdeaHtml)
	},

	render: function() {

		$(this.el).empty();

		for (var i = 0; i < this.ideaViews.length; i += 1) {
			var newIdeaElement = this.ideaViews[i].render().el;
			$(this.el).append(newIdeaElement);
		}
		return this;
	},
});

var ideasView = new ShowIdeasView({
	el: $('#ideas-feed')
});

myDataRef.on('child_added', function(snapshot) {
	var idea = snapshot.val();
	updatePageInfo(idea.ideaTitle, idea.ideaDesc, idea.userName, idea.avatar);
});

var updatePageInfo = function(title, desc, username, avatar){
	var obj = {
		author: username,
		authorImage: avatar,
		title: title,
		content: desc,
		votes: 5
	};
	ideasView.add_new(obj);
};


