import React, { Component } from "react";

import {
  Button,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
  UncontrolledTooltip,
} from "reactstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

export class Footer extends Component {
  render() {
    return (
      <>
        <footer className="footer bg-light">
          <Container>
            <Row className="align-items-center justify-content-md-between">
              <Col md="7">
                <div className=" copyright">
                  © {new Date().getFullYear()} gripep.
                </div>
              </Col>
              <Col className="pull-right text-lg btn-wrapper" md="2">
                <Button
                  className="btn-icon-only rounded-circle ml-8"
                  color="github"
                  href="https://github.com/gripep/tzstats"
                  id="tooltip495507257"
                  target="_blank"
                >
                  <span className="btn-inner">
                    <FontAwesomeIcon icon={faGithub} />
                  </span>
                </Button>
                <UncontrolledTooltip delay={0} target="tooltip495507257">
                  Check it out!
                </UncontrolledTooltip>
              </Col>
              <Col md="3">
                <Nav className=" nav-footer justify-content-end">
                  <NavItem>
                    <NavLink
                      href="https://tzstats.com/docs/api/index.html"
                      target="_blank"
                    >
                      Tezos API
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      href="https://github.com/gripep/tzstats/blob/master/LICENSE.md"
                      target="_blank"
                    >
                      MIT License
                    </NavLink>
                  </NavItem>
                </Nav>
              </Col>
            </Row>
          </Container>
        </footer>
      </>
    );
  }
}

export default Footer;
