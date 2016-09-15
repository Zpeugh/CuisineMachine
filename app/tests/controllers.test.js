describe('Controller: cuisineMachineController', function() {
    
    // get reference to controller
    var ctrl;
    beforeEach(inject(function ($rootScope) {
        scope = $rootScope.$new();

        // Create Login controller
        ctrl = $controller('cuisineMachineController', {
            $scope: scope
        });
    }));
    
    
    //test case for onSubmit. Should be called and receive data
    it('onSubmit called and responseData received ', function() {
        expect(ctrl.onSubmit).toHaveBeenCalled();                   // check that function called
        expect(ctrl.responseData).toEqual(' ');    // check that data is as expected
        //expect(2+2).toEqual(4);
    });

});