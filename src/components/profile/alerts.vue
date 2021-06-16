<template>
    <div class="alerts-container">
        <button
            class="back-button"
            v-html="`<  ${$t('back')}`"
            @click="closeSection"
        />
        <h1>Alerts</h1>
        <div class="ui-placeholder-container">
            <img
                v-if="$i18n.locale === 'en'"
                src="/images/ui/alerts-ui-buttons.png"
                class="ui-buttons"
            />
            <img v-else src="/images/ui/alerts-ui-buttons-jp.png" class="ui-buttons" />
            <img v-if="$i18n.locale === 'en'" src="/images/ui/alerts-ui-main.png" class="main-ui" />
            <img v-else src="/images/ui/alerts-ui-main-jp.png" class="main-ui" />
        </div>
    </div>
</template>

<script>

export default {
  name: 'profile',
  methods: {
    closeSection() {
      this.$emit('closeSection');
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

.alerts-container {
    position: absolute;
    z-index: 3;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    background: linear-gradient(180deg, #FE1F02 0%, rgba(255, 255, 255, 100%) 100%);

    h1 {
        color: #FFFFFF;
        font-size: 2em;
        justify-content: center;
        margin: 0 auto;
        margin-top: 10vh;
        text-transform: uppercase;
        font-weight: 400;
    }

    .ui-placeholder-container {
        position: absolute;
        height: 100%;
        width: auto;
        box-sizing: border-box;
        padding: 20vh 15vw;

        .ui-buttons {
            width: 350px;
            margin: 15vh 0;
        }

        .main-ui {
            width: 100%;
        }
    }

    .back-button {
        position: absolute;
        z-index: 4;
        height: 50px;
        width: 100px;
        top: 25px;
        left: 25px;
        background: none;
        color: #000000;
        border: none;
        outline: none;
        text-transform: lowercase;
    }
}

</style>
