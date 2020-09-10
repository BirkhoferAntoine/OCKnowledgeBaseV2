import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import KnowledgeBase from './KnowledgeBase';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MemoryRouter><KnowledgeBase/></MemoryRouter>, div);
  ReactDOM.unmountComponentAtNode(div);
});
