import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MessagebusService, MessageHandler } from '@vmw/bifrost';
import { AbstractComponent } from '../abstract.component';

@Component({
    selector: 'metrics-chart',
    templateUrl: './metrics-chart.component.html',
    styleUrls: ['./metrics-chart.component.css']
})
export class MetricsChartComponent extends AbstractComponent implements OnInit, OnDestroy {

    @Input() metricsChannel: string;

    public lineChartData: Array<any>;
    public lineChartLabels: Array<any> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Nov', 'Dec'];
    public lineChartOptions: any = {
        responsive: true,
        animation: {
            duration: 200,
            easing: 'easeInOutQuad'
        }

    };
    public lineChartColors: Array<any> = [
        { // grey
            backgroundColor: 'rgba(148,159,177,0.2)',
            borderColor: 'rgba(148,159,177,1)',
            pointBackgroundColor: 'rgba(148,159,177,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(148,159,177,0.8)'
        },
        { // dark grey
            backgroundColor: 'rgba(77,83,96,0.2)',
            borderColor: 'rgba(77,83,96,1)',
            pointBackgroundColor: 'rgba(77,83,96,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(77,83,96,1)'
        },
        { // grey
            backgroundColor: 'rgba(148,159,177,0.2)',
            borderColor: 'rgba(148,159,177,1)',
            pointBackgroundColor: 'rgba(148,159,177,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(148,159,177,0.8)'
        }
    ];
    public lineChartLegend: boolean = true;
    public lineChartType: string = 'line';

    private resultArray: Array<number>;
    private metricsHandler: MessageHandler;

    constructor() {
        super();
    }

    ngOnInit() {
        this.resultArray = [];

        this.lineChartData = [
            {data: this.buildResultArray(), label: 'Series A'}
        ];

        this.bus.listenOnce('bridge-ready')
            .handle(
                () => {
                    this.listenForMetrics();
                }
            );
    }

    ngOnDestroy() {
        this.metricsHandler.close();
        this.bus.api.close(this.metricsChannel, 'metrics-chart');
    }

    buildResultArray() {
        let arr: Array<number> = [];
        for (let x = 0; x < 11; x++) {
            arr.push(Math.floor(Math.random() * 10));
        }
        this.resultArray = arr;
        return arr;
    }

    popResultArray(val: number) {
        this.resultArray.push(val);
        this.resultArray.shift();
        return this.resultArray;
    }

    buildResults(val: number) {
        this.lineChartData = [
            {data: this.popResultArray(val), label: 'Series A'}
        ];
    }

    listenForMetrics(): void {
        this.metricsHandler = this.bus.listenGalacticStream(this.metricsChannel);
        this.metricsHandler.handle(
            (metric: Metric) => {
                this.buildResults(metric.value);
            }
        );
    }
}

interface Metric {
    value: number;
}