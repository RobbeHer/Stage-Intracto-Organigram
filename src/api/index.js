import axios from "axios";
import baseUrl from "@/api/baseUrl";

const url = `${baseUrl}/orgchart/`;

export default {
    get() {
        return axios.get(`${url}`)
            .then((response) => {
                // handle success
                return response;
            })
            .catch(function (error) {
                // handle error
                return error;
            });
    },

    post(newOrgChartObj) {
        return axios.post(`${url}`, newOrgChartObj)
            .then((response) => {
                // handle success
                return response;
            })
            .catch(function (error) {
                // handle error
                return error;
            });
    },

    put(orgChartObj) {
        return axios.put(`${url}/${orgChartObj.id}`, orgChartObj)
            .then((response) => {
                // handle success
                return response;
            })
            .catch(function (error) {
                // handle error
                return error;
            });
    },

    delete(orgChartObj) {
        return axios.delete(`${url}/${orgChartObj.id}`, orgChartObj)
            .then((response) => {
                // handle success
                return response;
            })
            .catch(function (error) {
                // handle error
                return error;
            });
    }
}