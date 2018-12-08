import React, { Component } from "react";
import Navbar from "./components/Navbar";
import Masthead from "./components/Masthead";
import Features from "./components/Features";
import Footer from "./components/Footer";
import { Launcher } from "react-chat-window";
import toastr from "toastr";

import logo from "./theme/img/your_next_vacation.png";

import "toastr/build/toastr.min.css";
import "./theme/vendor/bootstrap/css/bootstrap.min.css";
import "./theme/vendor/fontawesome-free/css/all.min.css";
import "./theme/vendor/simple-line-icons/css/simple-line-icons.css";
import "./theme/css/landing-page.min.css";

class App extends Component {
  // TODO::obscure these from client-accessible code
  _server = "https://mighty-peak-97805.herokuapp.com/api/";
  _username = "adminuser";
  _password = "adminpass";
  constructor() {
    super();
    // Create a reference - we will save the chat window here
    this.chatWindow = React.createRef();
    this.state = {
      messageList: []
    };
  }

  componentDidMount = () => {
    window.addEventListener("beforeunload", this._handleLeavePage);
    const messageHistoryJSON = localStorage.getItem("messageHistory");
    // Restore chat history from browser
    if (messageHistoryJSON) {
      const messageHistory = JSON.parse(messageHistoryJSON);
      this.setState({ messageList: messageHistory.messageList });
    }
  };

  _handleLeavePage = () => {
    // Save history to browser
    const messageHistory = {
      messageList: this.state.messageList
    };
    localStorage.setItem("messageHistory", JSON.stringify(messageHistory));
  };

  _triggerChatWindow = event => {
    if (this.chatWindow.current.state.isOpen) {
      return;
    }
    this.chatWindow.current.handleClick();
    const formData = new FormData(event.target);
    const term = formData.get("term");

    let message = {
      author: null,
      type: "text",
      data: { text: null }
    };

    if (term !== "") {
      message.author = "me";
      message.data.text = term;
      this.setState({
        messageList: [...this.state.messageList, message]
      });
      this._onMessageWasSent(message);
    } else if (this.state.messageList.length === 0) {
      message.author = "them";
      message.data.text = "Hello! I am Ionut. How can I help you today?";
      this.setState({
        messageList: [...this.state.messageList, message]
      });
    }
  };

  _onMessageWasSent = message => {
    this.setState({
      messageList: [...this.state.messageList, message]
    });

    fetch(this._server + message.data.text, {
      // mode: "no-cors",
      credentials: "include",
      headers: new Headers({
        Authorization: "Basic " + btoa(`${this._username}:${this._password}`)
      })
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        if (data && data.success === true) {
          const receivedMessage = {
            author: "Ionut",
            data: {},
            type: null
          };

          // Text message
          if (data.type === 1) {
            receivedMessage.data = {
              text: data.message
            };
            receivedMessage.type = "text";
          } else if (data.type === 2) {
            receivedMessage.data = {
              content: data.message
            };
            receivedMessage.type = "emoji";
          } else {
            // TODO:: implement other types of messgaes as well
            toastr.error("Not yet implemented");
          }

          setTimeout(() => {
            this.setState({
              messageList: [...this.state.messageList, receivedMessage]
            });
          }, 1400);
        } else {
          console.error(data.error);
          toastr.error("An error has occurred: " + data.error);
        }
      })
      .catch(err => {
        console.error(err);
        toastr.error("An error has occurred: " + err);
      });
  };

  _handleNavigate = event => {
    event.preventDefault();
    toastr.warning("Coming soon...");
  };

  render() {
    return (
      <div className="App">
        <Navbar handleNavigate={this._handleNavigate} />

        <Masthead
          placeholder="Enter your destination..."
          disabled={false}
          handleSubmit={this._triggerChatWindow}
        />

        <Features />

        <Footer
          handleNavigate={this._handleNavigate}
          facebookHref="http://facebook.com/"
        />

        <Launcher
          ref={this.chatWindow}
          agentProfile={{
            teamName: "Ionut",
            imageUrl: logo
          }}
          onMessageWasSent={this._onMessageWasSent}
          messageList={this.state.messageList}
          showEmoji={true}
        />
      </div>
    );
  }
}

export default App;
