import * as http from 'tns-core-modules/http'

let baseUrl = "http://wsdeb2.i4mi.bfh.ch:8080/api";

export default class BackendService {

      /*
        Searching for a username if it exists already
        parameters  - name: name of a possible user
        returns     a promise with userCount
                    1 = user exists 0 = user doesnt exist
        author      gfels6
        version     2018-12-29
      */  
      searchName(name) {
        return fetch(baseUrl + "/users/alreadyUsed?name=" + encodeURI(name), {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })
        .then(data => data.json());
      }

      /*
        Select a user with all its information
        parameters  - name: unique name of the user
        returns     a promise the user information
        author      gfels6
        version     2018-12-29
      */
      getUser(name) {
        return fetch(baseUrl + "/users/" + encodeURI(name), {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })
        .then(data => data.json());
      }

      /*
        Search for an enemy, it gives you a list with all user except yourself
        parameters  - name: unique name of the user
        returns     a promise with all users except the one that is executing
        author      gfels6
        version     2018-12-29
      */
      getRandomUser(name) {
        return fetch(baseUrl + "/users?filter[where][name][nlike]=" + encodeURI(name), {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })
        .then(data => data.json());
      }

      /*
        Creates a new user with the selected attributes
        parameters  - name: unique name of the user
                    - gender: gender (male, female)
                    - birthdate: birthdate as a string
                    - mobilityLevel: number from between 0 and 100
        returns     a promise
        author      gfels6
        version     2018-12-29
      */
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

      /*
        Creates the relationship between two users
        parameters  - name: unique name of the user
                    - friend: name of the friend
        returns     a promise
        author      gfels6
        version     2018-12-29
      */
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

    /*
      Create a new game between two players
      parameters  - name: unique name of the user
                  - friend: name of the friend
      returns     a promise with the gameID
      author      gfels6
      version     2018-12-29
    */
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

    /*
      Search for all open games (they have the activeUser != "game finished")
      parameters  - name: unique name of the user
      returns     a promise with all open games
      author      gfels6
      version     2018-12-30
    */
    searchOpenGames(name) {
      return fetch(baseUrl + "/games?filter[where][or][0][user1]=" + name + "&filter[where][or][1][user2]=" + name + "&filter[where][and][2][activeUser][nlike]=game%20finished", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
      .then(data => data.json());
    }

    /*
      Search for all finished games (they have the activeUser = "game finished")
      parameters  - name: unique name of the user
      returns     a promise with all finished games
      author      gfels6
      version     2018-12-30
    */
    searchFinishedGames(name) {
      return fetch(baseUrl + "/games?filter[where][or][0][user1]=" + name + "&filter[where][or][1][user2]=" + name + "&filter[where][and][2][activeUser][like]=game%20finished", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
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

}
