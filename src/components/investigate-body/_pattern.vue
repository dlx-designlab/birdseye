<template>
    <div class="pattern-container">
        <div class="chart">
            <apexchart
                ref="chart"
                height="100%"
                width="80%"
                type="bar"
                :options="chartOptionsTwo"
                :series="seriesTwo">
            </apexchart>
        </div>
    </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts';
import STORIES from '../../data/stories.json';

export default {

  components: {
    apexchart: VueApexCharts,
  },
  computed: {
    // a computed getter
    pieChartSeries() {
      // `this` points to the vm instance
      return this.message.split('').reverse().join('');
    },
    getData() {
      if (this.filteredData && this.filteredData.length > 0) {
        return this.filteredData;
      }
      return STORIES;
    },
  },
  watch: {
    filteredData() {
      this.showTags();
    },
  },
  beforeMount() {
    this.showTags();
  },
  props: {
    filteredData: Array,
  },
  data() {
    return {
      selectedData: null,
      chartSelected: null,
      tagCounts: {},
      dateCounts: {},
      STORIES,
      seriesTwo: [{
        name: '',
        data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
      }],
      chartOptionsTwo: {
        colors: ['#000000'],
        chart: {
          type: 'bar',
          events: {
            dataPointSelection: (event, chartContext, config) => {
              const selected = config.dataPointIndex;
              const selectedDate = this.chartOptionsTwo.xaxis.categories[selected];
              let selectedStories;
              if (this.chartSelected === 'time') {
                selectedStories = this.getData.filter((story) => story.date === selectedDate);
              } else if (this.chartSelected === 'type') {
                selectedStories = this.getData.filter((story) => story.media === selectedDate);
              } else if (this.chartSelected === 'data') {
                selectedStories = this.getData.filter(
                  (story) => story.satellite_data_assigned === selectedDate,
                );
              } else if (this.chartSelected === 'tags') {
                selectedStories = this.getData.filter((story) => story.tags.includes(selectedDate));
              }
              this.selectedData = selectedStories;
            },
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '25px',
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: false,
          width: 12,
          colors: ['transparent'],
        },
        grid: {
          show: false,
        },
        xaxis: {
          categories: [],
          labels: {
            show: false,
          },
          colors: '#DD4126',
          axisBorder: {
            show: true,
            color: '#000000',
            height: 2,
            width: '100%',
            offsetX: 0,
            offsetY: 0,
          },
          axisTicks: {
            show: false,
            borderType: 'solid',
            color: '#000000',
            height: 6,
            offsetX: 0,
            offsetY: 0,
          },
        },
        yaxis: {
          crosshairs: {
            show: false,
          },
          axisBorder: {
            show: false,
            color: '#78909C',
            offsetX: 0,
            offsetY: 0,
          },

          labels: {
            show: false,
          },
          axisTicks: {
            show: false,
            borderType: 'solid',
            color: '#78909C',
            width: 6,
            offsetX: 0,
            offsetY: 0,
          },
          title: {
            text: 'Reports',
          },
          show: false,
          showAlways: false,
        },
        fill: {
          opacity: 1,
        },
        tooltip: {
          custom: ({
            // eslint-disable-next-line no-unused-vars
            series, seriesIndex, dataPointIndex, w,
          }) => `${'<div class="arrow_box">'
                  + '<span>'}${this.chartOptionsTwo.xaxis.categories[dataPointIndex]}</span>`
                  + '</div>',
          x: {
            show: true,
          },
          marker: {
            show: false,
          },
          y: {
            show: false,
          },
        },
      },
    };
  },
  methods: {
    closeStory() {
      this.selectedData = null;
    },
    showTime() {
      this.chartSelected = 'time';
      const allTags = [];
      const allDates = [];
      this.getData.forEach((story) => {
        const { tags } = story;
        const { date } = story;
        allDates.push(date);
        tags.forEach((tag) => {
          allTags.push(tag);
        });
      });

      const counts = {};
      allDates.forEach((date) => { counts[date] = (counts[date] || 0) + 1; });
      this.dateCounts = counts;
      this.chartOptionsTwo.xaxis.categories = Object.keys(this.dateCounts);
      this.seriesTwo[0].data = Object.values(this.dateCounts);
      if (this.$refs.chart) {
        this.$refs.chart.refresh();
      }
    },
    showType() {
      this.chartSelected = 'type';
      const allTypes = [];
      this.getData.forEach((story) => {
        const { media } = story;
        allTypes.push(media);
      });

      const counts = {};
      allTypes.forEach((date) => { counts[date] = (counts[date] || 0) + 1; });

      this.chartOptionsTwo.xaxis.categories = Object.keys(counts);
      this.seriesTwo[0].data = Object.values(counts);
      if (this.$refs.chart) {
        this.$refs.chart.refresh();
      }
    },
    showData() {
      this.chartSelected = 'data';
      const allTypes = [];
      this.getData.forEach((story) => {
        const data = story.satellite_data_assigned;
        allTypes.push(data);
      });

      const counts = {};
      allTypes.forEach((data) => { counts[data] = (counts[data] || 0) + 1; });
      this.chartOptionsTwo.xaxis.categories = Object.keys(counts);
      this.seriesTwo[0].data = Object.values(counts);
      if (this.$refs.chart) {
        this.$refs.chart.refresh();
      }
    },
    showTags() {
      this.chartSelected = 'tags';
      const allTags = [];
      this.getData.forEach((story) => {
        const { tags } = story;
        tags.forEach((tag) => {
          allTags.push(tag);
        });
      });

      const counts = {};
      allTags.forEach((tag) => { counts[tag] = (counts[tag] || 0) + 1; });
      this.chartOptionsTwo.xaxis.categories = Object.keys(counts);
      this.seriesTwo[0].data = Object.values(counts);
      if (this.$refs.chart) {
        this.$refs.chart.refresh();
      }
    },
  },
};
</script>

<style lang="scss">

  .chart {
    padding-top: 5px;
  }
    .apexcharts-canvas {
        margin: 0 auto !important;
    }

    .apexcharts-tooltip {
      background: none !important;
      border: none !important;
      outline: none !important;
      color: #000000;
      background-color: none !important;
      transform: rotate(-90deg);
      box-shadow: none !important;
      margin-left: -30px !important;
      margin-top: 50px !important;
    }
</style>

<style scoped lang="scss">
    .pattern-container {
        flex-direction: row;
        align-items: center;
        width: 100%;
        position: relative;

      .pattern-popout-component-container {
        width: 50%;
        right: 0;
        position: absolute;
        z-index: 12;
        border-bottom: 2px solid red;
        overflow-y: scroll;
        height: 80%;
      }

      .chart-key {
        text-align: left;
        padding-left: 15%;
        color: #DD4126;

        .chart-options {
          color: #DD4126;
          cursor: pointer;
        }

        .selected {
          color: #000000;
        }
      };
    }

</style>
