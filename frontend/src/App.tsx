import { useEffect, useState } from "react";
import "./App.css";
import io from "socket.io-client";

export const socket = io("http://127.0.0.1:5000");

const userOne = {
  provider: "local",
  _id: "61107e8243b4d37bc682e778",
  firstName: "user",
  lastName: "one",
  email: "userone@gmail.com",
  username: "userone",
  createdAt: "2021-08-09T01:01:54.291Z",
  updatedAt: "2021-08-09T01:01:55.979Z",
  __v: 0,
  followers: {
    numberOfFollowers: 1,
  },
  followings: {
    numberOfFollowings: 0,
  },
};

const userTwo = {
  provider: "local",
  _id: "61107eab43b4d37bc682e781",
  firstName: "user",
  lastName: "two",
  email: "usertwo@gmail.com",
  username: "usertwo",
  createdAt: "2021-08-09T01:02:35.611Z",
  updatedAt: "2021-08-09T01:02:37.380Z",
  __v: 0,
  followers: {
    numberOfFollowers: 1,
  },
  followings: {
    numberOfFollowings: 0,
  },
};

function App() {
  const [user, setUser] = useState<any>(null);
  const [message, setMessag] = useState<any>(null);
  const [messagees, setMessages] = useState<any>(null);

  useEffect(() => {
    socket.emit("test", "BIDÊN 2023");
    console.log("Hello World!");
  }, []);

  useEffect(() => {
    socket.on("online-friends", (myFriends) => {
      console.log(myFriends);
    });
  }, []);

  useEffect(() => {
    socket.on("new-login", (newUser) => {
      console.log("NEW LOG IN USER");
      console.log(newUser);
    });
  }, []);

  useEffect(() => {
    socket.on("new-logout", (loggedOutUser) => {
      console.log("somebody logged out");
      console.log(loggedOutUser);
    });
  }, []);

  const login = (id: string) => {
    if (id === "user1") {
      setUser(userOne);
      socket.emit("login", userOne);
      socket.emit("get-online-friends", userOne._id);
    } else {
      setUser(userTwo);
      socket.emit("login", userTwo);
      socket.emit("get-online-friends", userTwo._id);
    }
  };

  return (
    <div className="App">
      <div style={{ marginBottom: 40 }}>{JSON.stringify(user)}</div>
      <button
        onClick={() => {
          login("user1");
        }}
      >
        Set as user one
      </button>
      <button
        onClick={() => {
          login("user2");
        }}
      >
        Set as user two
      </button>
      <input type="text" name="msg" id="msg" />
      <button>Send</button>

      <div>
        <h1>Message Box</h1>
      </div>
    </div>
  );
}

export default App;
