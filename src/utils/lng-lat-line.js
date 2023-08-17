import L from 'leaflet'
export default class lnglatline {
  constructor (map) {
    this.map = map
    this.drawLineHandler = this.drawLine.bind(this)
  }

  getIntervalByZoom (zoom) { // 根据缩放级别获取经纬度间隔
    if (zoom <= 4.5) {
      return { lat: 20, lng: 20 }
    } else if (zoom <= 5.5) {
      return { lat: 10, lng: 10 }
    } else if (zoom <= 6.9) {
      return { lat: 5, lng: 5 }
    } else if (zoom <= 7.5) {
      return { lat: 2, lng: 2 }
    } else if (zoom <= 8) {
      return { lat: 1, lng: 1 }
    } else if (zoom <= 10.5) {
      return { lat: 0.5, lng: 0.5 }
    } else if (zoom <= 11.5) {
      return { lat: 0.2, lng: 0.2 }
    } else if (zoom <= 14) {
      return { lat: 0.1, lng: 0.1 }
    } else {
      return { lat: 0.1, lng: 0.1 }
    }
  }

  addLineToMap () { // 添加经纬度
    this.drawLine()
    this.addLineEventListeners()
  }

  removeLineToMap () { // 移除经纬度
    if (this.layerGroup) {
      this.layerGroup.clearLayers()
    }
    this.removeLineEventListeners()
  }

  addLineEventListeners () { // 添加事件监听
    this.map.on('zoomend', this.drawLineHandler)
    this.map.on('moveend', this.drawLineHandler)
  }

  removeLineEventListeners () { // 移除事件监听
    this.map.off('zoomend', this.drawLineHandler)
    this.map.off('moveend', this.drawLineHandler)
  }

  getLayerById (id) { // 根据id获取图层
    let layer = null
    this.map.eachLayer(function (event) {
      if (event instanceof L.LayerGroup && event.options.id === id) {
        layer = event
      }
    })
    return layer
  }
  drawLine () {
    this.layerGroup = this.getLayerById('lng-latLine')
    if (!this.layerGroup) {
      this.layerGroup = L.layerGroup([], { id: 'lng-latLine' }).addTo(this.map)
    }

    var zoom = this.map.getZoom()
    var interval = this.getIntervalByZoom(zoom)

    this.layerGroup.clearLayers()
    var bounds = this.map.getBounds()
    var southWest = bounds.getSouthWest()
    var northEast = bounds.getNorthEast()
    const intervalLat = Math.floor(southWest.lat / interval.lat) * interval.lat
    const intervalLng = Math.floor(southWest.lng / interval.lng) * interval.lng

    for (var lat = intervalLat; lat <= northEast.lat; lat += interval.lat) {
      L.polyline(
        [[lat, southWest.lng - 1], [lat, northEast.lng + 1]],
        { color: '#666666', weight: 1, strokeOpacity: 0.4, dashArray: '5, 5' }
      ).addTo(this.layerGroup)
      L.marker([lat, southWest.lng], {
        icon: L.divIcon({
          className: 'label',
          html: '<span style="color: #666;font-size: 12px;">' + parseFloat(lat.toFixed(2)) + '°N</span>',
          iconSize: [-10, 0]
        })
      }).addTo(this.layerGroup)

      L.marker([lat, northEast.lng], {
        icon: L.divIcon({
          className: 'label',
          html: '<span style="color: #666;font-size: 12px;">' + parseFloat(lat.toFixed(2)) + '°N</span>',
          iconSize: [90, 0]
        })
      }).addTo(this.layerGroup)
    }

    for (var lng = intervalLng; lng <= northEast.lng; lng += interval.lng) {
      L.polyline(
        [[southWest.lat - 1, lng], [northEast.lat + 1, lng]],
        { color: '#666666', weight: 1, strokeOpacity: 0.4, dashArray: '5, 5' }
      ).addTo(this.layerGroup)

      L.marker([southWest.lat, lng], {
        icon: L.divIcon({
          className: 'label',
          html: '<span style="color: #666;font-size: 12px;">' + parseFloat(lng.toFixed(2)) + '°E</span>',
          iconSize: [25, 40]
        })
      }).addTo(this.layerGroup)

      L.marker([northEast.lat, lng], {
        icon: L.divIcon({
          className: 'label',
          html: '<span style="color: #666;font-size: 12px;">' + parseFloat(lng.toFixed(2)) + '°E</span>',
          iconSize: [25, -20]
        })
      }).addTo(this.layerGroup)
    }
  }
}
