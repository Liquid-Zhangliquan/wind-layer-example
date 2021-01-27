<template>
  <div class="base-earth-main-wrap">
    <div ref="map3d" class="map-container" id="viewer-container"></div>
  </div>
</template>
<script>
import DEF_OPTS from './config';
import CesiumWindScalar from '../../packages/cesium/scalar';
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
      const color = {
        temp: [
          [203, [115, 70, 105, 255]],
          [218, [202, 172, 195, 255]],
          [233, [162, 70, 145, 255]],
          [248, [143, 89, 169, 255]],
          [258, [157, 219, 217, 255]],
          [265, [106, 191, 181, 255]],
          [269, [100, 166, 189, 255]],
          [273.15, [93, 133, 198, 255]],
          [274, [68, 125, 99, 255]],
          [283, [128, 147, 24, 255]],
          [294, [243, 183, 4, 255]],
          [303, [232, 83, 25, 255]],
          [320, [71, 14, 0, 255]]
        ]
      };
      const tempInterpolateColor = color.temp.reduce(
        (result, item, key) => result.concat(item[0] - 273.15, 'rgba(' + item[1].join(',') + ')'),
        []
      );
      const tempLayer = new CesiumWindScalar(
        'temp',
        {
          type: 'image',
          url: 'data/var_tmp.png',
          extent: [
            [-180, 85.051129],
            [-180, -85.051129],
            [180, 85.051129],
            [180, -85.051129]
          ],
          width: 1440,
          height: 720,
          min: -50.84996643066404,
          max: 42.25002441406252
        },
        {
          styleSpec: {
            'fill-color': ['interpolate', ['linear'], ['get', 'value'], ...tempInterpolateColor],
            opacity: ['interpolate', ['exponential', 0.5], ['zoom'], 5, 0.5, 8, 1]
          },
          renderForm: 'r'
          // colorScale: [
          //   'rgba(36, 104, 180, 0.5)',
          //   'rgba(60, 157, 194, 0.5)',
          //   'rgba(128, 205, 193, 0.5)',
          //   'rgba(151, 218, 168, 0.5)',
          //   'rgba(198, 231, 181, 0.5)',
          //   'rgba(238, 247, 217, 0.5)',
          //   'rgba(255, 238, 159, 0.5)',
          //   'rgba(252, 217, 125, 0.5)',
          //   'rgba(255, 182, 100, 0.5)',
          //   'rgba(252, 150, 75, 0.5)',
          //   'rgba(250, 112, 52, 0.5)',
          //   'rgba(245, 64, 32, 0.5)',
          //   'rgba(237, 45, 28, 0.5)',
          //   'rgba(220, 24, 32, 0.5)',
          //   'rgba(180, 0, 35, 0.5)',
          // ],
        }
      );
      window.tempLayer = tempLayer;
      tempLayer.addTo(viewer);
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
