import React from "react";
import "./App.css";
import axios from "axios";
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
import faker from "faker";

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
      data: [1],
    };
  }
  async componentDidMount() {
    let response = await this.fetchData();
    this.setState({data: response});
  }

  fetchData = async () => {
    let data = { commodity: "AMERICAN-COTTON", mandi_name: "ADAMPUR" };
    let response = await axios.post(`http://127.0.0.1:8000/polls/`, data);
    response = JSON.parse(JSON.stringify(response.data));
    return response;
  };

  render() {
      const options = {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Chart.js Line Chart',
              },
            },
          };
    let x_axis = this.state.data.reduce((prev, current) => {
      return [...prev, current.timeStr];
    },[]);
    let y_axis = this.state.data.reduce((prev, current) => {
      return [...prev, current.value];
    }, []);

    console.log("X-Axis", x_axis);
    console.log("Y-Axis", y_axis);

    const data = {
      type: 'line',
      labels: x_axis,
      datasets: [
        {
          label: 'Dataset',
          data: y_axis,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        }
      ],
    };

    return (
      <Line options={options} data={data} />
      // <div>
      //   <table>
      //     <tr>
      //       <th>Date</th>
      //       <th>Value</th>
      //     </tr>
      //     {this.state.data.map((item) => (
      //       <tr>
      //         <td>{item.timeStr}</td>
      //         <td>{item.value}</td>
      //       </tr>
      //     ))}
      //   </table>
      // </div>
    );
  }
}

export default App;
