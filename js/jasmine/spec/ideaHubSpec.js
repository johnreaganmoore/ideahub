describe("Let's load some templates!", function(){
	it("it loads the external template!", function(){
		loadFixtures("myfixture.html");

		expect($("#my-fixture")).toExist();
	});
});