import Vue from 'vue'
import {ApiVersion} from '../resources'
/**
 * 定位相关
 * */
const LocationsUrl = {
  // 获取全国省份信息
  ProvinceRes: Vue.resource(ApiVersion + 'common/locations'),
  // 获取省份所有城市信息
  CityRes: Vue.resource(ApiVersion + 'common/locations/province/{id}'),
  // 获取城市所有区域信息
  AreaRes: Vue.resource(ApiVersion + 'common/locations/city/{id}'),
  ChinaCityRes: Vue.resource(ApiVersion + 'common/locations/city_cn'),
  //  获取全国所有省市
  AllProvinceCityRes: Vue.resource(ApiVersion + 'common/locations/all_province_city'),
  // 获取热门城市
  HotCityRes: Vue.resource(ApiVersion + 'common/locations/hot_city')
}
/**
 * 区域---token已调试
 * */
const LocationsApi = {
  // 获取全国省份信息
  getProvince: function () {
    return LocationsUrl.ProvinceRes.get()
  },
  // 获取省份所有城市信息
  getCity: function (provinceID) {
    return LocationsUrl.CityRes.get({id: provinceID})
  },
  // 获取城市所有区域信息
  getArea: function (cityID) {
    return LocationsUrl.AreaRes.get({
      id: cityID
    })
  },
  getChinaCity: function () {
    return LocationsUrl.ChinaCityRes.get()
  },
  // 获取全国所有省市
  getAllProvinceCity: function () {
    return LocationsUrl.AllProvinceCityRes.get()
  },
  getHotCity: function () {
    return LocationsUrl.HotCityRes.get()
  }
}
export default LocationsApi
