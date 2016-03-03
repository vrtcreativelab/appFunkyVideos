import angular from 'angular';
import {subtitleTextDirective} from './subtitleText.directive.js';

const module = angular.module('app.common.directives.subtitleText', []);

module.directive('subtitleText', subtitleTextDirective);

export default module.name;
