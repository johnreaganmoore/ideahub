var myFireBase = new Firebase("https://idea-hub.firebaseio.com/")
	, fireBIdeas = myFireBase.child("ideas")
	, fireBIdeaCounter = myFireBase.child('ideasCounter')
	, ideasCounter
	, onIndex = onIndex || false
	, auth
	, ideasCounter
	, ideaTemplateHtml = $('.templates .idea-template').html()
	, ideaTemplate = _.template(ideaTemplateHtml)
;

var initFireBase = function(){
	auth = new FirebaseSimpleLogin(myFireBase, function(error, user) {
		var urlArray = window.location.pathname.split( '/' );

		if (error) {
		// an error occurred while attempting login
			console.log(error);
		} else if (user) {
		// user authenticated with Firebase
			// if(urlArray.indexOf("index.html") > -1 || onIndex){
			// 	window.location.assign("user.html");
			// }

			this.user = user
			$(".hello").text("Welcome, " + user.username)
		} else {
			// if(urlArray.indexOf("index.html" ) === -1){
			// 	window.location.assign("index.html");
			// }
		}
	});

//______________________________Unload DataBase_______________________//
	
	fireBIdeas.on('child_added', function(snapshot) {
		var fireBaseObj = snapshot.val();

		if(typeof fireBaseObj === "object"){
			updatePageInfo(fireBaseObj);
		}
	});

	var updatePageInfo = function(obj){
		ideasView.add_new(obj);
	};
};

//____________________________BackBone___________________________________//

var IndiView = Backbone.View.extend({

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



var MainView = Backbone.View.extend({

	initialize: function(options) {
		this.collection = [];
	},

	add_new: function(obj){
		var newView = new IndiView({ data: obj });
		this.collection.push(newView);

		var newHtml = newView.render().el;
		$(this.el).append(newHtml);
	},

	render: function(){
		for(var i = 0; i < this.collection.length; i++){
			var newIdeaHtml = this.collection[i].render().el;
			$(this.el).append(newHtml);
		}
	}
});

var ideasView = new MainView({
	el: $('#ideas-feed')
});


