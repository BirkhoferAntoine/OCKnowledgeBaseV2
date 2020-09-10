import React, { Component } from 'react';
import { Badge, Card, CardBody, CardHeader, Col } from 'reactstrap';
import SubCategoryAccordion from "./SubCategoryAccordion";

class CategoryCard extends Component {

    constructor(props) {
        super(props);
        this.toggleAccordion    = this.toggleAccordion.bind(this);
        this.accordionMaker     = this.accordionMaker.bind(this);
        this.subCategorySorter  = this.subCategorySorter.bind(this);
        this.state = {
            data:           props.data,
            details:        props.data.details,
            color:          props.data.details.category_color,
            countPages:     props.data.length,
            accordions:     this.accordionMaker(
                                props.data,
                                props.data.details
            ),
        };
    }

    accordionMaker(data, details) {

        const subCategories         = this.subCategorySorter(data);
        const accordionRows         = [];
        const subCatToggleArray     = [];
        let i = 0;

        for (let [subCategory, pages] of Object.entries(subCategories))
        {
            const key = details.category_name + '-'
                + subCategory + '-'
                + i;

            subCatToggleArray.push(false);

            accordionRows.push(
                <SubCategoryAccordion
                    accordionNumber={i}
                    accordionTitle={subCategory}
                    pagesData={pages}
                    subCatToggleArray={subCatToggleArray}
                    key={key} />
                );

            i++;
        }

        return accordionRows
    }

    subCategorySorter(data) {
        return data.reduce(
            (subCategoriesAccumulator, page) =>
            {
                const folderTitle = page['sub_category']
                if (folderTitle in subCategoriesAccumulator)
                {
                    return {...subCategoriesAccumulator,
                        [folderTitle]:
                            (subCategoriesAccumulator[folderTitle]
                                .concat(page))}
                }
                return {...subCategoriesAccumulator,
                    [folderTitle]:
                        [page]}
            },
            {}
        );
    }

    toggleAccordion(tab) {

        const prevState = this.state.accordionToggleArray;
        const state = prevState.map((x, index) => tab === index ? !x : false);

        this.setState({
            accordionToggleArray: state,
        });
    }

    render() {

        const { details, color, countPages, accordions} = this.state;
        
        return (
            <Col xs="16" sm="8" md="6" className={'mt-2 cardDiv'}>
                <Card id={`catCard${details.id}`} className={'mb-0'} style={{border: `2px solid ${color}`}} >
                    <CardHeader className="d-flex no-wrap justify-content-center flex-lg-row card"
                                style={{border: `none`, backgroundColor: color}}>
                        <div className={'d-flex align-items-baseline align-self-center'} >
                        <h4 className="categoryHeader text-white">{details.category_name} </h4>
                            <div className="card-header-actions">
                                <Badge pill style={{backgroundColor: `rgba(0,0,0,0.1)`}} className="float-right text-white"> {countPages} </Badge>
                            </div>
                        </div>

                    </CardHeader>
                    <CardBody>
                        {accordions}
                    </CardBody>
                </Card>
            </Col>
        );
    }
}

export default CategoryCard;
