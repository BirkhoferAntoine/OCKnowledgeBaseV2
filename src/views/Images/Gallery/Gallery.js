import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import {
    Carousel, CarouselCaption, CarouselControl, CarouselIndicators, CarouselItem,
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    Form,
    Input,
    Row, Container, CardGroup,
} from 'reactstrap';

class Gallery extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    constructor(props) {
        super(props);
        this.handleSubmit   = this.handleSubmit.bind(this);
        this.next           = this.next.bind(this);
        this.previous       = this.previous.bind(this);
        this.goToIndex      = this.goToIndex.bind(this);
        this.onExiting      = this.onExiting.bind(this);
        this.onExited       = this.onExited.bind(this);
        const { cookies } = props;
        this.state = {
            pictures: [],
            activeIndex: 0,
            items: [],
            token: cookies.get('token') || null,
            isLoaded: false,
        };
    }

    async componentDidMount() {

        const imagesFetch  = 'https://ockb.rongeasse.com/api/v1/images';

        await fetch(imagesFetch)
            .then((resImgs) => {
                return resImgs.json();
            })
            .then(async (imgsJson) => {

                const items = [];

                await imgsJson.forEach((imgStr) => {
                    items.push({
                        src:        imgStr.src,
                        altText:    imgStr.title,
                        caption:    imgStr.title
                    });
                })

                await this.setState({
                    items: items,
                    isLoaded: true,
                });
            })
            .catch((e) => {
                this.setState({
                    hasError: e
                })
            });

    }

    handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        let dataObject = {};

        data.forEach((value, key) => {
            dataObject[key] = value
        });

        if (window.confirm("Voulez-vous supprimer cette image? " + dataObject.image)) {

            const token = this.state.token;
            const urlPost = `https://ockb.rongeasse.com/api/v1/deleteimage?image=${dataObject.image}`;
            const headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', token)

            const init = {
                method: 'DELETE',
                headers,
                mode: 'cors',
                body: JSON.stringify(dataObject)
            };

            fetch(urlPost, init)
                .then((response) => {
                    if (response.status === 200) {
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
    }

    onExiting() {
        this.animating = true;
    }

    onExited() {
        this.animating = false;
    }

    next() {
        if (this.animating) return;
        const nextIndex = this.state.activeIndex === this.state.items.length - 1 ? 0 : this.state.activeIndex + 1;
        this.setState({ activeIndex: nextIndex });
    }

    previous() {
        if (this.animating) return;
        const nextIndex = this.state.activeIndex === 0 ? this.state.items.length - 1 : this.state.activeIndex - 1;
        this.setState({ activeIndex: nextIndex });
    }

    goToIndex(newIndex) {
        if (this.animating) return;
        this.setState({ activeIndex: newIndex });
    }

    render() {


        const {activeIndex, items} = this.state;

        const deleteImgForm = (imgName) => {
            return (
                <Form className="deleteImgForm" onSubmit={this.handleSubmit}>
                    <div className="form-actions 'd-flex justify-content-center'">
                        <Input type="hidden" id="deleteImgName"
                               value={imgName} name="image"/>
                        <Button type="submit" size="sm" color="danger">
                            <i className="fa fa-ban"/> Supprimer
                        </Button>
                    </div>
                </Form>
            )
        };

        const slides = items.map((item) => {
            return (
                <CarouselItem
                    onExiting={this.onExiting}
                    onExited={this.onExited}
                    key={item.altText}
                >
                    <img className="d-block w-100 carouselImg" src={item.src} alt={item.altText}/>
                    <CarouselCaption className="d-block" captionHeader={item.caption} captionText={deleteImgForm(item.caption)}/>
                </CarouselItem>
            );
        });
        if (this.state.hasError) {
            return (
                <div>Erreur du chargement du contenu</div>
            )
        }

        if (!this.state.isLoaded) {

            return (
                <div className="isLoading d-flex justify-content-center">
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            )

        } else {

            return (
                <div className="app flex-row align-items-center flex-column">
                    <Container className="my-0 mx-auto p-0">
                        <div className="animated fadeIn">
                            <Row className="justify-content-center">
                                <Col md="12">
                                    <CardGroup className="animated fadeIn">
                                    <Card className="carouselCard">
                                        <CardHeader>
                                            <i className="fa fa-align-justify"/><strong>Carousel</strong>
                                        </CardHeader>
                                        <CardBody>
                                            <Carousel activeIndex={activeIndex} next={this.next}
                                                      previous={this.previous}>
                                                <CarouselIndicators items={items} activeIndex={activeIndex}
                                                                    onClickHandler={this.goToIndex}/>
                                                {slides}
                                                <CarouselControl direction="prev" directionText="Previous"
                                                                 onClickHandler={this.previous}/>
                                                <CarouselControl direction="next" directionText="Next"
                                                                 onClickHandler={this.next}/>
                                            </Carousel>
                                        </CardBody>
                                    </Card>
                                    </CardGroup>
                                </Col>
                            </Row>
                        </div>
                    </Container>
                </div>
            );
        }
    }
}

export default withCookies(Gallery);
