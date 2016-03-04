export default class SubtitlesController {
    constructor($log, srt, FileSaver, $sce, $scope, videogular, hotkeys) {
        this.$log = $log;
        this.$sce = $sce;
        this.srt = srt;
        this.$scope = $scope;
        this.FileSaver = FileSaver;
        this.srtObj = {};
        this.videogular = videogular;
        this.hotkeys = hotkeys;
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

        hotkeys.add({
            combo: 'i',
            description: 'getInTime',
            callback: function() {
                that.setIn();
            }
        });

        hotkeys.add({
            combo: 'o',
            description: 'getOutTime',
            callback: function() {
                that.setOut();
            }
        });


        hotkeys.add({
            combo: 'p',
            description: 'addLine',
            callback: function() {
                that.addLine(that.form);
            }
        });

        hotkeys.add({
            combo: 'space',
            description: 'startVideo',
            callback: function() {
                that.startVideo();
            }
        });


    }


    deleteLine(ev, line) {
        delete this.srtObj[0];
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


    startVideo(id, start, end) {

        this.videogular.api.playPause();
    }



    setIn() {
        this.form.start = this.videogular.api.currentTime / 1000.0;
    }


    setOut() {
        this.form.end = this.videogular.api.currentTime / 1000.0;
    }









}

SubtitlesController.$inject = ['$log', 'srt', 'FileSaver', '$sce', '$scope', 'videogular', 'hotkeys'];
