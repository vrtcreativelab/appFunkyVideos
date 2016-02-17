import './pieChart.directive.scss';
import template from './pieChart.directive.html';

class pieChartDirectiveController {
    constructor($scope, $log, $parse, $window, $element, $document) {
        this.$log = $log;
        this.$parse = $parse;
        this.$window = $window;
        this.$element = $element;


        $scope.$watch('vm.isAnimated', (value) => {
            if (value) {
                console.log('pieChartDATA', this.chartData);
                this.piechart($element, this.chartData);
                //TweenMax.to($element, 1, {rotation:360, transformOrigin:"150px 150px"});

                console.log('value changed', value);
            } else {
                console.log('value changed', value);
                TweenMax.to($element, 1, {rotation:0, transformOrigin:"150px 150px"});
            }
        }, true);
    }


    segmentColour(i) {
        return {
            '1': '#36a25c',
            '2': '#345f5f',
            '3': '#666666',
        }[i];
    }

    piechart(element, data) {

        const dimensions = { width: 300, height: 300 };
        dimensions.r = Math.min(dimensions.width, dimensions.height)/2;

        let svg = d3.select(element[0])
            .append("svg")
            .attr("class", "pieChart")
            .attr("width", dimensions.width)
            .attr("height", dimensions.height)
            .append("g")
            .attr("class", "slices")
            .attr("transform", "translate(" + dimensions.width/2 + "," + dimensions.height/2+")");

        let arc = d3.svg.arc().outerRadius(dimensions.r - 10).innerRadius(80);

        let pie = d3.layout.pie().sort(d3.ascending).value(function(d) { return d.data });

        svg.selectAll("li")
           .data(pie(data))
           .enter()
           .append("path")
           .attr("d", arc)
           .style("fill", (d) => { return this.segmentColour(d.data.nb); } )
            .each( function() {
                this._current = { startAngle: 0, endAngle: 0 };
            } )
            .transition()
            .duration(2000)
            .attrTween( 'd', function( d ) {
                               var interpolate = d3.interpolate( this._current, d );
                               this._current = interpolate( 0 );

                               return function( t ) {
                                 return arc( interpolate( t ) );
                               };
                             } );

    }

}

export const pieChartDirective = function() {
    return {
        restrict: 'EA',
        template: template,
        scope: {},
        controller: pieChartDirectiveController,
        controllerAs: 'vm',
        bindToController: {
            chartData: '=',
            isAnimated: '=',
        },
    };

};

pieChartDirectiveController.$inject = ['$scope', '$log', '$parse', '$window', '$element', '$document'];