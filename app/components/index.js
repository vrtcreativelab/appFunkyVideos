import angular from 'angular';
import home from './home';
import subtitles from './subtitles';
import pictures from './pictures';
import chart from './chart';
import templater from './templater';
import audio from './audio';
import grid from './grid';

const module = angular.module('app.components', [
    home, subtitles, pictures, chart, templater, audio, grid,
]);

export default module.name;
