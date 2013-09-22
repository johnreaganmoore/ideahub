var myDataRef = new Firebase("https://idea-hub.firebaseio.com/");
var fireBIdeas = myDataRef.child("ideas");
var fireBIdeaCounter = myDataRef.child('ideasCounter');
var ideasCounter;

fireBIdeaCounter.once("value", function(snapshot){
	ideasCounter = snapshot.val();
});

var ideaTemplateHtml = $('.templates .idea-template').html();
var ideaTemplate = _.template(ideaTemplateHtml);

// _________________________Auth Code______________________________________//

var auth = new FirebaseSimpleLogin(myDataRef, function(error, user) {

	if (error) {
	// an error occurred while attempting login
		console.log(error);
	} else if (user) {
	// user authenticated with Firebase

		this.user = user
	} else {
	// user is logged out
	}
});


//____________________________BackBone___________________________________//

var IdeaView = Backbone.View.extend({

	initialize: function(options) {
		this.author = options.author;
		this.authorImage =options.authorImage;
		this.title = options.title;
		this.content = options.content;
		this.votes = options.votes.length;
		this.ideaId = options.ideaId;
	},

	render: function() {
		var ideaHtml = ideaTemplate({
			author: this.author,
			authorImageUrl: this.authorImage,
			ideaTitle: this.title,
			ideaDesc: this.content,
			votes: this.votes,
			ideaId: this.ideaId
		});
		$(this.el).html(ideaHtml);
		return this;
	},

	events: { 
		"click .voteUp": "updateVote"

	},

	updateVote: function() {
		this.votes ++;
		var self = this;
		fireBIdeas.child(self.ideaId.toString()).once("value", function(snapshot){
			var ideaOb = snapshot.val();
			ideaOb.votes.push(auth.user.id);

			fireBIdeas.child(self.ideaId.toString()).set(ideaOb);
		});
		ideasView.render();
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
	},

	render: function(){
		for(var i = 0; i < this.ideaViews.length; i++){
			var newIdeaHtml = this.ideaViews[i].render().el;
			$(this.el).append(newIdeaHtml);
		}
	}
});

var ideasView = new ShowIdeasView({
	el: $('#ideas-feed')
});

//______________________________Load DataBase_______________________//


fireBIdeas.on('child_added', function(snapshot) {
	var fireBaseObj = snapshot.val();

	if(typeof fireBaseObj === "object"){
		updatePageInfo(fireBaseObj.ideaTitle, fireBaseObj.ideaDesc, fireBaseObj.userName, fireBaseObj.avatar, fireBaseObj.votes, fireBaseObj.ideaId);
	}
});

var updatePageInfo = function(title, desc, username, avatar, votes, ideaId){
	var obj = {
		author: username,
		authorImage: avatar,
		title: title,
		content: desc,
		votes: votes,
		ideaId: ideaId
	};
	ideasView.add_new(obj);
};


//_______________________Event Listeners___________________________//

$(document).on('click', ".login", function(e) {
	auth.login('github');
});

