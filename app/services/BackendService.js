import * as http from 'tns-core-modules/http'

let baseUrl = "http://wsdeb2.i4mi.bfh.ch:8080/api";

export default class BackendService {

      searchName(name) {
        return fetch(baseUrl + "/users/alreadyUsed?name=" + encodeURI(name), {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })
        .then(data => data.json());
      }

      getUser(name) {
        return fetch(baseUrl + "/users/" + encodeURI(name), {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })
        .then(data => data.json());
      }

      getFilteredUser(name) {
        return fetch(baseUrl + "/users?filter[where][name][nlike]=" + encodeURI(name), {
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
            walkerCoins: 200
          }),
        })
        .then(function(response) {
          if (!response.ok) {
              throw Error(response.statusText);
          }
          return response;
        })
        .then(function(response) {
          console.log("ok");
        })
        .catch(function(error) {
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
        .then(function(response) {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          return response;
        })
        .then(function(response) {
          console.log("ok");
        })
        .catch(function(error) {
          console.log(error);
        });
      }

      /*
        Deletes the relationship between a user and a friend. None of the users is deleted, nor are games
        parameters  - name: unique name of the user
                    - friend: unique name of the friend
        returns     just a promise
        author      hessg1
        version     2018-12-03

        TODO: fix "[TypeError: Network request failed: JSON Parse error: Unexpected EOF]"
      */
      deleteFriendship(name, friend){
        return fetch(baseUrl + "/users/" + name + "/friends/rel/" + friend, {
         method: "DELETE",
         headers: { "Content-Type": "application/json" },
        })
        .then(function(response) {
          console.log("Friendship canceled </3");
        })
        .catch(function(error) {
          console.log("Fehler:" + error);
        });
      }
      /*
        Update a single parameter of an user (e.g. mobility).
        parameters  - name: unique name of the user
                    - param: name of the parameter to be updated (Stick to the
                      API reference for correct naming.)
                    - value: the new value of the parameter
        returns     a promise :)
        author      hessg1
        version     2018-12-07
      */
      updateParameter(name, param, value){
        console.log("update param " + param + ": " + value + " for user " + name);
        return fetch(baseUrl + "/users/" + name, {
         method: "PATCH",
         headers: { "Content-Type": "application/json" },
         body: "{\"" + param + "\":" + value + "}",
       })
        .then(function(response) {
          if (!response.ok) {
              throw Error(response.statusText);
          }
          return response;
        })
        .then(function(response) {
          console.log("ok");
        })
        .catch(function(error) {
          console.log(error);
        });
      }

    addGame(name, friend) {
      return fetch(baseUrl + "/games/new", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({
         username: name,
         friend: friend,
       }),
     })
     .then(data => data.json());
    }

    getQuestion(gameId) {
      return fetch(baseUrl + "/games/" + gameId, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
      .then(data => data.json());
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
