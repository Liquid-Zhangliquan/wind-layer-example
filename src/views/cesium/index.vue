<template>
  <div class="base-earth-main-wrap">
    <div ref="map3d" class="map-container" id="viewer-container"></div>
  </div>
</template>
<script>
import DEF_OPTS from './config';
import { WindLayer } from '../../packages/cesium';
export default {
  name: 'cesium-wind-core',
  components: {},
  data() {
    return {};
  },
  beforeCreate() {},
  mounted() {
    this.initViewer();
  },
  methods: {
    initViewer() {
      window.viewer = new Cesium.Viewer('viewer-container', {
        ...DEF_OPTS
      });
      viewer._cesiumWidget._creditContainer.style.display = 'none';
      const windOptions = {
        colorScale: [
          'rgb(36,104, 180)',
          'rgb(60,157, 194)',
          'rgb(128,205,193 )',
          'rgb(151,218,168 )',
          'rgb(198,231,181)',
          'rgb(238,247,217)',
          'rgb(255,238,159)',
          'rgb(252,217,125)',
          'rgb(255,182,100)',
          'rgb(252,150,75)',
          'rgb(250,112,52)',
          'rgb(245,64,32)',
          'rgb(237,45,28)',
          'rgb(220,24,32)',
          'rgb(180,0,35)'
        ],
        frameRate: 16,
        maxAge: 60,
        globalAlpha: 0.9,
        velocityScale: 1 / 30,
        paths: 2000
      };
      fetch('data/wind.json')
        .then(res => res.json())
        .then(res => {
          window.windLayer = new WindLayer(res, { windOptions });
          windLayer.addTo(viewer);
          this.initGui(windLayer);
        });
    },
    initGui(windLayer) {
      const config = {
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
