//TODO: refactor show functions
export default class MoviesController {
    constructor($scope, $http, $document, Upload, $firebaseArray, $firebaseObject, $mdDialog, toast, firebaseAuth) {
        this.$scope = $scope;
        this.$http = $http;
        this.$document = $document;
        this.Upload = Upload;
        this.toast = toast;
        this.$mdDialog = $mdDialog;
        this.$firebaseArray = $firebaseArray;
        this.$firebaseObject = $firebaseObject;
        this.firebaseMovies = this.$firebaseArray(new Firebase('vrtnieuwshub.firebaseio.com/apps/movies/movies'));
        this.firebaseMovieClips = this.$firebaseArray(new Firebase('vrtnieuwshub.firebaseio.com/apps/movies/movieclips'));

        this.movie = {};
        this.movieClips = [];
        this.currentClip = {};
        this.emailValid = false;
        this.progressPercentage = 0;
        this.tabIndex = 0;
        this.templatePath = '';

        this.number = 0;
        this.movieId = Date.now();
        // TODO: add dynamic bumper & logo
        this.movie.bumper = 11;
        this.movie.logo = 11;

        this.firebaseAuth = firebaseAuth;
        this.firebaseAuth.$onAuth((authData) => {
            if (authData) {
                this.movie.email = authData.password.email;
            }
        });

        this.movieTypes = [
            {
                'name': 'tekst',
                'templateName': 'template_02_tekst',
                'templateLocalPath': '/components/movies/movie.tekst.html',
                'templaterPath': 'C:\\Users\\chiafis\\Dropbox (Vrt Startup)\\Vrt Startup Team Folder\\NieuwsHub\\Lab\\Isacco_Material\\02_Video\\Video Templating 2.0\\AE\\image_test_02.aep',
                'thumb': '/assets/movies-title.png'
            }
            //{
            //    'name': 'text-left',
            //    'templateName': 'template_02_text_left',
            //    'templateLocalPath': '/components/movies/movie.textleft.html',
            //    'templaterPath': 'C:\\Users\\chiafis\\Dropbox (Vrt Startup)\\Vrt Startup Team Folder\\NieuwsHub\\Lab\\Isacco_Material\\02_Video\\Video Templating 2.0\\AE\\template_02_text_left.aep',
            //    'thumb': '/assets/movies-title.png'
            //},
            //{
            //    'name': 'text-right',
            //    'templateName': 'template_02_text_right',
            //    'templateLocalPath': '/components/movies/movie.textright.html',
            //    'templaterPath': 'C:\\Users\\chiafis\\Dropbox (Vrt Startup)\\Vrt Startup Team Folder\\NieuwsHub\\Lab\\Isacco_Material\\02_Video\\Video Templating 2.0\\AE\\template_02_text_right.aep',
            //    'thumb': '/assets/movies-title.png'
            //},
            //{
            //    'name': 'quote',
            //    'templateName': 'template_02_quote',
            //    'templateLocalPath': '/components/movies/movie.quote.html',
            //    'templaterPath': 'C:\\Users\\chiafis\\Dropbox (Vrt Startup)\\Vrt Startup Team Folder\\NieuwsHub\\Lab\\Isacco_Material\\02_Video\\Video Templating 2.0\\AE\\template_02_quote.aep',
            //    'thumb': '/assets/movies-title.png'
            //},
            //{
            //    'name': 'number',
            //    'templateName': 'template_02_number',
            //    'templateLocalPath': '/components/movies/movie.number.html',
            //    'templaterPath': 'C:\\Users\\chiafis\\Dropbox (Vrt Startup)\\Vrt Startup Team Folder\\NieuwsHub\\Lab\\Isacco_Material\\02_Video\\Video Templating 2.0\\AE\\template_02_number.aep',
            //    'thumb': '/assets/movies-title.png'
            //},
            //{
            //    'name': 'bullet-list',
            //    'templateName': 'template_02_bullet_list',
            //    'templateLocalPath': '/components/movies/movie.bulletlist.html',
            //    'templaterPath': 'C:\\Users\\chiafis\\Dropbox (Vrt Startup)\\Vrt Startup Team Folder\\NieuwsHub\\Lab\\Isacco_Material\\02_Video\\Video Templating 2.0\\AE\\template_02_bullet_list.aep',
            //    'thumb': '/assets/movies-title.png'
            //}
        ];

        this.showDialog();
    }

    changeLayout(type) {
        var property = type.name.replace('-', '');

        if (this.currentClip[property]) {
            delete this.currentClip[property];
        }

        this.templatePath = type;
    }

    showDialog() {
        this.$mdDialog.show({
            templateUrl: '/components/movies/movie.tabs.html',
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            escapeToClose: false,
            scope: this.$scope,
            preserveScope: true
        });
    }

    resetDialog() {
        this.$mdDialog.hide();
        //reset tabindex to upload form, if reset is called we assume e-mail is valid so skip index 0.
        this.tabIndex = 1;
    }

    initMovie() {
        this.emailValid = true;

        //#todo save email adres to firebase, use movieID returned by firebase to identify movie
        //this.firebaseMovies.$add({ 'email': this.movie.email })
        //    .then((ref) => {
        //        this.movie = this.$firebaseObject(ref);
        //        this.initNewClip(ref.key());
        //    });

        this.tabIndex++;
    }

    initNewClip() {
        this.progressPercentage = 0;
        this.number = this.number + 1;

        this.currentClip = {
            'id': this.number,
            'movieId': this.movieId,
            'bot': 'render',
            'render-status': 'ready',
            'uploaded': false,
            'saved': false,
        };
    }

    selectFile() {
        angular.element(this.$document[0].querySelector('#clipFile'))[0].click();
    }

    uploadFile(file) {
        //this.Upload.mediaDuration(file)
        //    .then((durationInSeconds) => {
        //        this.currentClip.start = this.movieClips[this.movieClips.length - 1] ? this.movieClips[this.movieClips.length - 1].end || 0 : 0;
        //        this.currentClip.end = this.currentClip.start + durationInSeconds;
        //    });

        this.Upload.upload({
            url: 'api/movie/upload-to-dropbox',
            data: {'movieId': this.movie.$id, 'clipId': this.currentClip.id, file: file},
            method: 'POST'
        })
        .then((resp) => {
            console.log("RESPONSE", resp.data);
            this.currentClip.img01 = resp.data.filenameIn;
            this.currentClip.uploaded = true;
            this.tabIndex++;
            console.log('image uploaded', this.currentClip);
        }, (resp) => {
            console.log('Error: ' + resp.error);
            console.log('Error status: ' + resp.status);
        }, (evt) => {
            this.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        });
    }

    addClip() {
        if (!this.currentClip.saved) {
            this.saveClip();
        }

        this.showDialog();
        this.initNewClip(this.movie.$id);
    }

    saveClip() {
        if (this.currentClip.saved) {
            return;
        }

        if (this.movieClips.length) {
            this.movieClips[this.movieClips.length - 1].img02 = this.currentClip.img01;
            console.log('setting img02 of previous clip', this.movieClips);
        }

        //this.currentClip.output = this.movie.$id + '/' + this.currentClip.id
        //this.currentClip.aep = this.templatePath.templaterPath;
        this.currentClip.output = this.movieId + '/' + this.number;
        this.currentClip.last = false;
        this.currentClip.type = this.templatePath.name;
        this.currentClip.saved = true;

        console.log('saving', this.currentClip);

        this.movieClips.push(this.currentClip);
    }

    deleteClip(clip) {
        this.movieClips = reject(this.movieClips, (movieClip) => {
            return movieClip.id === clip.id;
        });
    }

    generateClipId() {
        return Math.random().toString(16).slice(2);
    }

    renderMovie() {
        //console.log('Clip', clip);
        var counter = 1;
        angular.forEach(this.movieClips, (clip) => {
            if (counter >= this.movieClips.length) {
                clip.last = true;
                clip.email = this.movie.email;
                clip.bumper = this.movie.bumper;
                clip.logo = this.movie.logo;
            }
            //this.firebaseMovieClips.$add(clip);
            counter++;
        });

        console.log('All the clips', this.movieClips);

        this.movie.$save()
            .then(() => {
                console.log('saved');
            });

        var params = {
            movieClips: this.movieClips
        };

        this.$http.post('api/movie/update-movie-json', params)
            .then((response) => {
                this.toast.showToast('success', 'Uw video wordt zodra verwerkt, het resultaat wordt naar u doorgemailed.');
            });
    }
}

MoviesController.$inject = ['$scope', '$http', '$document', 'Upload', '$firebaseArray', '$firebaseObject', '$mdDialog', 'toast', 'firebaseAuth'];
