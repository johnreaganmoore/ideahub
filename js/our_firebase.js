var myDataRef = new Firebase("https://idea-hub.firebaseio.com/");

//________________________Add an Idea_______________________

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

//__________________________Vote on Idea______________________________


// $(document).on('click', '.voteUp', function(e) {
// 	e.preventDefault();
// };

// myDataRef.on('child_changed', function(snapshot) {
//   var userName = snapshot.name(), userData = snapshot.val();
//   alert('User ' + userName + ' now has a name of ' + userData.name.first + ' ' + userData.name.last);
// });



// _________________________Auth Code________________________________________

var auth = new FirebaseSimpleLogin(myDataRef, function(error, user) {

  if (error) {
    // an error occurred while attempting login
    console.log(error);
  } else if (user) {
    // user authenticated with Firebase

    this.user = user

    console.log('User ID: ' + user.id + ', Provider: ' + user.provider);
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
