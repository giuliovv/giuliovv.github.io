import React from "react"

import { createMuiTheme, ThemeProvider, makeStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';

import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';

import "typeface-montserrat"
// import 'fontsource-roboto';

import SEO from "../components/seo"
import './index.css';


const theme = createMuiTheme({
  palette: {
    primary: {
      main: red[500],
    },
    secondary: {
      main: green[500],
    },
  },
});


theme.typography.h1 = {
  fontSize: '29vw',
  [theme.breakpoints.up('md')]: {
    fontSize: '8rem',
  },
};

theme.typography.h2 = {
  fontSize: '22vw',
  [theme.breakpoints.up('md')]: {
    fontSize: '8rem',
  },
};

const useStyles = makeStyles({

  bg:{
    margin: 0,
    height: "100%",
    overflow: "hidden",
    position: "absolute",
    width: "100%",
    marginTop: -100,
    left: 0,
    zIndex: 1,
    [`${theme.breakpoints.up('sm')} and (orientation: landscape)`]: {
      width: "70%",
      marginTop: 0,
    },
  },

  titolo:{
    color:"white",
    zIndex: 200,
    position: "absolute",
    bottom: 0,
    width: "100%",
    marginLeft: "auto",
    marginRight: "auto",
    textAlign: "center",
    [`${theme.breakpoints.up('sm')} and (orientation: landscape)`]: {
      top: "20vw",
      marginLeft: "50%",
      textAlign: "left",
    },
  }

});

function IndexPage() {
  const classes = useStyles();
    return(
    <>
      <ThemeProvider theme={theme}>
        <SEO title="Home" />
        <div id="copertina">
          <div className={classes.titolo}>
            <div>
              <Typography display="inline" variant="h1">GIULIO</Typography>
            </div>
            <div>
              <Typography display="inline" variant="h2">VACCARI</Typography>
            </div>
          </div>
          <iframe title="bg" className={classes.bg} src='https://giuliovaccari.it/testsito/pointcloud.html' frameBorder="0" loading="lazy"/>
        </div>
        {/* <div style={{height:"5000px"}}>ciao
        </div> */}
      </ThemeProvider>
    </>
  )
}

export default IndexPage
