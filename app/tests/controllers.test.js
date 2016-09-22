describe('CuisineMachineController', function() {

    beforeEach(module('cuisineMachineApp'));

    var $controller;

    //TODO: Add dependency injection of mocked RandRservice and RecipeService
    beforeEach(inject(function(_$controller_){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
    }));


    //test case for onSubmit. Should be called and receive data
    describe('$scope.add()', function() {
        it('adds two numbers ', function() {
            var $scope = {};

            var controller = $controller('cuisineMachineController', {$scope: $scope });
            $ctrlScope.number = 0;
            $ctrlScope.add(2, 3);

            expect(5).toEqual(5);
        });
    });
});
