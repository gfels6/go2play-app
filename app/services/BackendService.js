import * as http from 'tns-core-modules/http'

let baseUrl = "http://wsdeb2.i4mi.bfh.ch:8080/api";

export default class BackendService {

      searchName(name) {
        return http.request({
          url: baseUrl + "/users/alreadyUsed?name=" + name,
          method: "GET",
          headers: "",
        })
        .then(this.getJson)
        .then(data => {
         this.accountFound = data.userCount;
          return data;
        })
      }

      // Parsing to JSON
      getJson(response) {
        return new Promise((resolve, reject) => {
          console.info('Content: ' + response.content.toString())
          resolve(response.content.toJSON())
        })
          .catch(e => {
            console.error('Error parsing JSON response: ' + e)
            throw 'Error parsing JSON response: ' + e
          })
      }

}