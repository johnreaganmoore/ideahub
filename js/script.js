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
	var urlArray = window.location.pathname.split( '/' );

	if (error) {
	// an error occurred while attempting login
		console.log(error);
	} else if (user) {
	// user authenticated with Firebase
		if(urlArray.indexOf("index.html") > -1){
			window.location.assign("user.html");
		}

		this.user = user
	} else {
		if(urlArray.indexOf("index.html" ) === -1){
			window.location.assign("index.html");
		}
	}
});



//____________________________BackBone___________________________________//

var IdeaView = Backbone.View.extend({

	initialize: function(options) {
		this.author = options.author;
		this.avatar =options.avatar;
		this.title = options.title;
		this.content = options.content;
		this.votes = options.votes.length;
		this.voted = options.voted;
		this.ideaId = options.ideaId;
		this.interest = options.interest;
		this.interested = options.interested;
	},

	render: function() {
		var ideaHtml = ideaTemplate({
			author: this.author,
			avatar: this.avatar,
			ideaTitle: this.title,
			ideaDesc: this.content,
			votes: this.votes,
			voted: this.voted,
			ideaId: this.ideaId,
			interest: this.interest,
			interested: this.interested
		});
		$(this.el).html(ideaHtml);
		return this;
	},

	events: { 
		"click .voteUp": "updateVote",
		"click .interest": "updateInterest"
	},

	updateVote: function(e) {
		e.preventDefault();
		if(this.voted === "+"){ //Triggers single votes!
			this.votes ++;
			this.voted = "voted!";
			var self = this;
			fireBIdeas.child(self.ideaId.toString()).once("value", function(snapshot){
				var ideaOb = snapshot.val();
				ideaOb.votes.push(auth.user.id);

			fireBIdeas.child(self.ideaId.toString()).set(ideaOb);
			});
		}

		ideasView.render();
	},

	updateInterest: function(e) {
		e.preventDefault();

		if(this.interested === "I'm interested"){
			this.interested = "All in!";

			var self = this;
			fireBIdeas.child(self.ideaId.toString()).once("value", function(snapshot) {
				var ideaOb = snapshot.val();
				ideaOb.interest.auth.user.id = auth.user;

				fireBIdeas.child(self.ideaId.toString()).set(ideaOb);
			});
		}

		ideasView.render();
	}



});



var ShowIdeasView = Backbone.View.extend({

	initialize: function(options) {
		this.ideaViews = [];
	},

	add_new: function(obj){
		var newIdeaView = new IdeaView(obj);
		if(auth.user && obj.votes.indexOf(auth.user.id) > -1){
			obj.voted = "voted";
		}
		var newIdeaHtml = newIdeaView.render().el;
		this.ideaViews.push(newIdeaView);
		$(this.el).append(newIdeaHtml)
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
		updatePageInfo(fireBaseObj.ideaTitle, fireBaseObj.ideaDesc, fireBaseObj.userName, fireBaseObj.avatar, fireBaseObj.votes, fireBaseObj.voted, fireBaseObj.ideaId, fireBaseObj.interest, fireBaseObj.interested);
	}
});

var updatePageInfo = function(title, desc, username, avatar, votes, voted, ideaId, interest, interested){
	if(auth.user && votes.indexOf(auth.user.id) > -1){
		voted = "voted!";
	}

	if(auth.user && interest.indexOf(auth.user)){
		interested = "All in!";
	}

	var obj = {
		author: username,
		avatar: avatar,
		title: title,
		content: desc,
		votes: votes,
		voted: voted,
		ideaId: ideaId,
		interest: interest,
		interested: interested
	};
	ideasView.add_new(obj);
};


//_______________________Event Listeners______________________//

$(document).on('click', ".login", function(e) {
	auth.login('github');
});

$(document).on('click', ".logOut", function(e) {
	auth.logout();
});

