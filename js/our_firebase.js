var myDataRef = new Firebase("https://idea-hub.firebaseio.com/");
var dataB = [];

myDataRef.on('child_added', function(snapshot) {
	ideaLoad = snapshot.val();
	dataB.push(ideaLoad);
	displayServerData(ideaLoad.ideaTitle, ideaLoad.ideaDesc);
});

var displayServerData = function(title, desc){
	console.log("Title: " + title, "Desc: " + desc);
};

// _________________________Auth Code________________________________________

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

if (auth.user) {
	console.log('loggedin');
};


$(document).on('click', ".login", function(e) {

	e.preventDefault();

	auth.login('github');
});

$(document).on("click", ".ideaSubmit", function(e){
	e.preventDefault();
	
	var ideaTitle = $(".ideaTitle").val();
	var ideaDesc = $(".ideaDesc").val();

	myDataRef.push({
		ideaTitle: ideaTitle, 
		ideaDesc: ideaDesc,
		userId: auth.user.id,
		userName: auth.user.username,
		avatar: auth.user.avatar_url
	});

	window.location.href = "index.html";
});
