import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import ImageUploader from 'react-images-upload';
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    Form,
    FormGroup,
    Row,
} from 'reactstrap';

class Upload extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    constructor(props) {
        super(props);
        this.onDrop         = this.onDrop.bind(this);
        this.handleSubmit   = this.handleSubmit.bind(this);
        const { cookies }   = props;
        this.state = {
                pictures: [],
                token: cookies.get('token') || null,
        };
    }

    onDrop(picture) {
        this.setState({
            pictures: this.state.pictures.concat(picture),
        });
    }

    async handleSubmit(event) {
        event.preventDefault();
        const pictures  = this.state.pictures[0];
        const data      = new FormData();
        data.append('images', pictures);

        const token     = this.state.token;
        const urlPost   = 'https://ockb.rongeasse.com/api/v1/upload';
        const headers   = new Headers();
        headers.append('Authorization', token);

        const init = {
            method: 'POST',
            headers,
            mode: 'cors',
            body: data
        };

        fetch(urlPost, init)
            .then((response) => {
                if (response.status === 201) {
                    window.location.replace("/#/dashboard/images/gallery");
                    return window.location.reload(true);
                }
                if (response.status === 401) {
                    const { cookies } = this.props;
                    cookies.remove('token');
                    alert(response.json());
                    window.location.replace("/#/login");
                    return window.location.reload(true);
                }
            })
            .then((text) => {
            })
            .catch((e) => {
                alert(`Erreur lors de la transmission  , ${e}`)
            });
    }

    render() {
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12" sm="18">
                        <Card>
                            <CardHeader>
                                <strong>Héberger une nouvelle image</strong>
                            </CardHeader>
                            <CardBody>
                                <Form id="hostImageForm" onSubmit={this.handleSubmit} noValidate>
                                    <FormGroup className={"d-flex flex-column justify-content-evenly"}>
                                        <ImageUploader
                                            withIcon={true}
                                            buttonText='Choose images'
                                            onChange={this.onDrop}
                                            imgExtension={['.jpg', 'jpeg', '.gif', '.png', '.bmp']}
                                            maxFileSize={5242880}
                                        />
                                        <div className="form-actions d-flex justify-content-center m-2">
                                            <Button type="submit" color="primary">Envoyer</Button>
                                        </div>
                                    </FormGroup>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default withCookies(Upload);
