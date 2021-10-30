import React from "react";
import Header from "./Header";
import { Container } from "semantic-ui-react";

const Layout = ({ children }) => (
  <Container>
    <Header />
    {children}
  </Container>
);

export default Layout;
