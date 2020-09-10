import React, {Component} from 'react';
import { Container, Card, CardBody, CardFooter, CardHeader, CardGroup, Col,
       Row, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import { withRouter } from "react-router";
import DOMPurify from 'dompurify';
import he from 'he';

class KnowledgePage extends Component {

    constructor(props) {
        super(props);

        this.loading    = this.loading.bind(this);
        this.pagination = this.pagination.bind(this);
        this.strDivider = this.strDivider.bind(this);
        this.pageSwitch = this.pageSwitch.bind(this);
        this.isDisabled = this.isDisabled.bind(this);
        this.returnHTML = this.returnHTML.bind(this);
        this.state = {
            hasError:       false,
            page:           props.data,
            background:     null,
            pagesArray:     [],
            currentPage:    0,
            lastPage:       0,
            isLoaded:       false,
            color:          'primary'
        };
    }

    componentDidMount() {

        const {location}    = this.props;
        const params        = new URLSearchParams(location.search);
        const title         = params.get("title");
        const id            = params.get("id");
        const contentFetch  = `https://ockb.rongeasse.com/api/v1/get?id=${id}`;

        fetch(contentFetch)
            .then((resContent) => {
                return resContent.json();
            })
            .then(async (contentJson) => {

                const decode   = he.decode(contentJson[0].content);
                const sanitize = DOMPurify.sanitize(decode);

                const background = await contentJson[0].image;
                if (background !== null) {
                    const imgFetch  = `https://ockb.rongeasse.com/api/v1/getimage?image=${background}`;
                    await fetch(imgFetch)
                        .then((resImg) => {
                            if (resImg.status === 200) {
                                return resImg.json();
                            } else {
                                return false;
                            }
                        })
                        .then(async (imgJson) => {
                            if (imgJson !== false) {
                                const image = new Image();
                                image.src   = await imgJson.src;
                            document.getElementById('backgroundTarget')
                                .style.backgroundImage = await image;
                            }
                        })
                        .catch((e) => {
                        });
                }

                this.setState({
                    page: contentJson[0],
                    pagesArray: this.strDivider(sanitize),
                    isLoaded: true,
                })
            })
            .catch((e) => {
                this.setState({
                    hasError: e
                })
            });

    }

    loading() {
        return <div className="animated fadeIn pt-3 text-center">
            Loading...
        </div>;
    }

    pagination(event) {
        let button = event.target;

        if (!button.id) {
            button = button.parentElement;
        }

        let loadPage = this.pageSwitch(button.id);
        this.setState({
            currentPage: loadPage
        })
    }

    pageSwitch(button) {
        switch (button) {
            case ('firstPage') :
                return 0;
            case ('previousPage') :
                return (this.state.currentPage) -1;
            case ('nextPage') :
                return (this.state.currentPage) +1;
            case ('lastPage') :
                return this.state.lastPage -1;
            default: return 0;
        }
    }

    isDisabled(button) {

        if (((button === 'prev') &&
            (this.state.currentPage > 0)) ||
            ((button === 'next') &&
                (this.state.currentPage < this.state.lastPage))) {
            return false;
        }
        return true;
    }

    strDivider(content) {
        let arrayOfStrings = [];
        let minLength = 0;
        let maxLength = 1000;

        while (content.length >= maxLength) {
            arrayOfStrings.push(
                content.substring(minLength, maxLength)
                + '...');
            minLength += 1000;
            maxLength += 1000;
        }

        if (content.length < maxLength) {
            arrayOfStrings.push(content)
        }

        this.setState({
            lastPage: arrayOfStrings.length
        })
        return arrayOfStrings;
    }

    returnHTML() {
        const { currentPage, pagesArray } = this.state;
        return {__html: pagesArray[currentPage]}
    }

    render() {

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

            const { currentPage, page } = this.state;
            const color         = 'primary';
            const date          = new Date(page.date);
            const formatedDate  = new Intl.DateTimeFormat().format(date);

            return (

                <div className="app flex-row align-items-center flex-column">
                    <Container className="my-0 mx-auto p-0">
                        <div className="animated fadeIn">
                            <Row className="justify-content-center">
                                <Col md="12">
                                    <CardGroup className="animated fadeIn">
                                        <React.Suspense fallback={this.loading()}>
                                                <Card className={'card-accent-primary mb-0 knowledgePage'}
                                                      style={{border: `2px outset ${color}`}} >
                                                    <CardHeader className="d-flex flex-wrap flex-column card"
                                                                style={{borderBottom: `2px outset ${color}`, backgroundColor: color}}>
                                                        <h4 className="categoryHeader align-self-center">{page.title} </h4>
                                                        <span className="align-self-end">{formatedDate}</span>
                                                    </CardHeader>
                                                <CardBody className="cardBody" id="backgroundTarget">
                                                <article dangerouslySetInnerHTML={this.returnHTML()}/>
                                            </CardBody>
                                                    <CardFooter className={'d-flex justify-content-center p-0'}>
                                                        <Pagination onClick={this.pagination}>
                                                            <PaginationItem>
                                                                <PaginationLink id={'firstPage'} first />
                                                            </PaginationItem>
                                                            <PaginationItem>
                                                                <PaginationLink id={'previousPage'} previous
                                                                                disabled={this.isDisabled('prev')}/>
                                                            </PaginationItem>
                                                            <PaginationItem>
                                                                <PaginationLink id={'currentPage'} disabled>
                                                                    {currentPage + 1}
                                                                </PaginationLink>
                                                            </PaginationItem>
                                                            <PaginationItem>
                                                                <PaginationLink id={'nextPage'} next
                                                                                disabled={this.isDisabled('next')}/>
                                                            </PaginationItem>
                                                            <PaginationItem>
                                                                <PaginationLink id={'lastPage'} last />
                                                            </PaginationItem>
                                                        </Pagination>
                                                    </CardFooter>
                                                </Card>
                                        </React.Suspense>
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

export default withRouter(KnowledgePage);
