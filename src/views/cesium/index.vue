<template>
  <div class="base-earth-main-wrap">
    <div ref="map3d" class="map-container" id="viewer-container"></div>
  </div>
</template>
<script>
import DEF_OPTS from './config';
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
