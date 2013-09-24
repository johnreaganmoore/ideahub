
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

		this.user = user;
		$(".hello").text("Welcome, " + user.username);
		
	} else {
		window.location.assign("index.html");
	}
});


//_____________________________Add trigger to submit button_________________///


$(document).on("click", ".ideaSubmit", function(e){
	var ideaTitle = $(".ideaTitle").val();
	var ideaDesc = tinymce.get("ideaDesc").getContent();
	var interestArry = [];
	interestArry.push(auth.user);

	fireBIdeas.child(ideaCounter.toString()).setWithPriority({
		ideaTitle: ideaTitle, 
		ideaDesc: ideaDesc,
		userId: auth.user.id,
		userName: auth.user.username,
		avatar: auth.user.avatar_url,
		votes: [auth.user.id],
		voted: "+",
		ideaId: ideaCounter,
		interest: interestArry,
		interested: "I'm interested"
	},99999);
	
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

