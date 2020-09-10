import React, {Component} from 'react';
import { Button, Input, Container, Card, CardBody, CardFooter, CardHeader, CardGroup, Col, Form, FormGroup,
    Row, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import DOMPurify from 'dompurify';
import he from 'he';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

class Delete extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };
    constructor(props) {
        super(props);
        this.loading    = this.loading.bind(this);
        this.pagination = this.pagination.bind(this);
        this.strDivider = this.strDivider.bind(this);
        this.pageSwitch = this.pageSwitch.bind(this);
        this.isDisabled = this.isDisabled.bind(this);
        this.returnHTML = this.returnHTML.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        const {cookies} = props;
        this.state = {
            token: cookies.get('token') || null,
            hasError:       false,
            page:           props.data,
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
        const contentFetch  = 'https://ockb.rongeasse.com/api/v1/get?id=' + id;

        fetch(contentFetch)
            .then((resContent) => {
                return resContent.json();
            })
            .then((contentJson) => {

                const decode   = he.decode(contentJson[0].content);
                const sanitize = DOMPurify.sanitize(decode);

                this.setState({
                    page: contentJson[0],
                    pagesArray: this.strDivider(sanitize),
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
        if (window.confirm("Confirmer la suppression?")) {

            const data = new FormData(event.target);
            let dataObject = {};

            data.forEach((value, key) => {
                dataObject[key] = value
            });

            const token = this.state.token;
            const urlPost = `https://ockb.rongeasse.com/api/v1/delete?content=${dataObject.id}`;
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
                        window.location.replace("/#/dashboard/editor/edit");
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
                                            <Card className={'card-accent-primary mb-0'}
                                                  style={{border: `2px outset ${color}`, minHeight: '70vh'}} >
                                                <CardHeader className="d-flex flex-wrap flex-column card"
                                                            style={{borderBottom: `2px outset ${color}`, backgroundColor: color}}>
                                                    <h4 className="categoryHeader align-self-center">{page.title} </h4>
                                                    <span className="align-self-end">{formatedDate}</span>
                                                </CardHeader>
                                                <CardBody>
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
                            <Row>
                                <Col xs="12" sm="18">
                                    <Card>
                                        <CardHeader>
                                            <strong>Supprimer le billet</strong>
                                        </CardHeader>
                                        <CardBody>
                                            <Form className="deletePostForm" onSubmit={this.handleSubmit}>
                                                <FormGroup>
                                                    <div className="form-actions">
                                                        <CardFooter className={'d-flex justify-content-center'}>
                                                            <Input type="hidden" id="deletePostId"
                                                                   value={page.id} name="id" />
                                                            <Button type="submit" size="sm" color="danger">
                                                                <i className="fa fa-ban"/> Supprimer
                                                            </Button>
                                                        </CardFooter>
                                                    </div>
                                                </FormGroup>
                                            </Form>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                        </div>
                    </Container>
                </div>

            );
        }
    }
}

export default withCookies(Delete);