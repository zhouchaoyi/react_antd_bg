import superagent from 'superagent';
import {notification} from 'antd';
import {getParamFromToken,setCookie,getCookie} from '../utils';
import {loginUrl} from '../common/app';
//import jsonp from 'superagent-jsonp';

const methods = [
  'get',
  'head',
  'post',
  'put',
  'del',
  'options',
  'patch'
];

class _Api {

  constructor(opts) {

    this.opts = opts || {};

    if (!this.opts.baseURI)
      throw new Error('baseURI option is required');

    methods.forEach(method =>
      this[method] = (path, { params, data } = {}) => new Promise((resolve, reject) => {
        const request = superagent[method](this.opts.baseURI + path);

        //request.use(jsonp);

        if (params) {
          request.query(params);
        }
        if (this.opts.headers) {
          request.set(this.opts.headers);
        }
        
        if (!data) {
            data={};
        }
        //给每一个请求带上token
        if (null != getCookie("token")) {
            data.token = getCookie("token");
        }
        //console.log(data);
        request.send(data);

        request.end((err, { text } = {}) => {
          //console.log(text);
          //统一处理错误
          let json="";
          try {
            json = JSON.parse(text);
            if(json.status.errorCode=='000001') {
                notification.error({
                  message: 'Fail',
                  description: json.status.errorMsg
                });
            }else if(json.status.errorCode=="000002") {
                notification.error({
                  message: 'Fail',
                  description: json.status.errorMsg
                });
                setTimeout(function() {
                    top.location.href=loginUrl;
                },2000);
                return;
            }else if(json.status.errorCode=="000003") {
                notification.error({
                  message: 'Fail',
                  description: json.status.errorMsg
                });
                setTimeout(function() {
                    top.location.href=loginUrl;
                },2000);
                return;
            }else if(json.status.errorCode=="000000") {
                if(json.data.token!=null&&json.data.token!=undefined) {
                    let exp = getParamFromToken(json.data.token,"exp");
                    setCookie("token",json.data.token,exp);
                }
            } 
            return err ? reject(text || err) : resolve(text);
          }catch(e) { //如果不是json数据，把数据直接返回
              console.log("<<<<<< superagent 404 <<<<<<");
              return;
          }
        });
        // request.end((err, res) => {
        //     console.log("myRes",res);
        // });
      })
    );

  }

}

const Api = _Api;

export default Api;
