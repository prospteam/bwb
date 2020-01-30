import React from "react";
const DEVELOPMENT = true;
export function url() {
         const url_ = (DEVELOPMENT) ? "http://192.168.1.20/maxi/backend_web_api/" : '';
         return url_;
}

export const CONSTANT = {
    api_key: 'AIzaSyAzU1rMg6-CYxTPBowJTby4oWgQVfOzRRY'
}
