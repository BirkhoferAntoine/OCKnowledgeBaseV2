import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, Collapse } from 'reactstrap';
import PagesList from "./PagesList";
import { withRouter } from "react-router";


class SubCategoryAccordion extends Component {

    constructor(props) {
        super(props);
        this.toggleAccordion    = this.toggleAccordion.bind(this);
        this.processPages       = this.processPages.bind(this);
        this.state = {
            number:                 props.accordionNumber,
            title:                  props.accordionTitle,
            pagesData:              props.pagesData,
            pagesList:              this.processPages(
                props.pagesData , props.title),
            subCatToggleArray:      props.subCatToggleArray,
        };

    }

    processPages(pages, title)
    {
        const pagesListArray = [];
        let i = 0;

        for (const page of pages)
        {
            i++;
            const key = 'pagesList-' + title + '-' + i;
            pagesListArray.push(
                <PagesList key={key} pageData={page} />
            )
        }
        return pagesListArray
    }

    toggleAccordion(tab) {

        const prevState = this.state.subCatToggleArray;
        const state = prevState.map((x, index) => tab === index ? !x : false);

        this.setState({
            subCatToggleArray: state,
        });
    }

    render() {

        const { number , title, pagesList } = this.state;

        return (
            <Card className="mb-0">
                <CardHeader id={`heading-${title}`}>
                    <Button block color="link" className="text-left m-0 p-0"
                            onClick={() => this.toggleAccordion(number)}
                            aria-expanded={this.state.subCatToggleArray[number]}
                            aria-controls={`collapse${number}`}>

                        <h5 className="m-0 p-0">{title}</h5>

                    </Button>
                </CardHeader>

                <Collapse isOpen={this.state.subCatToggleArray[number]}
                          data-parent={`#${title}-accordion`}
                          id={`collapse${number}`}
                          aria-labelledby={`heading${title}`}>

                    <CardBody>
                            {pagesList}
                    </CardBody>
                </Collapse>
            </Card>
        );
    }
}

export default withRouter(SubCategoryAccordion);
