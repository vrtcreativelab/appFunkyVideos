import template from './videoPlayer.directive.html';

class VideoPlayerDirectiveController {


    constructor($scope, $log, $element, $sce, videogular) {
        this.$log = $log;
        this.$sce = $sce;
        this.$element = $element;
        this.$scope = $scope;
        this.videogular = videogular;

        $scope.$watch('vm.source', (value) => {
            if (value) {
                const that = this;
                var theSource = $sce.trustAsResourceUrl(value);
                this.config = {
                    sources: [{ src: theSource, type: 'video/mp4' }],
                    cuePoints: {
                        timePoint: [{
                            timeLapse: {
                                start: 0,
                                end: 100000
                            },
                            onComplete: function onComplete(currentTime, timeLapse, params) {

                                that.videogular.api.seekTime(timeLapse.start);
                            },
                            onUpdate: function onUpdate(currentTime, timeLapse, params) {
                            }
                        }]
                    },
                };
            } else {

            }
        }, true);

        $scope.$watch('vm.start', (value) => {
            if (value) {
                this.config.cuePoints.timePoint[0].timeLapse.start = value;

            } else {}
        }, true);

        $scope.$watch('vm.end', (value) => {
            if (value) {

                this.config.cuePoints.timePoint[0].timeLapse.end = value;
                this.config.cuePoints.timePoint[0].onComplete = function onComplete(currentTime, timeLapse, params) {
                    console.log('end of loop');
                    that.videogular.api.seekTime(timeLapse.start);
                };

            } else {}
        }, true);
    }

    onPlayerReady(API) {
        this.videogular.onPlayerReady(API);
    }

}

export const videoPlayerDirective = function() {
    return {
        restrict: 'AE',
        template: template,
        scope: {},
        controller: VideoPlayerDirectiveController,
        controllerAs: 'vm',
        bindToController: {
            source: '=',
            start: '=',
            end: '='
        },
    };
};

VideoPlayerDirectiveController.$inject = ['$scope', '$log', '$element', '$sce', 'videogular'];
