import { Actions } from 'react-native-router-flux'
import * as common from '../Config/common';

const API_URL = {
  login: common.domain+'/api/api_user_dang_nhap.php',
  register: common.domain+'/api/api_user_dang_ky.php',
  user_ben: common.domain+'/api/api_user_ben.php',
  user_so_do_giuong: common.domain+'/api/api_user_so_do_giuong.php',
  adm_so_do_giuong: common.domain+'/api/api_adm_so_do_giuong.php',
  api_check_ve: common.domain+'/api/api_check_ve.php',
  user_rating: common.domain+'/api/api_user_rating.php',
  user_gop_y: common.domain+'/api/api_user_gop_y.php',
  user_save_order: common.domain+'/api/api_user_save_order.php',
  user_lich_su_order: common.domain+'/api/api_user_lich_su_order.php',
  user_tin_lien_quan: common.domain+'/api/api_user_tin_lien_quan.php',
  user_news: common.domain+'/api/api_user_news.php',
  user_get_content: common.domain+'/api/api_user_get_content.php',
  adm_get_time_sync: common.domain+'/api/api_adm_get_time_sync.php',
  api_check_version: common.domain+'/api/api_check_version.php',
}

const API_HEADERS  = {
  login_id: {
    "Content-Type": "application/json",
    "Accept-Encoding": "identity",
  },
}

const HttpError = {
  no_network: 'Network request failed'
}

const fetchData = async (type, param={}, method="GET", retry=undefined) => {

  if(!(type in API_URL)) return []

  let url     = API_URL[type]

  try {

    // Khai báo headers mặc định
    let headers = {
      "Content-Type"    : "multipart/form-data",
		"Cache-Control"   : common.cache,
    }

    // Gán lại headers nếu có
    if(type in API_HEADERS) headers  = Object.assign(headers, API_HEADERS[type])

    // Tạo biến opts
    let opts    = {
      method  : method,
      headers : headers,
    }

    // Method GET
    if(method == "GET"){
      if(Object.keys(param).length) url += "?" + Object.keys(param).map((k) => k + "=" + encodeURIComponent(param[k])).join("&")
    }

    // Method POST
    else if(method == "POST"){
      let formData  = new FormData()
      if(headers["Content-Type"] == "application/json") opts.body = JSON.stringify(param)
      else{
        formData.append("data", JSON.stringify(param))
        opts.body   = formData
      }
    }

    // Trả về dữ liệu json
    console.log(url);
    let response    = await fetch(url, opts)
    let responseJson= await response.json()
    
    return responseJson
  } catch(e) {
    console.error("HttpError", e);
    console.error("HttpError", url);
    console.error("HttpError", param);
    if (e.toString().indexOf(HttpError.no_network) > -1) {
      let props = {
        title: 'No Connection',
        message: 'Có lỗi trong quá trính lấy dữ liệu.<br>Vui lòng kiểm tra lại kết nối',
        typeAlert: 'warning',
        titleButton: 'Thử lại',
        callback: retry
      };
      () => Actions.alert(props);
    }
  }
}

export default fetchData
