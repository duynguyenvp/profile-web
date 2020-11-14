import React from "react";
import loadable from "@loadable/component";
import { Skeleton } from "antd";
import { Switch, Route } from "react-router-dom";

const Loading = () => <Skeleton active />;
const LoadableHomeComponent = loadable(() => import("../pages/home"), {
  fallback: <Loading />
});
const LoadablePersonalInfoComponent = loadable(
  () => import("../pages/personal-info"),
  {
    fallback: <Loading />
  }
);
const LoadableAccountComponent = loadable(() => import("../pages/account"), {
  fallback: <Loading />
});
const LoadableServiceComponent = loadable(() => import("../pages/service"), {
  fallback: <Loading />
});
const LoadableRoleComponent = loadable(() => import("../pages/role"), {
  fallback: <Loading />
});
const LoadablePostComponent = loadable(() => import("../pages/post"), {
  fallback: <Loading />
});
const LoadableFeedbackComponent = loadable(() => import("../pages/feedback"), {
  fallback: <Loading />
});
const LoadableNotFoundComponent = loadable(() => import("../pages/404"), {
  fallback: <Loading />
});

export default () => (
  <div style={{ padding: 24, background: "#fff" }}>
    <Switch>
      <Route exact path="/quan-tri/">
        <LoadableHomeComponent />
      </Route>
      <Route exact path="/quan-tri/personal-info">
        <LoadablePersonalInfoComponent />
      </Route>
      <Route exact path="/quan-tri/account">
        <LoadableAccountComponent />
      </Route>
      <Route exact path="/quan-tri/service">
        <LoadableServiceComponent />
      </Route>
      <Route exact path="/quan-tri/role">
        <LoadableRoleComponent />
      </Route>
      <Route exact path="/quan-tri/post">
        <LoadablePostComponent />
      </Route>
      <Route exact path="/quan-tri/feedback">
        <LoadableFeedbackComponent />
      </Route>
      <Route path="/quan-tri/*">
        <LoadableNotFoundComponent />
      </Route>
    </Switch>
  </div>
);
