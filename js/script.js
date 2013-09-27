var myDataRef = new Firebase("https://idea-hub.firebaseio.com/");
var fireBIdeas = myDataRef.child("ideas");
var fireBIdeaCounter = myDataRef.child('ideasCounter');
var ideasCounter;
var onIndex = onIndex || false;

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
		if(urlArray.indexOf("index.html") > -1 || onIndex){
			window.location.assign("user.html");
		}

		this.user = user
		$(".hello").text("Welcome, " + user.username)
	} else {
		if(urlArray.indexOf("index.html" ) === -1){
			window.location.assign("index.html");
		}
	}
});



//____________________________BackBone___________________________________//

var IdeaView = Backbone.View.extend({

	initialize: function(options) {
		this.data = options.data;
	},

	render: function() {
		if(auth.user && this.data.votes.indexOf(auth.user.id) > -1){
			this.data.voted = "voted";
		}

		if(auth.user && this.data.interest.indexOf(auth.user) > -1){
			this.data.interest = "All in!";
		}


		var ideaHtml = ideaTemplate({
			author: this.data.author,
			avatar: this.data.avatar,
			ideaTitle: this.data.ideaTitle,
			ideaDesc: this.data.ideaDesc,
			votes: this.data.votes.length,
			voted: this.data.voted,
			ideaId: this.data.ideaId,
			interest: this.data.interest,
			interested: this.data.interested
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
		if(this.data.voted === "+"){ //Triggers single votes!
			this.data.voted = "voted!";
			this.data.votes ++;
			var self = this.data;
			fireBIdeas.child(self.ideaId.toString()).once("value", function(snapshot){
				var ideaOb = snapshot.val();
				var priority = snapshot.getPriority();
				
				ideaOb.votes.push(auth.user.id);
				priority --;

				fireBIdeas.child(self.ideaId.toString()).set(ideaOb);
				fireBIdeas.child(self.ideaId.toString()).setPriority(priority);
			});
		ideasView.render();
		}
	},

	updateInterest: function(e) {
		e.preventDefault();

		if(this.data.interested === "I'm interested"){
			this.data.interested = "All in!";

			var self = this.data;
			fireBIdeas.child(self.ideaId.toString()).once("value", function(snapshot) {
				var ideaOb = snapshot.val();
				var priority = snapshot.getPriority();

				ideaOb.interest.push(auth.user);
				priority --;

				fireBIdeas.child(self.ideaId.toString()).set(ideaOb);
				fireBIdeas.child(self.ideaId.toString()).setPriority(priority)
			});
		ideasView.render();
		}
	}
});



var ShowIdeasView = Backbone.View.extend({

	initialize: function(options) {
		this.ideaViews = [];
	},

	add_new: function(obj){
		var newIdeaView = new IdeaView({ data: obj });
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


// fireBIdeas.on('child_added', function(snapshot) {
// 	var fireBaseObj = snapshot.val();

// 	if(typeof fireBaseObj === "object"){
// 		updatePageInfo(fireBaseObj);
// 	}
// });

var updatePageInfo = function(obj){
	ideasView.add_new(obj);
};


//_______________________Event Listeners______________________//

$(document).on('click', ".login", function(e) {
	auth.login('github');
});

$(document).on('click', ".logOut", function(e) {
	auth.logout();
});

$(document).on("click", ".showDesc", function(e){
	e.preventDefault();
	$(this).parent().parent().prev().toggleClass("fullDesc");
});

//_________________________Sharing_____________________________//

!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');

