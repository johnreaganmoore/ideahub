
var myFireBase = new Firebase("https://idea-hub.firebaseio.com/")
	, fireBUsers = myFireBase.child("users")
	, fireBIdeas = myFireBase.child("ideas")
	, fireBUser
	, currentUser
	, auth
	, ideaTemplateHtml
	, ideaTemplate
	, urlArray = window.location.pathname.split( '/' )
	, pageLocation = urlArray[urlArray.length - 1]
;

var authenticate = function(){
	auth = new FirebaseSimpleLogin(myFireBase, function(error, user) {
		if (error) {
		// an error occurred while attempting login
			console.log(error);
		} else if (user) {
			// user authenticated with Firebase
			this.user = user

			// once logged-in transfer user to user.html.
			if(pageLocation === "index.html" && pageLocation){
				window.location.assign("user.html");
			}

			// if user is new to page, record her info.
			recordNewUser();

			// set currentUser to firebase obj for easier access.
			fireBUsers.child(auth.user.id).once("value", function(snapshot){
				currentUser = snapshot.val();
			});

			$(".hello").text("Welcome, " + user.username)
		} else {
			// Redirects users who have not logged in.
			if(pageLocation !== "index.html"){
				window.location.assign("index.html");
			}
		}
	});
}


//______________________________Unload DataBase_______________________//

var initIdeas = function(){
	ideasView = new ideaBackBone.MainView({
		el: $('#ideaFeed')
	});

	fireBIdeas.on('child_added', function(snapshot) {
		var fireBaseObj = snapshot.val();

		if(typeof fireBaseObj === "object"){
			ideasView.add_new(fireBaseObj);
		}
	});
};

//____________________________BackBone___________________________________//
var ideaBackBone = {
	IndiView: Backbone.View.extend({

		initialize: function(options) {
			this.data = options.data;
			this.data.voteText = "+";
			this.data.interestText = "I'm interested";
		},

		render: function() {
			var self = this;

			var assignTemplate = function(){
				var ideaHtml = ideasView.template({
					author: self.data.author,
					avatar: self.data.avatar,
					ideaTitle: self.data.ideaTitle,
					ideaDesc: self.data.ideaDesc,
					voteCount: self.data.voteCount.length, //we minus one since firebase cannot accept empty arrays
					voteText: self.data.voteText,
					ideaId: self.data.ideaId,
					interestList: self.data.interest,
					interestText: self.data.interestText,
					numWanted: self.data.numWanted,
					desiredSkills: self.data.desiredSkills
				});
				$(self.el).html(ideaHtml);
			};

			if(auth.user){
				fireBUsers.child(auth.user.id).once("value", function(snapshot){
					currentUser = snapshot.val();
					if(currentUser.voteList.indexOf(self.data.ideaId) > -1){
						self.data.voteText = "voted";
					}
					if(auth.user && self.data.interestList.indexOf(auth.user.id) > -1){
						self.data.interestText = "All in!";
					}
					assignTemplate();
				});
			} else {
				assignTemplate();
			}
			
			return self;
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
	}),



	MainView: Backbone.View.extend({

		initialize: function(options) {
			this.collection = [];
			this.templateHtml = $('.ideaTemplate').html();
			this.template = _.template(this.templateHtml);
		},

		add_new: function(obj){
			var newView = new ideaBackBone.IndiView({ data: obj });
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
	})
}

//_______________________Event Listeners______________________//

$(document).on('click', ".login", function(e) {
	auth.login('github');
});

$(document).on('click', ".logOut", function(e) {
	e.preventDefault();
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

//_______________________Form Initialize____________________///

var formInit = function(){
	$(document).on("click", ".ideaSubmit", function(e){
		e.preventDefault();
		addNewIdea();
	});

	tinymce.init({
		selector: "textarea",
		plugins: [""],
		menubar: false,
		statusbar: false,
		toolbar: "bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent" 
	});
};

//______________________Idea Page Initialize__________________//

var ideaInit = function(){
	var currentIdeaId = getURLParameter("ideaId");

	fireBIdeas.child(currentIdeaId).once("value", function(snapshot){
		var ideaObj = snapshot.val()
			, ideaHtml = $(".singleIdeaTemplate").html()
			, ideaTemplate = _.template(ideaHtml)
			, newHtml = ideaTemplate(ideaObj)
		;
		$(".singleIdeaFeed").html(newHtml);
		console.log(ideaObj);
	});
};

//_________________________Twitter____________________________//

!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');

//________________________Helpers________________________________//

var addNewIdea = function(){
	if(formValid()){
		var ideaTitle = $(".ideaTitle").val()
			, ideaDesc = tinymce.get("ideaDesc").getContent()
			, ideaCounter
			, numWanted = parseInt($(".numWanted").val())
			, desiredSkills = $(".desiredSkills").val()
		;

		myFireBase.child("ideaCounter").once("value", function(snapshot){
			// must wait for fireBase's response before moving forward.
			ideaCounter = snapshot.val()

			// interestList and voteList keeps track of who is interested/voted in this idea. 
		    // It may not be an empty array since firebase will not accept it.
		    // interestList and voteList lives in the value of fireBIdeas.child(ideaID)
			fireBIdeas.child(ideaCounter.toString()).setWithPriority({
				author: auth.user.username,
				avatar: auth.user.avatar_url,
				ideaTitle: ideaTitle, 
				ideaDesc: ideaDesc,
				authorId: auth.user.id,
				voteCount: [ideaCounter],
				ideaId: ideaCounter,
				interestList: [auth.user.id],
				numWanted: numWanted,
				desiredSkills: desiredSkills
			},99999);

			// Must first dump out the data, push the new author and then send back the data to firebase.
			// If we use firebase's push command it will convert the array as an object
			// rather than keeping it as an array.
			fireBUsers.child(auth.user.id).once("value", function(snapshot){
				var tempUser = snapshot.val();
				tempUser.authorList.push(ideaCounter);
				tempUser.voteList.push(ideaCounter);
				tempUser.iList.push(ideaCounter);

				fireBUsers.child(auth.user.id).set(tempUser);
				ideaCounter++;
				myFireBase.child("ideaCounter").set(ideaCounter);
				window.location.assign("user.html");
			});
		});
	}
};

var formValid = function(){
	var valid = true;
	if($(".ideaTitle").val() === ""){
		$(".ideaTitle").addClass("error");
		valid = false;
	}
	if(isNaN(parseInt($(".numWanted").val()))){
		$(".numWanted").addClass("error");
		$(".numWanted").val("");
		valid = false;
	}
	if($(".desiredSkills").val() === ""){
		$(".desiredSkills").addClass("error");
		valid = false;
	}
	if(!(tinyMCE.activeEditor.isDirty())){
		alert("Don't forget your project description!")
		valid = false;
	}

	return valid;
}

var recordNewUser = function(){
	fireBUsers.once("value", function(snapshot){
		var usersDataB = snapshot.val();

		if(usersDataB[auth.user.id] === undefined){
			// Firebase does not accept empty arrays.
			var authorArray = [-1]
				, voteList = [-1]
				, iList = [-1]
			;

			fireBUsers.child(auth.user.id).set({
				userOb: auth.user,
				authorList: authorArray,
				voteList: voteList,
				iList: iList
			});
		}
	});
};

var getURLParameter = function(name) {
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    );
}

authenticate();

switch(pageLocation){
	case "index.html":
		initIdeas();
		break;
	case "user.html":
		initIdeas();
		break;
	case "form.html":
		formInit();
		break;
	case "idea.html":
		ideaInit();
	default:
		break;
}

