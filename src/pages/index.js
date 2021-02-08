import React from "react"

import SEO from "../components/seo"
import './index.css';

const IndexPage = () => (
  <>
    <SEO title="Home" />
    <iframe title="bg" id="bg" src='https://giuliovaccari.it/testsito/pointcloud.html' frameBorder="0" loading="lazy"/>
    <div style={{height:"5000px"}}>ciao
    </div>
  </>
)

export default IndexPage
