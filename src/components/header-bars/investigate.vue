<template>
    <div class="investigate-header-container">
        <div class="investigate-header-buttons-container">
            <button
                :class="['timeline-button', { selected: mode === 'investigate_timeline' }]"
                @click="goToTimeline"
            >
                Timeline
            </button>
            <button
                :class="['pattern-button', { selected: mode === 'investigate_pattern' }]"
                @click="goToPattern"
            >
                Pattern
            </button>
        </div>
    </div>
</template>

<script>
export default {
  name: 'InvestigateHeader',
  props: {
    mode: String,
  },
  data() {
    return {
      search: '',
    };
  },
  methods: {
    goToTimeline() {
      this.$emit('goToTimeline');
    },
    goToPattern() {
      this.$emit('goToPattern');
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .investigate-header-container {
        width: 100%;
        display: flex;
        flex-direction: row;
        position: relative;
        justify-content: center;
        align-items: center;

        .investigate-header-buttons-container {
            flex-direction: row;
            flex-grow: 1;
            align-items: center;
            flex-basis: 0;

            .timeline-button,
            .pattern-button,
            .help-button {
                background: none;
                border: 1px solid #DD4126;
                color: #DD4126;
                padding: 5px 10px;
                width: 100px;
                margin: 15px;

                &.selected {
                    color: #000000;
                }
            }
        }
    }
</style>
