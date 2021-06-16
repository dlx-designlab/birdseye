<template>
    <div class="pattern-container">
      <div class="graph-container">
          <div
              class="timeline-popout-component-container"
              v-if="story"
          >
              <SearchPopout
                :selectedData="story"
                @closeStory="closeStory"
              />

          </div>
            <div ref="chartComponent" id="container"></div>
        </div>
    </div>
</template>

<script>
import Highcharts from 'highcharts';
import NetworkGraph from 'highcharts/modules/networkgraph';
import STORIES from '../../data/stories.json';
import SearchPopout from '../search-body/search-popout.vue';

NetworkGraph(Highcharts);

export default {

  components: {
    SearchPopout,
  },
  computed: {
    getData() {
      if (this.filteredData && this.filteredData.length > 0) {
        return this.filteredData;
      }
      return STORIES;
    },
  },
  watch: {
    filteredData() {
      this.fillData();
    },
  },
  mounted() {
    this.fillData();
    this.setUpGraph();
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
      story: null,
      STORIES,
      nodes: [{

      }],
      nodeConnections: [
      ],
    };
  },
  methods: {
    closeStory() {
      this.story = null;
    },
    setUpGraph() {
      Highcharts.chart('container', {

        chart: {
          type: 'networkgraph',
          marginTop: 80,
          backgroundColor: 'transparent',
        },

        title: {
          text: '',
        },
        tooltip: {
          useHTML: true,
          formatter() {
            return `<img src="${this.point.img}" style="width:150px;height:150px;border:none;background:none;" id="tooltip-img-container" />`;
          },
        },
        plotOptions: {
          networkgraph: {
            keys: ['from', 'to'],
            layoutAlgorithm: {
              enableSimulation: true,
              integration: 'verlet',
              linkLength: 70,
            },
          },
        },

        series: [{
          events: {
            click: (e) => {
              this.story = [e.point.data];
            },
            mouseOut: () => {
            },
          },
          marker: {
            radius: 13,
          },
          dataLabels: {
            enabled: false,
            linkFormat: '',
            allowOverlap: true,
            style: {
              color: 'white',
              textOutline: false,
            },
          },
          data: this.nodeConnections,
          nodes: this.nodes,
        }],
      });
    },

    fillData() {
      const resultNodes = [];
      const resultNodeConnections = [];
      this.filteredData.forEach((data) => {
        const dataObject = {};
        dataObject.id = data.title;
        dataObject.marker = { radius: 5 };
        dataObject.color = 'rgba(0, 0, 0, 1)';
        dataObject.img = data.img;
        dataObject.data = data;
        resultNodes.push(dataObject);

        const connectionA = [
          resultNodes[Math.floor(Math.random() * resultNodes.length)].id,
          resultNodes[Math.floor(Math.random() * resultNodes.length)].id,
        ];

        const connectionB = [
          resultNodes[Math.floor(Math.random() * resultNodes.length)].id,
          resultNodes[Math.floor(Math.random() * resultNodes.length)].id,
        ];

        resultNodeConnections.push(connectionA);
        resultNodeConnections.push(connectionB);
        // here, make connecton with one random other.
      });
      this.nodes = resultNodes;
      this.nodeConnections = resultNodeConnections;
      this.setUpGraph();
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

    }
</style>

<style scoped lang="scss">
    .pattern-container {
        flex-direction: row;
        align-items: center;
        width: 100%;
        position: relative;

         .timeline-popout-component-container {
            width: 100%;
            left: 0;
            top: 0;
            position: fixed;
            margin: 0 auto;
            z-index: 3;
            background-color: rgba(0, 0, 0, 0.5);
            height: 100%;
            text-align: center;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }

        .graph-container {
          margin-top: -150px;

        h2 {
            font-size: 1em;
            text-transform: lowercase;
        }
    }

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
      }
    }

</style>
