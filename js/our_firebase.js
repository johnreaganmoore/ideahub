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
