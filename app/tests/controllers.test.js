describe('CuisineMachineController', function() {    
    beforeEach(module('cuisineMachineApp'));
    
    // get reference to scope & http backend before each test
    var $controller;
    var $scope
    var httpBackend;
    beforeEach(inject(function (_$controller_, _$httpBackend_) {
        $controller = _$controller_;
        $scope = {};
        var controller = $controller('cuisineMachineController', {$scope: $scope });
        httpBackend = _$httpBackend_;
    }));
    
    afterEach(function() {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });
    
    // test test case for add()
    it('add() adds two numbers ', function() {// 'i'ndividual 't'est
        //set search text and test response
        $scope.number = 0;
        $scope.add(2, 3);

        expect($scope.number).toEqual(5);
    });
    
    //test case for search(). Should be called and receive data
    it('search() invokes retrieve and rank with specified search text and parses data into recipes array', function() {
        //set search text and test response
        $scope.searchText = 'Chili';
        $scope.recipes = [];

        // call search function, which calls get /api/search?q=Chili
        $scope.search();
        
        // set mock response for calls to /api/search
        httpBackend.when('GET', /\/api\/search/)
        .respond(200, [{"id":"2C2LTJGN","title":["Smoky Chicken Chili"],"picture":["http://foodista.com/sites/default/files/styles/featured/public/pot-EL-with-spoon-CU.jpg"],"ingredients":["INGREDIENTS"],"instructions":["INSTRUCTIONS"],"about":["ABOUT"],"yield":["10 Servings"],"tags":["TAGS"],"_version_":1546031566367490000,"score":50,"featureVector":"0.6788646 0.0 0.0 0.0 2.2407045 0.0 0.0 0.0 0.0 0.0 0.0 0.0 1.1084787 0.0 0.0 0.0 0.66005886 0.0 0.0 0.0 0.19181734 0.0 0.0 0.0 1.3556161 0.0 0.0 0.0 1.0 0 0.6931471805599453 50.0","ranker.confidence":0.09972292257873752},{"id":"Y4HNTZ6S","title":["Spicy Chili w Boneless Beef Short Ribs"],"picture":["http://foodista.com/sites/default/files/styles/featured/public/beef%20chili%209.jpg"],"ingredients":["INGREDIENTS"],"instructions":["INSTRUCTIONS"],"about":["ABOUT"],"yield":["6~8"],"tags":["TAGS"],"_version_":1546031597210304500,"score":49,"featureVector":"1.462855 0.0 0.0 0.0 2.0577893 0.0 0.0 0.0 0.0 0.0 0.0 0.0 1.5549651 0.0 0.0 0.0 0.5160113 0.0 0.0 0.0 0.19026606 0.0 0.0 0.0 0.5032951 0.0 0.0 0.0 1.0 1 0.4054651081081644 49.0","ranker.confidence":0.0883794742483266},{"id":"B3R7M7SZ","title":["Crock Pot Chili with Beans"],"picture":["http://foodista.com/sites/default/files/styles/featured/public/Crock%20Pot%20Chili_0.jpg"],"ingredients":["INGREDIENTS"],"instructions":["INSTRUCTIONS"],"about":["ABOUT"],"yield":["12 or more servings"],"tags":["TAGS"],"_version_":1546031026622431200,"score":48,"featureVector":"1.462855 0.0 0.0 0.0 2.1082203 0.0 0.0 0.0 0.0 0.0 0.0 0.0 0.69425935 0.0 0.0 0.0 0.5065639 0.0 0.0 0.0 0.19120647 0.0 0.0 0.0 0.9735447 0.0 0.0 0.0 1.0 2 0.2876820724517809 48.0","ranker.confidence":0.06163309813661973}]);
        
        
        httpBackend.flush();

        // check that we have the 3 recipes
        expect($scope.recipes.length).toEqual(3);
    });
});