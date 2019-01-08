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
        Deletes a game
        parameters  - name: name of one of the users in the game
                    - id: id of the game
        returns     throws error if successful "TypeError: Network request failed: JSON Parse error: Unexpected EOF"
                    because API returns NULL body that can't be handled by fetch()
        author      hessg1
        version     2019-01-03
      */
      deleteGame(name, id) {
        console.log("delete game: " + id + " / user: " + name);
        return fetch(baseUrl + "/users/" + name + "/games/" + id, {
         method: "DELETE",
         headers: { "Content-Type": "application/json" }
        })
        .then((res) => {
          console.log("game deleted");
          res.text()
        })
	       .then((text) => {
           console.log("delete game we are here");
           text.length ? JSON.parse(text) : {};

         })
	        .catch((error) => {
              console.log("caught to throw");
		          throw error;
	        });
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
            walkerCoins: 0
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
        returns     throws error if successful "TypeError: Network request failed: JSON Parse error: Unexpected EOF"
                    because API returns NULL body that can't be handled by fetch()
        author      hessg1
        version     2019-01-02

        api call returns empty response, this is not an error but is treated as one in fetch
        so we have to catch this here because fetch crashes on null response
        see: https://mcculloughwebservices.com/2016/09/23/handling-a-null-response-from-an-api/
      */
      deleteFriendship(name, friend){
        return fetch(baseUrl + "/users/" + name + "/friends/rel/" + friend, {
         method: "DELETE",
         headers: { "Content-Type": "application/json" }
        })
        .then((res) => {
          res.text()
        })
	       .then((text) => {
           text.length ? JSON.parse(text) : {};

         })
	        .catch((error) => {
              console.log("caught to throw");
		          throw error;
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

    /*
      Search for the actual round (also check if its your turn)
      parameters  - name: name of the user who wants to play
                  - gameId: id of the game
      returns     a promise with the questions and answers (3x for the hole round)
      author      gfels6
      version     2018-12-30
    */
    getActualRound(gameId, name) {
      return fetch(baseUrl + "/games/" + gameId +"/round", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: name,
        }),
      })
      .then(data => data.json());
    }

    /*
      Set the answers into the game/round object
      parameters  - gameID: id of the game
                  - name: name of the user who played the game
                  - round: which round is actual playing (needs to be correct)
                  - answers: array with the answers like this [1,2,3]
      returns     a promise
      author      gfels6
      version     2018-12-30
    */
    setAnswers(gameId, name, round, answers) {
      return fetch(baseUrl + "/games/" + gameId + "/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: name,
          roundNr: round,
          answers: answers
        }),
      })
      .then(data => data.json());
    }
}
