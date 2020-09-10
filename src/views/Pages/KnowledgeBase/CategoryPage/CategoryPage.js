import React, {Component} from 'react';
import { Container, CardGroup, Col, Row } from 'reactstrap';
import { withRouter } from "react-router";
import {isEmptyValue} from "enzyme/src/Utils";
import CategoryCard from '../CategoryCard/CategoryCard'

class CategoryPage extends Component {

    constructor(props) {
        super(props);
        this.categoryCardsBuilder   = this.categoryCardsBuilder.bind(this);
        this.contentSorter          = this.contentSorter.bind(this);
        this.loading                = this.loading.bind(this);
        this.state = {
            hasError:       false,
            page:           props.data,
            pagesArray:     [],
            currentPage:    0,
            lastPage:       0,
            isLoaded:       false,
            color:          'primary',
            content:            [],
            categories:         [],
            knowledgeCards:     [],
        };
    }

    async componentDidMount() {

        const { match }  = this.props;
        const category   = match.params.search;
        const contentFetch      =
            await fetch(`http://ockbase/api/v1/get?category=${category}`);
        const categoriesFetch   =
            await fetch(`http://ockbase/api/v1/get?category_name=${category}`);

        Promise.all([ contentFetch, categoriesFetch ])
            .then(async ([ resContent, resCategories ]) =>
                Promise.all(
                    [ await resContent.json(),
                        await resCategories.json()])
            )
            .then(async ([ contentJson, categoriesJson ]) => {

                const sortedContent    = await this.contentSorter(contentJson, categoriesJson)
                const knowledgeCards   = await this.categoryCardsBuilder(categoriesJson, sortedContent)

                await this.setState({
                    content:        contentJson,
                    categories:     categoriesJson,
                    knowledgeCards: knowledgeCards,
                    isLoaded:       true,
                })

                if (isEmptyValue(this.state.content)) {
                    console.log('Erreur du chargement du contenu')
                }
                if (isEmptyValue(this.state.categories)) {
                    console.log('Erreur du chargement des categories')
                }
            })
            .catch((e) => {
                this.setState({
                    hasError: e
                })
            });

    }

    async categoryCardsBuilder(categories, content) {
        const categoryCards = []

        for (let [key, value] of Object.entries(content)) {

            categoryCards.push(
                <CategoryCard data={value}
                              key={key} />)
        }

        return categoryCards;
    }

    async contentSorter(content, categories) {
        const contentObj  = {}

        for (const category of categories)
        {
            const categoryName          = await category['category_name']
            contentObj[categoryName]    = await content.filter(
                page =>
                    page['category'] === categoryName
            )
            contentObj[categoryName]['details'] = await category
        }
        return contentObj
    }

    loading() {
        return <div className="animated fadeIn pt-3 text-center">
            Loading...
        </div>;
    }

    render() {

        if (this.state.hasError) {
            return (
                <div>Erreur!</div>
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

        }

        else {
            const { knowledgeCards } = this.state

            return (
                <div className="app flex-row align-items-center">
                    <Container className="m-auto">
                        <div className="animated fadeIn">
                            <Row className="justify-content-center">
                                <Col className="p-4" md="12">
                                    <CardGroup className="animated fadeIn">
                                        <React.Suspense fallback={this.loading()}>
                                            {
                                                knowledgeCards
                                            }
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

export default withRouter(CategoryPage);
