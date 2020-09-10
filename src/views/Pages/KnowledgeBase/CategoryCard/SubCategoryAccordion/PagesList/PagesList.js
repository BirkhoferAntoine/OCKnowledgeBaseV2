import React, { Component } from 'react';
import { ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText } from 'reactstrap';
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import DOMPurify from 'dompurify';
import he from 'he';


class PagesList extends Component {

    constructor(props) {
        super(props);
        this.returnHTML = this.returnHTML.bind(this);
        this.state = {
            pageData:       props.pageData,
            pagesList:      [],
            id:             props.pageData.id,
            title :         props.pageData.title,
            category:       props.pageData.category,
            content:        props.pageData.content.substring(0 , 100) + ('... '),
            date:           new Date(props.pageData.date),
            location:       props.location,
        };

    }

    returnHTML(content) {
        const decode        = he.decode(content);
        const sanitize      = DOMPurify.sanitize(decode);
        return {__html: sanitize}
    }

    render() {

        const { id, title, category, date, content, location } = this.state;
        const itemId        = title + '-' + id
        const pathname      = location.pathname + '/page/' + category;
        const search        = 'title=' + title + '&id=' + id;
        const formatedDate  = new Intl.DateTimeFormat()
            .format(date);
        const titleSanitized  = DOMPurify.sanitize(he.decode(title));

        return (

            <ListGroup>
                <ListGroupItem id={itemId}>
                    <ListGroupItemHeading>
                        <Link to={{
                            pathname: pathname,
                            search: search,
                        }}> {titleSanitized}
                        </Link>
                    </ListGroupItemHeading>
                    <ListGroupItemText
                        dangerouslySetInnerHTML={this.returnHTML(content)}>
                    </ListGroupItemText>
                    <ListGroupItemText className="mt-2">
                        {formatedDate}
                    </ListGroupItemText>
                </ListGroupItem>
            </ListGroup>
        );
    }
}

export default withRouter(PagesList);
