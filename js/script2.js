
var myFireBase = new Firebase("https://idea-hub.firebaseio.com/")
	, fireBUsers = myFireBase.child("users")
	, fireBIdeas = myFireBase.child("ideas")
	, fireBIdeaCounter = myFireBase.child('ideaCounter')
	, fireBUser
	, ideaCounter
	, onIndex = onIndex || false
	, auth
	, ideaTemplateHtml
	, ideaTemplate
;

var authenticate = function(){
	fireBIdeaCounter.once("value", function(snapshot){
		ideaCounter = snapshot.val()
	});

	auth = new FirebaseSimpleLogin(myFireBase, function(error, user) {
		var urlArray = window.location.pathname.split( '/' );

		if (error) {
		// an error occurred while attempting login
			console.log(error);
		} else if (user) {
		// user authenticated with Firebase
			if(urlArray.indexOf("index.html") > -1 || onIndex){
				window.location.assign("user.html");
			}

			fireBUsers.once("value", function(snapshot){
				var usersDataB = snapshot.val();

				if(usersDataB[auth.user.id] === undefined){
					var authorArray = [-1];
					var voteList = [-1];
					var iList = [-1];

					fireBUsers.child(auth.user.id).set({
						userOb: auth.user,
						authorList: authorArray,
						voteList: voteList,
						iList: iList
					});
				}
			});


			this.user = user
			$(".hello").text("Welcome, " + user.username)
		} else {
			if(urlArray.indexOf("index.html" ) === -1){
				window.location.assign("index.html");
			}
		}
	});
}

var initFireBase = function(){
	authenticate();

	ideaTemplateHtml = $('.ideaTemplate').html()
	ideaTemplate = _.template(ideaTemplateHtml)
//______________________________Unload DataBase_______________________//
	
	fireBIdeas.on('child_added', function(snapshot) {
		var fireBaseObj = snapshot.val();

		if(typeof fireBaseObj === "object"){
			updatePageInfo(fireBaseObj);
		}
	});
};

var updatePageInfo = function(obj){
	ideasView.add_new(obj);
};

//____________________________BackBone___________________________________//

var IndiView = Backbone.View.extend({

	initialize: function(options) {
		this.data = options.data;
		this.data.voteText = "+";
		this.data.interestText = "I'm interested";
	},

	render: function() {
		if(auth.user && this.data.votes.indexOf(auth.user.id) > -1){
			this.data.voteText = "voted";
		}
		
		if(auth.user && this.data.interest.indexOf(auth.user) > 0){
			this.data.interestText = "All in!";
		}


		var ideaHtml = ideaTemplate({
			author: this.data.author,
			avatar: this.data.avatar,
			ideaTitle: this.data.ideaTitle,
			ideaDesc: this.data.ideaDesc,
			voteCount: this.data.voteCount.length,
			voteText: this.data.voted,
			ideaId: this.data.ideaId,
			interestList: this.data.interest,
			interestText: this.data.interested
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
		if(this.data.voteText === "+"){ //Triggers single votes!
			this.data.voteText = "voted!";
			this.data.voteCount ++;
			var self = this.data;
			fireBIdeas.child(self.ideaId.toString()).once("value", function(snapshot){
				var ideaOb = snapshot.val();
				var priority = snapshot.getPriority();
				
				ideaOb.voteCount.push(auth.user.id);
				priority --;

				fireBIdeas.child(self.ideaId.toString()).set(ideaOb);
				fireBIdeas.child(self.ideaId.toString()).setPriority(priority);
			});
		ideasView.render();
		}
	},

	updateInterest: function(e) {
		e.preventDefault();
		console.log("is this getting called?")
		if(this.data.interested === "I'm interested"){
			this.data.interested = "All in!";

			var self = this.data;
			fireBIdeas.child(self.ideaId.toString()).once("value", function(snapshot) {
				var ideaOb = snapshot.val();

				ideaOb.interest.push(auth.user);

				fireBIdeas.child(self.ideaId.toString()).set(ideaOb);
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
			var newHtml = this.collection[i].render().el;
			$(this.el).append(newHtml);
		}
	}
});

var ideasView = new MainView({
	el: $('#ideaFeed')
});

//_______________________Event Listeners______________________//

$(document).on('click', ".login", function(e) {
	auth.login('github');
});

$(document).on('click', ".logOut", function(e) {
	auth.logout();
});

$(document).on("click", ".showMoreDesc", function(e){
	e.preventDefault();
	if($(this).text() === "Show More"){
	 	$(this).text("Show Less")
	}else {
		$(this).text("Show More")
	}
	$(this).closest(".columns").find(".ideaDesc").toggleClass("fullDesc");
});

//_______________________Form Functionality____________________///


$(document).on("click", ".ideaSubmit", function(e){
	e.preventDefault();
	var ideaTitle = $(".ideaTitle").val();
	var ideaDesc = tinymce.get("ideaDesc").getContent();
	// interestList keeps track of who is interested in this idea. 
    // May be an empty array since firebase will simply delete it.
    // interestList lives in the value of fireBIdeas.child(ideaID)
	var interestList = [-1];

	fireBIdeas.child(ideaCounter.toString()).setWithPriority({
		author: auth.user.username,
		avatar: auth.user.avatar_url,
		ideaTitle: ideaTitle, 
		ideaDesc: ideaDesc,
		authorId: auth.user.id,
		voteCount: 1,
		ideaId: ideaCounter,
		interestList: interestList
	},99999);
	
	// Must first dump out the data, push the new author and then send back the data to firebase.
	// If we use firebase's push command it will convert the array as an object
	// rather than keeping it as an array.
	fireBUsers.child(auth.user.id).child("authorList").once("value", function(dataObj){
		var tempAuthList = dataObj.val();

		tempAuthList.push(ideaCounter);

 		fireBUsers.child(auth.user.id).child("authorList").set(tempAuthList);
	});

	ideaCounter++;
	fireBIdeaCounter.set(ideaCounter);
});

$(document).on("click", ".logOut", function(e){
	e.preventDefault();
	auth.logout();
});

tinymce.init({
	selector: "textarea",
	plugins: [""],
	menubar: false,
	statusbar: false,
	toolbar: "bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent" 
});

//_________________________Sharing_____________________________//

!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');


//initFireBase(); //comment out when testing.


