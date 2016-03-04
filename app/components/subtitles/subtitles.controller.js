export default class SubtitlesController {
    constructor($log, srt, FileSaver, $sce, $scope, videogular, $mdDialog) {
        this.$log = $log;
        this.$sce = $sce;
        this.srt = srt;
        this.$scope = $scope;
        this.FileSaver = FileSaver;
        this.srtObj = {};
        this.videogular = videogular;
        this.dialog = $mdDialog;
        this.subtitle = {
            video: 'http://static.videogular.com/assets/videos/videogular.mp4'
        };
        this.currentTime = '';
        const that = this;

        this.slider = {
            options: {
                id: 'main',
                floor: 0,
                ceil: this.videogular.api.totalTime / 1000,
                step: 0.001,
                precision: 10,
                draggableRange: true,
                noSwitching: true,
                onChange: this.changeSlider,
            }

        };

        $scope.$on('sliderChanged', function(message, sliderId, modelValue, highValue) {
            that.changeSlider(sliderId, modelValue, highValue);
            that.form.start = modelValue;
            that.form.end = highValue;
        });
    }


    deleteLine(ev, line) {

            delete this.srtObj[0];

        // var confirm = this.dialog.confirm()
        //     .title('Would you like to delete your debt?')
        //     .textContent('All of the banks have agreed to forgive you your debts.')
        //     .ariaLabel('Lucky day')
        //     .targetEvent(ev)
        //     .ok('Please do it!')
        //     .cancel('Sounds like a scam');
        // this.dialog.show(confirm).then(function() {
        //     delete this.srtObj[0];
        // }, function() {
        //     $scope.status = 'You decided to keep your debt.';
        // });





    }



    srcChanged() {
        console.log('srcChanged', this);

        this.currentTime = this.videogular.api.currentTime / 1000.0;
        this.form = {
            start: 0,
            end: this.videogular.api.totalTime / 1000,
            text: 'test text'
        };

        this.slider = {
            options: {
                id: 'main',
                floor: 0,
                ceil: this.videogular.api.totalTime / 1000,
                step: 0.001,
                precision: 10,
                draggableRange: true,
                noSwitching: true,
                onChange: this.changeSlider.bind(this),
            },
        };
    }


    createSRT(srtObj) {
        return this.srt.stringify(srtObj);
    }


    downloadSRTFile(srtObj) {
        var srtString = this.createSRT(srtObj);
        var data = new Blob([srtString], {
            type: 'srt'
        });

        this.FileSaver.saveAs(data, 'sub.srt');
    }

    addLine(obj) {
        // this.totalTime = this.videogular.api.currentTime / 1000.0;
        var id = Object.keys(this.srtObj).length++;
        this.srtObj[id] = { id: id, start: obj.start, end: obj.end, text: obj.text };
    }

    changeSlider(id, start, end) {

        this.videogular.api.seekTime(start);
    }


    setIn() {
        this.form.start = this.videogular.api.currentTime / 1000.0;
    }


    setOut() {
        this.form.end = this.videogular.api.currentTime / 1000.0;
    }





    // hotkeys.add({
    //     combo: 'ctrl+i',
    //     description: 'getInTime',
    //     callback: function() {
    //         setIn();
    //     }
    // });

    // hotkeys.add({
    //     combo: 'ctrl+o',
    //     description: 'getOutTime',
    //     callback: function() {
    //         setOut();
    //     }
    // });




}

SubtitlesController.$inject = ['$log', 'srt', 'FileSaver', '$sce', '$scope', 'videogular', '$mdDialog'];
