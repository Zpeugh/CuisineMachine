describe('CuisineMachineController', function() {
   
    beforeEach(module('cuisineMachineApp'));
    
    
    // get reference to controller
    var $controller;
    beforeEach(inject(function (_$controller_) {
        $controller = _$controller_;
    }));
    
    
    //test case for onSubmit. Should be called and receive data
    describe('$scope.add()', function() {
        it('adds two numbers ', function() {
            var $scope = {};
            var controller = $controller('cuisineMachineController', {$scope: $scope });
            $ctrlScope.number = 0;
            $ctrlScope.add(2, 3);

            expect($scope.number).toEqual(5);
        });
    });
});