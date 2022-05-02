import React from "react";
import "./App.css";
import Dropdown from "./actionbar";
import Header from "./header";
import axios from "axios";
import _ from "lodash";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      selected_mandi: "",
      selected_commodity: "",
      meta_data: [],
      commodities: [],
      mandi_names: [],
      is_loading: false,
      prediction_value: "",
      is_prediction_positive: false,
      interval:["daily","weekly","monthly"],
      selected_interval: ""
    };
  }

  handleDropdownSelection = (dropdown_name, value) => {
    //     console.log("Value: ", value);
    if (dropdown_name === "Mandi") {
      let commodities_for_selected_mandi = this.state.meta_data[value];
      this.setState({
        selected_mandi: value,
        commodities: commodities_for_selected_mandi,
      });
    } else if (dropdown_name === "Commodity") {
      this.setState({ selected_commodity: value });
    }
    else if(dropdown_name === "Interval"){
          this.setState({selected_interval:value});
    }
  };

  async componentDidMount() {
    //     console.log("Calling Component did mount!!");
    //     let response = await this.fetchData();
    //     this.setState({data: response});
    let response = await this.fetchMetaData();
  }

  fetchData = async () => {
    //     let data = { commodity: "AMERICAN-COTTON", mandi_name: "ADAMPUR" };
    if (this.state.selected_commodity && this.state.selected_mandi) {
      let data = {
        commodity: this.state.selected_commodity,
        mandi_name: this.state.selected_mandi,
        interval:this.state.selected_interval,
      };
      this.setState({ is_loading: true }, async () => {
        //   console.log("Fetching data now!!");
        let response = await axios.post(`http://127.0.0.1:8000/polls/`, data);
        response = JSON.parse(JSON.stringify(response.data));
      
        let prediction_value = response.at(-1).value;
        let current_day_value = response.at(-2).value;
        let is_prediction_positive = false;
        if (prediction_value > current_day_value) {
          is_prediction_positive = true;
        }
        this.setState({
          data: response,
          is_loading: false,
          prediction_value: prediction_value,
          is_prediction_positive,
        });
      });
    } else {
      alert("Please select valid input");
    }
  };

  fetchMetaData = async () => {
    let response = await axios.get("http://127.0.0.1:8000/polls/meta/");
    let list_of_mandi_name = [];
    for (let [key, value] of Object.entries(response.data)) {
      list_of_mandi_name.push(key);
    }
    //     console.log("hello", list_of_mandi_name);
    this.setState({
      meta_data: response.data,
      mandi_names: list_of_mandi_name,
    });
  };
  render() {
    //     console.log("Inside Render!!", this.state);
    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Prediction Chart",
        },
      },
    };
    let x_axis = this.state.data.reduce((prev, current) => {
      return [...prev, current.timeStr];
    }, []);
    let y_axis = this.state.data.reduce((prev, current) => {
      return [...prev, current.value];
    }, []);

    //     console.log("X-Axis", x_axis);
    //     console.log("Y-Axis", y_axis);

    const data = {
      type: "line",
      labels: x_axis,
      datasets: [
        {
          label: "Dataset",
          data: y_axis,
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
      ],
    };
    let main_component = <div></div>;
    if (this.state.is_loading) {
      main_component = (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            flexDirection: "column",
          }}
        >
          <CircularProgress />
          <p>Loading data ...</p>
        </Box>
      );
    } else if (!this.state.is_loading && !_.isEmpty(this.state.data)) {
      
      main_component = <Line options={options} data={data} />;
    }
    let prediction_color = "#fdeded";
    if (this.state.is_prediction_positive) {
      prediction_color = "#edf7ed";
    }

    //     console.log("Main component: ", main_component);
    return (
      <div>
        <Header />
        <div className="tool_bar">
          <div className="actionbox_container">
            {" "}
            {!_.isEmpty(this.state.meta_data) && (
              <div className="actionbar">
                <Dropdown
                  handleDropdownSelection={this.handleDropdownSelection}
                  options={this.state.mandi_names}
                  label_name="Mandi"
                />
                <Dropdown
                  handleDropdownSelection={this.handleDropdownSelection}
                  options={this.state.commodities}
                  label_name="Commodity"
                />
                 <Dropdown
                  handleDropdownSelection={this.handleDropdownSelection}
                  options={this.state.interval}
                  label_name="Interval"
                />
                <Button onClick={this.fetchData} variant="contained">
                  Predict
                </Button>
              </div>
            )}
          </div>
          {this.state.is_loading === false && !_.isEmpty(this.state.data) && (
            <div
              className="prediction_container"
              style={{ backgroundColor: `${prediction_color}` }}
            >
              <h4 className="prediction_heading">Prediction</h4>
              <p className="prediction_value">{this.state.prediction_value}</p>
            </div>
          )}
        </div>
        {main_component}
      </div>
    );
  }
}

export default App;
