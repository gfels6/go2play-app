import * as http from 'tns-core-modules/http'

let baseUrl = "http://wsdeb2.i4mi.bfh.ch:8080/api";

export default class BackendService {

      searchName(name) {
        return fetch(baseUrl + "/users/alreadyUsed?name=" + name, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })
        .then(data => data.json());
      }

      getUser(name) {
        return fetch(baseUrl + "/users/" + name, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })
        .then(data => data.json());
      }

      //Errorhandling noch nicht der wahnsinn!
      addUser(name, gender, birthdate, mobilityLevel) {
         return fetch(baseUrl + "/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name,
            birthyear: birthdate,
            totalscore: 0,
            mobility: mobilityLevel,
            gender: gender,
            steps: 0,
            walkerCoins: 0
          }),
        })
        .then(function(response) {
          if (!response.ok) {
              throw Error(response.statusText);
          }
          return response;
      }).then(function(response) {
          console.log("ok");
      }).catch(function(error) {
          console.log(error);
      });
      }

      addFriend(name, friend) {
        return fetch(baseUrl + "/users/addFriend", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
           username: name,
           nFriend: friend,
         }),
       })
       .then(data => {
         console.log(data);
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
