// import * as Cesium from 'cesium/Cesium';
import WindCore, { assign, defaultOptions, Field, formatData, isArray, removeDomNode, } from 'wind-core';
import { ScalarFill as ScalarCore, getGlContext, clearScene } from 'wind-gl-core';
const _options = {
  renderer: 'gl',
  doubleBuffer: false,
  animation: false,
  glOptions: {
    antialias: false,
    depth: false,
    stencil: false,
    alpha: true,
    premultipliedAlpha: true,
    preserveDrawingBuffer: true,
  },
};

class CesiumWindScalar {
  constructor(id, data, options = {}) {
    this.canvas = null;
    this.windScalar = null;
    this.field = data;
    this.viewer = null;
    this.options = assign({}, _options, options || {});
    // this.pickWindOptions();

    const canvas = document.createElement('canvas');
    canvas.style.cssText =
      'position:absolute; left:0; top:0;user-select:none;pointer-events: none;';
    canvas.className = 'cesium-wind-j';
    this.canvas = canvas;
    this.createContext();
    this.appendCanvas();
    this.render(this.canvas);
  }

  clearCanvas() {
    if (this.gl) {
      clearScene(this.gl, [0, 0, 0, 0]);
    }
  }

  createContext() {
    if (this.gl && this.gl.canvas === this.canvas) {
      return;
    }

    // @ts-ignore
    this.gl = getGlContext(this.canvas, _options.glOptions);
  }

  addTo(viewer) {
    this.viewer = viewer;
    this.appendCanvas();
    this.render(this.canvas);
  }

  remove() {
    if (!this.viewer) {
      return;
    }
    if (this.windScalar) {
      this.windScalar.stop();
    }
    if (this.canvas) {
      removeDomNode(this.canvas);
    }
    delete this.canvas;
  }

  removeLayer() {
    this.remove();
  }

  getMatrix() {
    return [1.4640625, 0, 0, 0, 0, 3, 0, 0, 0, 0, -1.2440796370662253, -1, -56432.72961699555, -88626.40177426653, 44975.75592036292, 44976]
  }

  setData(data) {
    return new Promise((resolve, reject) => {
      this.data = data;
      if (this.data && this.gl && this.windScalar) {
        this.windScalar.setData(this.data, (status) => {
          if (status) {
            resolve(true);
          } else {
            reject(false);
          }
        });
      } else {
        resolve(false);
      }
    });
  }

  getData() {
    return this.field;
  }

  setWindOptions(options) {
    // const _windOptions = assign(this.options.windOptions, options);
    // this.options.windOptions = _windOptions;
    // this.windScalar.setOptions(_windOptions);
  }

  getWindOptions() {
    return this.options || {};
  }

  pickWindOptions() {
    Object.keys(defaultOptions).forEach((key) => {
      if (key in this.options) {
        if (this.options.windOptions === undefined) {
          this.options.windOptions = {};
        }
        this.options.windOptions[key] = this.options[key];
      }
    });
  }

  getContext() {
    if (this.canvas === null) {
      return;
    }
    return this.canvas.getContext('2d');
  }

  appendCanvas() {
    if (!this.viewer || !this.canvas) {
      return;
    }
    if (document.querySelector('.cesium-wind-j')) {
      return;
    }
    this.adjustSize();
    const cesiumWidget = this.viewer.canvas.parentNode;
    cesiumWidget.appendChild(this.canvas);
  }

  adjustSize() {
    const viewer = this.viewer;
    const canvas = this.canvas;
    const { width, height } = viewer.canvas;
    const devicePixelRatio = 1;
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    if (this.gl) {
      this.gl.viewport(0, 0, canvas.width, canvas.height);
    }
  }

  render(canvas) {
    if (!this.getData() || !this.viewer) {
      return this;
    }
    const opt = this.getWindOptions();
    const data = this.getData();
    if (this.gl && canvas && !this.windScalar) {
      this.windScalar = new ScalarCore(this.gl, {
        opacity: opt.opacity,
        renderForm: opt.renderForm,
        styleSpec: opt.styleSpec,
        getZoom: 3,
        triggerRepaint: () => {
          this.render(canvas);
        }
      });


      this.windScalar.getMercatorCoordinate = this.project.bind(this);

      this.setData(data);
    }

    if (this.windScalar) {
      // this.windScalar.updateOptions(this.options);
      this.windScalar.render(this.getMatrix(), 0);
    }

    return this;
  }

  project(coordinate) {
    const position = Cesium.Cartesian3.fromDegrees(
      coordinate[0],
      coordinate[1],
    );
    const scene = this.viewer.scene;
    const sceneCoor = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
      scene,
      position,
    );
    return [sceneCoor.x, sceneCoor.y];
  }
}

export default CesiumWindScalar;
