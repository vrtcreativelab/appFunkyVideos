import template from './subtitleText.directive.html';

class subtitleTextDirectiveController {
    constructor($scope, $log, $element) {
        this.$log = $log;
        this.$element = $element;
        this.$scope = $scope;
        const that = this;
        this.inViewIn = false;
        this.inViewOut = false;

        $scope.$watch('vm.currentTime', (value) => {
            if (value && this.in <= value/1000 && value/1000 <= this.out) {
                that.inView = true;
            } else {
                that.inView = false;
            }
        }, true);
    }
}

export const subtitleTextDirective = function() {
    return {
        restrict: 'AE',
        template: template,
        scope: {},
        controller: subtitleTextDirectiveController,
        controllerAs: 'vm',
        bindToController: {
            key: '=',
            in : '=',
            out: '=',
            text: '=',
            currentTime: '='
        },
    };
};

subtitleTextDirectiveController.$inject = ['$scope', '$log', '$element'];
