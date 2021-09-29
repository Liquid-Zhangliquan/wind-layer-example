<template>
  <div class="base-earth-main-wrap">
    <div class="map-container" ref="map"></div>
  </div>
</template>
<script>
import 'maptalks/dist/maptalks.css';
import { Map, TileLayer } from 'maptalks';
import { WindLayer, ScalarLayer } from '@sakitam-gis/maptalks-wind';
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
      this.loadScalar(map);
      const velocityScales = {
        0: 1 / 20,
        1: 1 / 20,
        2: 1 / 20,
        3: 1 / 30,
        4: 1 / 40,
        5: 1 / 50,
        6: 1 / 60,
        7: 0.003,
        8: 0.002,
        9: 0.001,
        10: 0.0005,
        11: 0.0003,
        12: 0.00015,
        13: 0.0001,
        14: 0.00005,
        15: 0.000025,
        16: 0.00001,
        17: 0.000005,
        18: 0.000002,
        19: 0.000001,
        20: 0.0000005,
        21: 0.0000002,
        22: 0.0000001
      };

      fetch('data/wind.json')
        .then(res => res.json())
        .then(res => {
          const windLayer = new WindLayer('wind', res, {
            windOptions: {
              colorScale: '#fff',
              velocityScale: () => {
                const zoom = map.getZoom();
                return velocityScales[zoom] || 1 / 40;
              },
              frameRate: 16,
              maxAge: 60,
              globalAlpha: 0.9,
              paths: 3782
            }
          });
          map.addLayer(windLayer);
          this.initGui(windLayer);
        });
    },
    loadScalar(map) {
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
        ],
        wind: [
          [0, [98, 113, 183, 255]],
          [1, [57, 97, 159, 255]],
          [3, [74, 148, 169, 255]],
          [5, [77, 141, 123, 255]],
          [7, [83, 165, 83, 255]],
          [9, [53, 159, 53, 255]],
          [11, [167, 157, 81, 255]],
          [13, [159, 127, 58, 255]],
          [15, [161, 108, 92, 255]],
          [17, [129, 58, 78, 255]],
          [19, [175, 80, 136, 255]],
          [21, [117, 74, 147, 255]],
          [24, [109, 97, 163, 255]],
          [27, [68, 105, 141, 255]],
          [29, [92, 144, 152, 255]],
          [36, [125, 68, 165, 255]],
          [46, [231, 215, 215, 255]],
          [51, [219, 212, 135, 255]],
          [77, [205, 202, 112, 255]],
          [104, [128, 128, 128, 255]]
        ]
      };
      const tempInterpolateColor = color.temp.reduce(
        (result, item, key) => result.concat(item[0] - 273.15, 'rgba(' + item[1].join(',') + ')'),
        []
      );
      const tempLayer = new ScalarLayer(
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
        }
      );
      map.addLayer(tempLayer);
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
