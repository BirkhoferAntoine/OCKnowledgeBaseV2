import React, { Component } from 'react';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';




class Login extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    constructor(props) {
        super(props);
        const { cookies } = props;
        this.handleSubmit   = this.handleSubmit.bind(this);
        this.login          = this.login.bind(this);
        this.state = {
            loginName: '',
            loginPass: '',
            redirect: false,
            token: cookies.get('token') || null
        }
    }

    async handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        let dataObject = {};

        data.forEach(
            (value, key) =>
            {dataObject[key] = value});


        const urlPost   = 'https://ockb.rongeasse.com/api/v1/login';

        const init = {
            method: 'POST',
            body: data
        };

        await fetch(urlPost, init)
            .then(async (response) => {
                const json = await response.json()
                if (response.status === 301) this.login(json);
                if (response.status === 401) return await json; // or .text() or .blob() ...
            })
            .then((text) => {
                const feedback = document.getElementById('loginFeedback')
                feedback.textContent        = text
                feedback.style.visibility   = "visible"
            })
            .catch((e) => {
                alert(`Erreur lors de la transmission  , ${e}`)
            });
    }

    login(token)
    {
        const { cookies } = this.props;
        cookies.set('token', token, { path: '/', secure: true });
        window.location.replace("/#/dashboard");
        window.location.reload(true);
    }
    
  render() {
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card id="loginCard" className="p-4">
                  <CardBody className="m-2">
                    <Form id="loginForm" onSubmit={this.handleSubmit}>
                      <h1>Connexion</h1>
                      <p className="text-muted">Connectez vous à votre compte</p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"/>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="text" name="user_name" id="username" required
                               placeholder="Utilisateur" autoComplete="username" />
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"/>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="password" name="password" id="password" required
                               placeholder="Mot de passe" autoComplete="current-password" />
                      </InputGroup>
                        <InputGroup className="d-flex justify-content-center">
                            <Button type="submit" color="primary" className="px-4 m-4">
                                Envoyer
                            </Button>
                        </InputGroup>
                    </Form>
                      <div id="loginFeedback" className="d-flex text-center justify-content-center text-danger"> </div>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default withCookies(Login);
