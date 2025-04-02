import axios from 'axios';
import { API_BASE_URL, HTTP_TIMEOUT } from '../constants';

class Api {
    baseUrl = API_BASE_URL;
    http = null;
    token = null;
    tokenRefreshAfter = null; // when the token should be refreshed

    constructor(){
        this.http = axios.create({
            baseURL: this.baseUrl,
            timeout: HTTP_TIMEOUT * 1000, // todo: fix the unhandled rejection
          });

        this.http.interceptors.request.use(
            config => {
                // check if token needs to be refreshed
                return config;
            }
        );
    }

    setToken(token){
        this.token = token;
        // refresh the token after 1 hour
        this.tokenRefreshAfter = new Date().getTime() + 3600000;
    }

    clearToken(){
        this.token = null;
        this.tokenRefreshAfter = null;
    }

    _refreshToken = async () => {}

}

Object.assign(Api.prototype, require('./users'));
Object.assign(Api.prototype, require('./instruments'));
Object.assign(Api.prototype, require('./portfolios'));
Object.assign(Api.prototype, require('./characters'));
Object.assign(Api.prototype, require('./ai'));

const api = new Api();

export { api }; 