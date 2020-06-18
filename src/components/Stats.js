import React, { Component } from "react";

import axios from "axios";
import classnames from "classnames";

import Chart from "chart.js";
import { Line } from "react-chartjs-2";
import { chartOptions, parseOptions, linechart } from "./charts/charts.js";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Form,
  FormGroup,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col,
} from "reactstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faKey,
  faWallet,
  faStar,
  faUsers,
  faCalendarAlt,
  faRedoAlt,
  faCoins,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";

export class Stats extends Component {
  state = {
    hasResponse: false,
    token: null,
    stats: {
      account: {
        address: null,
        first_in_time: null,
        last_out_time: null,
        active_delegations: null,
        full_balance: null,
        total_rewards_earned: null,
      },
      income: {
        cycle: null,
        bonds: [],
        total_bonds: null,
        average_return: null,
        start_time: null,
        end_time: null,
      },
    },
    linechartData: "data1",
  };

  // Intl.NumberFormat().format(
  //   Math.round(
  //     bonds.balance[bonds.balance.length - 1] * 100
  //   ) / 100
  //  )

  // new Intl.DateTimeFormat("en-US", {
  //   year: "numeric",
  //   month: "2-digit",
  //   day: "2-digit",
  //   hour: "2-digit",
  //   minute: "2-digit",
  //   second: "2-digit",
  // }).format(bonds.start_time[bonds.start_time.length - 1])}

  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    if (window.Chart) {
      parseOptions(Chart, chartOptions());
    }
  }

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  onSubmit = (e) => {
    e.preventDefault();

    axios
      .all([
        axios.get(
          `https://api.tzstats.com/explorer/account/${this.state.token}`
        ),
        axios.get(
          `https://api.tzstats.com/tables/income?address=${this.state.token}`
        ),
      ])
      .then(
        axios.spread((account, income) => {
          /* account response */
          const accountData = account.data;
          const incomeData = income.data;
          // find active cycle
          let i;
          for (i = incomeData.length - 1; i >= 0; i--) {
            // When total_bonds (index 22 of result Array) is not 0,
            // an active cycle is found.
            // 'i' will represent its position in the result Array
            if (incomeData[i][22] !== 0) break;
          }

          // create an array containing the bonds over time
          let bonds_over_time = [];
          let j;
          for (j = 0; j <= i; j++) {
            bonds_over_time.push(incomeData[j][22]);
          }

          // find tot bonds for average_return by
          // calculating the difference between consecutive bonds
          let tot = 0;
          let k;
          for (k = 1; k <= i; k++) {
            tot += incomeData[k][22] - incomeData[k - 1][22];
          }

          const active_cycle = incomeData[i];

          this.setState({
            hasResponse: true,
            stats: {
              account: {
                address: accountData.address,
                first_in_time: accountData.first_in_time
                  .replace("T", ", ")
                  .replace("Z", ""),
                last_out_time: accountData.last_out_time
                  .replace("T", ", ")
                  .replace("Z", ""),
                active_delegations: accountData.active_delegations,
                full_balance:
                  accountData.total_balance + accountData.frozen_rewards,
                total_rewards_earned: accountData.total_rewards_earned,
              },
              income: {
                cycle: active_cycle[1],
                bonds: bonds_over_time,
                total_bonds: active_cycle[22],
                average_return: tot / active_cycle[1],
                start_time: active_cycle[39],
                end_time: active_cycle[40],
              },
            },
          });
          console.log(this.state.stats);
          // console.log(accountData);
          // console.log(incomeData);
          // console.log(active_cycle);
        })
      )
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    const { hasResponse, stats } = this.state;

    const dashboard = (
      <div className="text-center mt--100">
        <Container fluid>
          <div className="header-body">
            <Row>
              <div className="col ml-4 mb-5">
                <h4>
                  <u>{stats.account.address}</u>
                </h4>
                <p>Joined {stats.account.first_in_time}</p>
              </div>
            </Row>
            <Row>
              <div className="col col-6">
                <Card className="card-lift--hover shadow border-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h6"
                          className="text-uppercase text-muted mb-0"
                        >
                          <u>Full Balance</u>
                        </CardTitle>
                        <span className="h4 font-weight-bold mb-0">
                          {stats.account.full_balance} XTZ
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                          <FontAwesomeIcon icon={faWallet} />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </div>

              <div className="col col-6">
                <Card className="card-lift--hover shadow border-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h6"
                          className="text-uppercase text-muted mb-0"
                        >
                          <u>Rewards Earned</u>
                        </CardTitle>
                        <span className="h4 font-weight-bold mb-0">
                          {stats.account.total_rewards_earned}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                          <FontAwesomeIcon icon={faStar} />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </div>
            </Row>
            <Row>
              <div className="col col-6 mt-5">
                <Card className="card-lift--hover shadow border-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h6"
                          className="text-uppercase text-muted mb-0"
                        >
                          <u>Active Delegations</u>
                        </CardTitle>
                        <span className="h4 font-weight-bold mb-0">
                          {stats.account.active_delegations}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                          <FontAwesomeIcon icon={faUsers} />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </div>

              <div className="col col-6 mt-5">
                <Card className="card-lift--hover shadow border-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h6"
                          className="text-uppercase text-muted mb-0"
                        >
                          <u>Last Active</u>
                        </CardTitle>
                        <span className="h4 font-weight-bold mb-0">
                          {stats.account.last_out_time}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                          <FontAwesomeIcon icon={faCalendarAlt} />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </div>
            </Row>
          </div>
          <hr />
          <div className="text-center mt-5">
            <Row>
              <Col className="mb-5 mb-xl-0" xl="8">
                <Card className="bg-gradient-default shadow">
                  <CardHeader className="bg-transparent">
                    <Row className="align-items-center">
                      <div className="col">
                        <h5 className="text-white mb-0">
                          <strong>Bonds</strong>{" "}
                          <small>
                            <p>over last 7 Cycles</p>
                          </small>
                        </h5>
                      </div>
                    </Row>
                  </CardHeader>
                  <CardBody>
                    {/* Chart */}
                    <div className="chart">
                      <Line
                        data={linechart[this.state.linechartData]}
                        options={linechart.options}
                        getDatasetAtEvent={(e) => console.log(e)}
                      />
                    </div>
                  </CardBody>
                </Card>
              </Col>

              <Col>
                <Card className="mb-3 shadow border-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h6"
                          className="text-uppercase text-muted mb-0"
                        >
                          <u>Deposit Time</u>
                        </CardTitle>
                        <span className="h6 font-weight-bold mb-0">
                          <p>
                            First Deposit:{" "}
                            {new Intl.DateTimeFormat("en-US", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            }).format(stats.income.start_time)}
                          </p>
                          <p>
                            Last Deposit:{" "}
                            {new Intl.DateTimeFormat("en-US", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            }).format(stats.income.end_time)}
                          </p>
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-default text-white rounded-circle shadow">
                          <FontAwesomeIcon icon={faCalendarAlt} />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
                <Card className="mb-3 shadow border-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h6"
                          className="text-uppercase text-muted mb-0"
                        >
                          <u>Cycle</u>
                        </CardTitle>
                        <span className="h6 font-weight-bold mb-0">
                          {stats.income.cycle}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-default text-white rounded-circle shadow">
                          <FontAwesomeIcon icon={faRedoAlt} />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
                <Card className="mb-3 shadow border-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h6"
                          className="text-uppercase text-muted mb-0"
                        >
                          <u>Total Bonds</u>
                        </CardTitle>
                        <span className="h6 font-weight-bold mb-0">
                          {stats.income.total_bonds}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-default text-white rounded-circle shadow">
                          <FontAwesomeIcon icon={faCoins} />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
                <Card className="mb-3 shadow border-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h6"
                          className="text-uppercase text-muted mb-0"
                        >
                          <u>Avg Bond Return</u>
                        </CardTitle>
                        <span className="h6 font-weight-bold mb-0">
                          {stats.income.average_return}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-default text-white rounded-circle shadow">
                          <FontAwesomeIcon icon={faChartLine} />
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    );

    const wait = (
      <div className="text-center mt--100">
        <img
          alt="..."
          className="img-fluid floating"
          src={require("../assets/img/address.png")}
        />
        <h6 className="ml-5 mt-5">Waiting for Token Address...</h6>
      </div>
    );

    return (
      <>
        <section className="section section-lg pt-lg-0 bg-gradient-default">
          <Container>
            <Row></Row>
            <Row className="justify-content-center mt-5">
              <Col lg="8">
                <Form onSubmit={this.onSubmit}>
                  <Card className="bg-gradient-secondary shadow">
                    <CardBody className="p-lg-5">
                      <h4 className="mb-1">Please enter a Token Address</h4>
                      <p className="mt-0 mb-0">
                        Enter your Token Address and click the button below.
                      </p>
                      <FormGroup
                        className={classnames({
                          focused: this.state.boxFocused,
                        })}
                      >
                        <InputGroup className="input-group-alternative">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <FontAwesomeIcon icon={faKey} />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            placeholder="Your Token Address"
                            autoComplete="false"
                            name="token"
                            type="text"
                            onChange={this.onChange}
                            onFocus={(e) => this.setState({ boxFocused: true })}
                            onBlur={(e) => this.setState({ boxFocused: false })}
                          />
                        </InputGroup>
                      </FormGroup>
                      <div>
                        <Button
                          block
                          className="btn-round"
                          color="default"
                          size="lg"
                          type="submit"
                        >
                          Submit
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                </Form>
              </Col>
            </Row>
          </Container>
          <div className="separator separator-bottom separator-skew zindex-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              version="1.1"
              viewBox="0 0 2560 100"
              x="0"
              y="0"
            >
              <polygon className="fill-white" points="2560 0 2560 100 0 100" />
            </svg>
          </div>
        </section>
        <section className="section section-lg pt-lg-0t">
          <Container>
            <Row className="justify-content-center mt-5 mb-5">
              <Col lg="12">{hasResponse ? dashboard : wait}</Col>
            </Row>
          </Container>
        </section>
      </>
    );
  }
}

export default Stats;
