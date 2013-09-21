var myDataRef = new Firebase("https://idea-hub.firebaseio.com/");

$(document).on("click", ".ideaSubmit", function(e){
	e.preventDefault();

	var ideaTitle = $(".ideaTitle").val();
	var ideaDesc = $(".ideaDesc").val();

	myDataRef.push({
		ideaTitle: ideaTitle, 
		ideaDesc: ideaDesc
	});
});


myDataRef.on('child_added', function(snapshot) {
	var message = snapshot.val();
	displayServerData(message.ideaTitle, message.ideaDesc);
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
    console.log('User ID: ' + user.id + ', Provider: ' + user.provider);
  } else {
    // user is logged out
  }
});

$(document).on('click', ".login", function(e) {

	e.preventDefault();

	auth.login('github');
});


