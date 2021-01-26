<template>
  <div class="base-earth-main-wrap">
    <div class="map-container" ref="map"></div>
  </div>
</template>
<script>
import 'maptalks/dist/maptalks.css';
import { Map, TileLayer } from 'maptalks';
export default {
  name: 'maptalks-wind-core',
  components: {},
  data() {
    return {};
  },
  beforeCreate() {},
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      const map = new Map(this.$refs.map, {
        center: [113.53450137499999, 34.44104525],
        zoom: 3,
        baseLayer: new TileLayer('base', {
          urlTemplate: '//{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
          // urlTemplate: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
          subdomains: ['a', 'b', 'c', 'd']
        })
      });
    },
    initGui(windLayer) {
      const config = {
        addLayer: true,
        scalarLayer: false,
        tempLayer: true,
        paths: 1000,
        lineWidth: 3,
        velocityScale: 0.005,
        globalAlpha: 0.8,
        maxAge: 90
      };

      const gui = new dat.GUI();
      gui.add(config, 'globalAlpha', 0.01, 1).onChange(function() {
        windLayer.setWindOptions({
          globalAlpha: config.globalAlpha
        });
      });
      gui.add(config, 'maxAge', 1, 200).onChange(function() {
        windLayer.setWindOptions({
          maxAge: config.maxAge
        });
      });

      gui.add(config, 'paths', 500, 8000).onChange(function() {
        windLayer.setWindOptions({
          paths: config.paths
        });
      });

      gui.add(config, 'lineWidth', 1, 10).onChange(function() {
        windLayer.setWindOptions({
          lineWidth: config.lineWidth
        });
      });

      gui.add(config, 'velocityScale', 0, 0.1).onChange(function() {
        windLayer.setWindOptions({
          velocityScale: config.velocityScale
        });
      });
    }
  }
};
</script>
<style lang="less">
.base-earth-main-wrap {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  .map-container {
    position: relative;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    float: left;
    overflow: hidden;
  }
}
</style>
