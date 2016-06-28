angular.module('app').directive('updateOnEnter', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ctrl) {
            element.bind("keyup", function(ev) {
                if (ev.keyCode == 13) {
                    ctrl.$commitViewValue();
                    scope.$apply(ctrl.$setTouched);
                }
            });
        }
    }
});
