import React, { Component } from "react";
import App from "../../Client/pages/home/App";
import Blog from "../../Client/pages/blog-v2/partials/Blog";

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
