import React, { Component } from "react";
import {
  PieChart,
  Pie,
  Legend,
  Cell,
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar
} from "recharts";
import toastr from "toastr";
import firebase from "firebase";

class PageContent extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.database = firebase.database();
    this.COLORS = [
      "#007bff",
      "#6610f2",
      "#6f42c1",
      "#e83e8c",
      "#dc3545",
      "#fd7e14",
      "#ffc107",
      "#28a745",
      "#20c997",
      "#17a2b8",
      "#6c757d",
      "#343a40",
      "#007bff",
      "#6c757d",
      "#28a745",
      "#17a2b8",
      "#ffc107",
      "#dc3545",
      "#f8f9fa",
      "#343a40"
    ];
    this.state = {
      data: [],
      attractionsNum: 0,
      usersNum: 0,
      responsesNum: 0,
      conversationsNum: 0
    };
  }
  componentWillMount = async () => {
    let attractionsNum = 0,
      usersNum = 0,
      responsesNum = 0,
      conversationsNum = 0;
    try {
      const dataSnapshot = await this.database.ref().once("value");
      const frequencyMap = {};
      const val = dataSnapshot.val();
      const attractions = val.attractions;
      for (let key in attractions) {
        attractionsNum++;
        if (typeof frequencyMap[attractions[key].category] === "undefined") {
          frequencyMap[attractions[key].category] = 1;
        } else {
          frequencyMap[attractions[key].category]++;
        }
      }
      const dataArray = [];
      for (let key in frequencyMap) {
        if (key !== "" && frequencyMap[key] > 20) {
          dataArray.push({ name: key, value: frequencyMap[key] });
        }
      }
      for (let key in val.responses) {
        responsesNum++;
      }
      for (let key in val.conversations) {
        conversationsNum++;
      }
      for (let key in val.users) {
        usersNum++;
      }
      this.setState({
        data: dataArray,
        attractionsNum,
        usersNum,
        responsesNum,
        conversationsNum
      });
    } catch (e) {
      toastr.error(e);
    }
  };
  render() {
    return (
      <div className="col-md-10 offset-md-2">
        <div className="row">
          <div className="col-md-12">
            <h1>Your next vacation Admin Area</h1>
            <p>Here entities can be created, edited, etc.</p>
          </div>
          <div className="col-md-3">
            <div className="card text-white bg-primary mb-3 col-md-12">
              <div className="card-header">Attractions</div>
              <div className="card-body">
                <h5 className="card-title">{this.state.attractionsNum}</h5>
                <p className="card-text">
                  Attractions in the application, such as resorts, restaurants,
                  museums etc.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-white bg-warning mb-3 col-md-12">
              <div className="card-header">Users</div>
              <div className="card-body">
                <h5 className="card-title">{this.state.usersNum}</h5>
                <p className="card-text">
                  The number of users having active accounts in the app.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-white bg-danger mb-3 col-md-12">
              <div className="card-header">Responses</div>
              <div className="card-body">
                <h5 className="card-title">{this.state.responsesNum}</h5>
                <p className="card-text">
                  How many users have rated their favourite attractions.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-white bg-success mb-3 col-md-12">
              <div className="card-header">Conversations</div>
              <div className="card-body">
                <h5 className="card-title">{this.state.conversationsNum}</h5>
                <p className="card-text">
                  The number of conversations Ionut had with users, both on
                  Facebook and in the Web App.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <h4>Attractions by category</h4>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Legend verticalAlign="top" height={36} />
                <Pie
                  data={this.state.data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  fill="#82ca9d"
                  label
                >
                  {this.state.data.map((entry, index) => (
                    <Cell fill={this.COLORS[index % this.COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="col-md-6">
            <h4>Attractions by category</h4>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart width="100%" height={350} data={this.state.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value">
                  {this.state.data.map((entry, index) => (
                    <Cell fill={this.COLORS[index % this.COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  }
}
export default PageContent;
