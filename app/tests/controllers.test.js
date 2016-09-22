describe('CuisineMachineController', function() {    
    beforeEach(module('cuisineMachineApp'));
    
    // get reference to scope before each test
    var $controller;
    var $scope
    beforeEach(inject(function (_$controller_) {
        $controller = _$controller_;
        $scope = {};
        var controller = $controller('cuisineMachineController', {$scope: $scope });
    }));
    
    
    //test case for search(). Should be called and receive data
    describe('$scope.search() ', function() {
        it('calls retrieve and rank with specified search text ', function() {// 'i'ndividual 't'est
            //set search text and test response
            $scope.number = 0;
            $scope.add(2, 3);

            expect($scope.number).toEqual(5);
        });
    });
});