import React from "react"

import SEO from "../components/seo"
import './index.css';

const IndexPage = () => (
  <>
    <SEO title="Home" />
    <div id="copertina">
      <iframe title="bg" id="bg" src='https://giuliovaccari.it/testsito/pointcloud.html' frameBorder="0" loading="lazy"/>
    </div>
    {/* <div style={{height:"5000px"}}>ciao
    </div> */}
  </>
)

export default IndexPage
