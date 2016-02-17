export default class HomeController {
    constructor($log, $http, $scope) {
        this.$log = $log;
        this.$http = $http;
        this.isHidden = false;
        this.isAnimated = false;
        this.$scope = $scope;
        this.url = '';

        this.data = [];

        console.log('BAR', this.$scope.bar);

    }

    animatePieChart() {
        console.log('Animated:', this.isAnimated);
        this.isAnimated = !this.isAnimated;
        console.log('BAR', this.$scope.bar);

        let fValue = parseInt(this.$scope.bar.percOne);
        let sValue = parseInt(this.$scope.bar.percTwo);
        let sum = fValue + sValue;
        let difference = 0;

        if (sum < 100) {
            difference = 100 - sum;
        }

        this.data = [
            {"nb":"1", "title": this.$scope.bar.titleOne, "data": fValue},
            {"nb":"2", "title": this.$scope.bar.titleTwo, "data": sValue},
            {"nb":"3", "title": this.$scope.bar.titleTwo, "data": difference},
        ];

        console.log('DATA', this.data);
    }

    fadeIt() {
        this.isHidden = !this.isHidden;
    }

    getVideo() {
        this.$http({
            method: 'GET',
            url: '/api/images'
            }).then( (res) => {
                this.url = res.data.video_url;
                return this.url;
            }, (err) => {
                console.error('Error', err);
            });
    }

}

HomeController.$inject = ['$log', '$http', '$scope'];