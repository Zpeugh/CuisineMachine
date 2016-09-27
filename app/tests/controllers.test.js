describe('CuisineMachineController', function() {    
    beforeEach(module('cuisineMachineApp'));
    
    var mockRecipeData = [
        {"id":"2C2LTJGN","title":["Smoky Chicken Chili"],"picture":["http://foodista.com/sites/default/files/styles/featured/public/pot-EL-with-spoon-CU.jpg"],"ingredients":["---For the smoked chicken:---; 3 tablespoons liquid smoke; 1 whole raw chicken, organs discarded, rinsed and patted dry; 2 teaspoons smoked salt, plus more to season the chicken"],"instructions":["1; ---For the smoked chicken:---; 2; Preheat the oven to 350 degrees. Use a roasting pan that has a rack and a lid. Mix chicken stock, liquid smoke and 2 teaspoons smoked salt in the bottom of the pan."],"about":["Smoky Chicken Chili.  No smoker required!!   Pulled chicken chili w beans, tomatoes, peppers, garlic, onions & stock.  Perfect winter soup!"],"yield":["10 Servings"],"tags":["easy chili chicken recipe; white chicken chili crock pot; chicken chili crock pot"],"_version_":1546031566367490000, "score":50, "featureVector":"0.6788646 0.0 0.0 0.0 2.2407045 0.0 0.0 0.0 0.0 0.0 0.0 0.0 1.1084787 0.0 0.0 0.0 0.66005886 0.0 0.0 0.0 0.19181734 0.0 0.0 0.0 1.3556161 0.0 0.0 0.0 1.0 0 0.6931471805599453 50.0", "ranker.confidence":0.09972292257873752},
        {"id":"Y4HNTZ6S","title":["Spicy Chili w Boneless Beef Short Ribs"], "picture":["http://foodista.com/sites/default/files/styles/featured/public/beef%20chili%209.jpg"],"ingredients":["•4 lb boneless beef short ribs, cut into 1-inch pieces; •1.5 lb ground chuck; •2 packets spicy chili powder"],"instructions":["1; 1.Brown both meats in a Dutch oven or large pot over medium-high heat. Add 2 cups of water and bring to a boil. Discard fatty oil either by draining or with a strainer. Add about 4 cups of new water and bring to a boil for 10 minutes.; 2; 2.Add remaining ingredients; keep at a boil for another 10 minutes. Reduce heat to low, and simmer, slightly uncovered, stirring occasionally, 45 minutes or until beef is tender."],"about":["We've tried so many different chili recipes and versions but have yet to do one with chunks of steak meat."],"yield":["6~8"],"tags":["Spicy Chili w Boneless Beef Short Ribs; chili; Korean; Soup; beef"],"_version_":1546031597210304500,"score":49,"featureVector":"1.462855 0.0 0.0 0.0 2.0577893 0.0 0.0 0.0 0.0 0.0 0.0 0.0 1.5549651 0.0 0.0 0.0 0.5160113 0.0 0.0 0.0 0.19026606 0.0 0.0 0.0 0.5032951 0.0 0.0 0.0 1.0 1 0.4054651081081644 49.0","ranker.confidence":0.0883794742483266},
        {"id":"B3R7M7SZ","title":["Crock Pot Chili with Beans"],"picture":["http://foodista.com/sites/default/files/styles/featured/public/Crock%20Pot%20Chili_0.jpg"],"ingredients":["1 pound pinto beans, soaked overnight in water, drained and rinsed; 2 pounds chili meat – or you can use stew meat in a pinch.; 2 cups beef broth"],"instructions":["1; Soak Pinto beans overnight in water, drain and rinse the next morning.; 2; Next add diced onions and tomatoes."],"about":["This hearty chili has a mild flavor, perfect for families with kids. It's easy to customize and add your favorite toppings."],"yield":["12 or more servings"],"tags":["chili; chili with beans; chili recipe; Crock Pot chili; slow cooker chili"],"_version_":1546031026622431200,"score":48,"featureVector":"1.462855 0.0 0.0 0.0 2.1082203 0.0 0.0 0.0 0.0 0.0 0.0 0.0 0.69425935 0.0 0.0 0.0 0.5065639 0.0 0.0 0.0 0.19120647 0.0 0.0 0.0 0.9735447 0.0 0.0 0.0 1.0 2 0.2876820724517809 48.0","ranker.confidence":0.06163309813661973}]
    
    // get reference to scope & http backend before each test
    var $controller;
    var $scope
    var httpBackend;
    var recipeService
    beforeEach(inject(function (_$controller_, _$httpBackend_, _RecipeService_) {
        $controller = _$controller_;
        $scope = {};
        var controller = $controller('cuisineMachineController', {$scope: $scope });    
        httpBackend = _$httpBackend_;
        recipeService = _RecipeService_;
    }));

    
    //test case for search(). Should be called and receive data
    it('search() invokes retrieve and rank with specified search text and parses data into recipes array', function() {
        //set search text and test response
        $scope.searchText = 'Chili';
        $scope.recipes = [];

        // call search function, which calls get /api/search?q=Chili
        $scope.search();
        
        // set mock response for calls to /api/search
        httpBackend.when('GET', /\/api\/search/).respond(200, mockRecipeData);
        
        // perform http request/response
        httpBackend.flush();

        // check that we have the 3 recipes
        expect($scope.recipes.length).toEqual(3);
        expect(httpBackend.verifyNoOutstandingExpectation).not.toThrow();
        expect(httpBackend.verifyNoOutstandingRequest).not.toThrow();
    });
    
    
    // test case for add recipe
    it('RecipeService.addRecipe() ensure all fields are correctly parsed from json', function() {
        var recipeToAdd = mockRecipeData[0];

        // add recipe
        recipeService.clearRecipes();
        recipeService.addRecipe(recipeToAdd);
        
        // retrieve recipes
        var recipes = recipeService.getRecipes();
        var recipe = recipes[0];
        
        // test recipe data
        expect(recipe.id).toEqual("2C2LTJGN");
        expect(recipe.title).toEqual("Smoky Chicken Chili");
        expect(recipe.ingredients).toEqual(["---For the smoked chicken:---", "3 tablespoons liquid smoke", "1 whole raw chicken, organs discarded, rinsed and patted dry", "2 teaspoons smoked salt, plus more to season the chicken"]);
        expect(recipe.instructions).toEqual(["---For the smoked chicken:---", "Preheat the oven to 350 degrees. Use a roasting pan that has a rack and a lid. Mix chicken stock, liquid smoke and 2 teaspoons smoked salt in the bottom of the pan."]);
        expect(recipe.tags).toEqual(["Easy chili chicken recipe", "White chicken chili crock pot", "Chicken chili crock pot"]); 
        expect(recipe.pictureUrl).toEqual("http://foodista.com/sites/default/files/styles/featured/public/pot-EL-with-spoon-CU.jpg");
        expect(recipe.yield).toEqual("10 Servings");
        expect(recipe.about).toEqual(recipeToAdd.about[0]);
    });
    
    
    // test case for Recipe Service clear
    it('RecipeService.clearRecipes empties the recipes array ', function() {
        var recipes;
        
        recipeService.addRecipe(mockRecipeData[0]);
        recipeService.addRecipe(mockRecipeData[1]);
        recipes = recipeService.getRecipes();
        expect(recipes.length).toEqual(2);
        
        recipeService.clearRecipes();
        recipes = recipeService.getRecipes();
        expect(recipes.length).toEqual(0);
    });
    
    
    // test case for set selected recipe
    it('selectRecipe() updates the currently selected recipe ', function() {
        var recipe = mockRecipeData[0];
        
        // imitate click on recipe in discover.html
        $scope.currentRecipe = '';
        $scope.selectRecipe(recipe);
        
        // check that recipe was updated
        expect($scope.currentRecipe).toEqual(recipe);
    });
});