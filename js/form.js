
var myDataRef = new Firebase("https://idea-hub.firebaseio.com/");
var fireBIdeas = myDataRef.child("ideas");
var fireBIdeaCounter = myDataRef.child('ideaCounter');
var ideaCounter;

fireBIdeaCounter.once("value", function(snapshot){
	ideaCounter = snapshot.val();
});


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

auth.login("github");


//_____________________________Add trigger to submit button_________________///


$(document).on("click", ".ideaSubmit", function(e){
	e.preventDefault();
	
	var ideaTitle = $(".ideaTitle").val();
	var ideaDesc = $(".ideaDesc").val();

	fireBIdeas.child(ideaCounter.toString()).set({
		ideaTitle: ideaTitle, 
		ideaDesc: ideaDesc,
		userId: auth.user.id,
		userName: auth.user.username,
		avatar: auth.user.avatar_url,
		votes: [],
		ideaId: ideaCounter
	});
	
	ideaCounter++;
	fireBIdeaCounter.set(ideaCounter);
});