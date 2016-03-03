// USAGE: <div id="progress" vrt-test is-hidden="vm.isHidden"></div>


import template from './subtitleText.directive.html';

class subtitleTextDirectiveController {
    constructor($scope, $log, $element) {
        this.$log = $log;
        this.$element = $element;
        this.$scope = $scope;
        // this.videogular = videogular;
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


        // $scope.$watch('vm.in', (value) => {
        //     var currentTime = this.videogular.api.currentTime;

        //     if (value && value >= currentTime / 1000) {
        //         that.inViewIn = true;


        //     } else {}
        // }, true);

        // $scope.$watch('vm.out', (value) => {
        //     var currentTime = this.videogular.api.currentTime;

        //     if (value && value <= currentTime / 1000) {
        //         that.inViewOut = true;


        //     } else {}
        // }, true);


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
