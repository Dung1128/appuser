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
  api_get_list_discount: common.domain+'/api/user_v1/get_ma_giam_gia.php',
  api_get_code_auth: common.domain+'/api/user_v1/api_get_ma_xac_thuc.php',
  api_reset_pass: common.domain+'/api/user_v1/api_quen_mat_khau.php',
  api_auth_acc: common.domain+'/api/user_v1/api_xac_thuc_tai_khoan.php',
  api_get_list_hang_ghe: common.domain+'/api/user_v1/get_list_color_hang_ghe.php',
  api_get_discount_children: common.domain+'/api/user_v1/get_giam_gia_tre_em.php',
  api_get_discount_code: common.domain+'/api/user_v1/get_ma_giam_gia_detail.php',
  api_get_list_chuyen_pho_bien: common.domain+'/api/user_v1/api_get_list_chuyen.php',
  api_get_list_chuyen_rating: common.domain+'/api/user_v1/api_user_rating_chuyen_di.php',
  api_get_list_tieu_chi: common.domain+'/api/user_v1/api_tieu_chi_danh_gia.php',
  api_save_rating: common.domain+'/api/user_v1/api_user_save_rating.php',
  api_view_rating: common.domain+'/api/user_v1/api_user_view_rating.php',
  api_get_user_info: common.domain+'/api/api_user_get_user_info.php',
  api_buy_pro_by_point: common.domain+'/api/user_v1/api_buy_promotion_by_point.php',
  api_history_point: common.domain+'/api/user_v1/api_money_point_history.php',
  api_get_list_promotion: common.domain+'/api/user_v1/api_get_list_promotion.php',
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
    // console.log(url);
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
