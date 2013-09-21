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

		for (var i = 0; i < options.ideas.length; i += 1){
			var newIdeaView = new IdeaView( options.ideas[i])
			this.ideaViews.push(newIdeaView);
		}
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
	ideas: [
		{author: 'John',
		authorImage: 'https://1.gravatar.com/avatar/a4a117ab19cb2de796dca89e3e7e60f4?d=https%3A%2F%2Fidenticons.github.com%2Fb5de1de51761bc54b4f084ee9a6d5d6c.png&s=420',
		title: 'Test Title',
		content: 'HAHAHAHHAHAHA no ideas here',
		votes: '5'
		},
		{author: 'Kaoru',
		authorImage: 'https://1.gravatar.com/avatar/a6a65187c4e0da4b2825abb6012231fd?d=https%3A%2F%2Fidenticons.github.com%2Ff8f2c2aea75ab949202aeaaf0f2cfce4.png&s=420',
		title: 'Test Title 2',
		content: 'It works hooray!',
		votes: '3'
		}	
	],
	el: $('#ideas-feed')
});

ideasView.render();

