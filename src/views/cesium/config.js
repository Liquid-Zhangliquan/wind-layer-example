const DEF_OPTS = {
  geocoder: false, // 地理位置查询定位控件
  homeButton: false, // 默认相机位置控件
  timeline: false, // 时间滚动条控件
  infoBox: false, // 默认弹窗
  navigationHelpButton: false, // 默认的相机控制提示控件
  fullscreenButton: false, // 全屏控件
  scene3DOnly: true, // 每个几何实例仅以3D渲染以节省GPU内存
  baseLayerPicker: false, // 底图切换控件
  animation: false, // 控制场景动画的播放速度控件
  imageryProvider: new Cesium.ArcGisMapServerImageryProvider({ url: 'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer' }),
  terrainProvider: new Cesium.createWorldTerrain(), // 世界地形
  contextOptions: {
    webgl: {
      preserveDrawingBuffer: true
    }
  }
}
export default DEF_OPTS