import React, { Component } from "react";
import App from "../../Client/App";
import Blog from "../../Client/pages/blog/partials/Blog";

class BlogPage extends Component {
  render() {
    return (
      <React.Fragment>
        <App>
          <Blog />
        </App>
      </React.Fragment>
    );
  }
}

export default BlogPage;
