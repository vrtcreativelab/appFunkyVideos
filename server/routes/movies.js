var express = require('express');
var router = express.Router();
var fs = require('fs');
var ffmpeg = require('fluent-ffmpeg');
var multiparty = require('multiparty');
var lodash = require('lodash');
var Firebase = require('firebase');
var movies = new Firebase("vrtnieuwshub.firebaseio.com/apps/movies/movies");
var movieClips = new Firebase("https://vrtnieuwshub.firebaseio.com/apps/movies/movieclips")

var dropboxService = require('../services/dropboxService.js');
var dbClient = dropboxService.getDropboxClient();

var jsonFile = 'data/json/templater.json';

//url /api/movie

router.post('/movie-clip', function(req, res, next) {
    var form = new multiparty.Form();
    form.parse(req);

    var fileStream = '';
    var fileStreamOpened = false;
    var fileName = '';
    var fileExt = '';
    var folderName = '';
    var uploadPath = 'temp/movies/';
    var fullPath = '';

    form.on('part', function(part) {
        part.on('data', function(data) {
            if (!part.filename) {
                if (part.name === "movieId") folderName = data.toString();
                if (part.name === "clipId") fileName = data.toString();
            }
            else {
                if (!fileStreamOpened) {
                    fileStreamOpened = true;
                    fileExt = getExtension(part.filename);
                    fullPath = uploadPath + fileName + fileExt;

                    //check if dir exists else create it
                    //if (!fs.existsSync(uploadPath)) {
                    //    fs.mkdirSync(uploadPath);
                    //}

                    fileStream = fs.createWriteStream(fullPath, {'flags': 'a'});
                }

                fileStream.write(data);
            }
        });

        part.on('error', function(err) {
            console.log('part error', err);
            return next(Boom.badImplementation('file upload failed!'));
        });

        part.resume();
    });

    form.on('error', function(err) {
        console.log('upload error', err);
        return next(Boom.badImplementation('file upload failed!'));
    });

    form.on('close', function() {
        res.json({filePath: fullPath, fileName: fileName + fileExt}).send();
    });
});

router.post('/update-movie-json', function(req, res, next) {
    var movieClips = req.body.movieClips;

    //update local JS
    //fs.access('data/json', fs.F_OK, function(err) {
    //    if(err) {
    //        console.log('creating json directory');
    //        fs.mkdirSync('data/json');
    //    }
    //
    //    console.log('dir exists');
    //
    //    //append clips to json file on server
    //    var file = [];
    //
    //    fs.access(jsonFile, fs.F_OK, function(err) {
    //        if (!err) {
    //            //if file exists, append contents to file
    //            file = fs.readFileSync(jsonFile, 'utf8');
    //
    //            if (file.length > 0) {
    //                file = JSON.parse(file);
    //            }
    //            else {
    //                file = [];
    //            }
    //        }
    //
    //        movieClips.forEach(function(clip) {
    //            file.push(clip);
    //        });
    //
    //        fs.writeFile(jsonFile, JSON.stringify(file), (err) => {
    //            if(err) {
    //                console.log('failed to write file');
    //            }
    //
    //            fs.chmod(jsonFile, 511);
    //
    //            console.log('updated templater.json');
    //            res.send();
    //        });
    //    });
    //});

    //update dropbox json
    var file = {
        path: '/json/',
        name: 'templater.json',
        data: ''
    };

    //update JSON file on dropbox so AE templater get's triggered
    dbClient.readFile(file.path + file.name, function(error, data) {
        if (error) {
            return next(Boom.badImplementation('unexpected error, couldn\'t read file from dropbox'));
        }

        file.data = data ? JSON.parse(data) : [];

        movieClips.forEach(function(clip) {
            file.data.push(clip);
        });

        dbClient.writeFile(file.path + file.name, JSON.stringify(file.data), function(error, stat) {
            if (error) {
                return next(Boom.badImplementation('unexpected error, couldn\'t upload file to dropbox'));
            }

            res.send();
        });
    });
});

//router.post('/delete-movie-json', function(req, res, next) {
//    var clipId = req.body.clipId || 0;
//
//    file = fs.readFileSync(jsonFile, 'utf8');
//
//    if (file.length > 0) {
//
//        file = JSON.parse(file);
//
//        file = lodash.reject(file, function (clip) {
//            return clip.id === clipId;
//        });
//
//        fs.writeFile(jsonFile, JSON.stringify(file), (err) => {
//            if (err) {
//                console.log('failed to write file');
//            }
//
//            fs.chmod(jsonFile, 511);
//
//            console.log('deleted following id from templater', clipId);
//            res.send();
//        });
//    }
//    //check if last clip in movie, if so, start render
//});

router.post('/clean-movie-json', function(req, res, next) {
    var path = '/json/templater.json';
    dbClient.writeFile(path, '[]', function(error, stat) {
        if (error) {
            return next(Boom.badImplementation('unexpected error, couldn\'t upload file to dropbox'));
        }
        console.log('succesfully cleared json file');
        res.send();
    });
});

router.post('/render-movie', function(req, res, next) {
    var movieId = req.body.movieId || 0;

    console.log('rendering movie with id:', movieId);

    var ref = new Firebase('vrtnieuwshub.firebaseio.com/apps/movies').child("movieclips");
    ref.orderByChild('movieId').equalTo(movieId).on("value", function(snapshot) {
        console.log(snapshot.val());

        //get out paths from snapshot.val(), save them in array, open these files from DB and stitch them together

        res.json({data: 'rendering movie!'}).send();
    });
});

function getExtension(filename) {
    var parts = filename.split('.');
    return '.' + parts[parts.length - 1];
}

module.exports = router;
