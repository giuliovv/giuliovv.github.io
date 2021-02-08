import React from "react"
import { useRef } from 'react'; 

import { createMuiTheme, ThemeProvider, makeStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';

import red from '@material-ui/core/colors/red';
import green from '@material-ui/core/colors/green';

import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';

import "typeface-montserrat"
// import 'fontsource-roboto';

import SEO from "../components/seo"
import SocialIcons from "../components/SocialIcons"
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
  [`${theme.breakpoints.up('sm')} and (orientation: landscape)`]: {
    fontSize: '8rem',
  },
  [`${theme.breakpoints.down('sm')} and (orientation: landscape)`]: {
    fontSize: '10vw',
  },
};

theme.typography.h2 = {
  fontSize: '22vw',
  [`${theme.breakpoints.up('lg')} and (orientation: landscape)`]: {
    fontSize: '9rem',
  },
  [`${theme.breakpoints.down('sm')} and (orientation: landscape)`]: {
    fontSize: '11vw',
  },
  [`${theme.breakpoints.down('lg')} and (orientation: landscape)`]: {
    fontSize: '11vw',
  },
};

const useStyles = makeStyles({

  copertina: {
    width: "100%",
    height: "100vh",
    backgroundColor: "transparent",
    position: "relative",
    color: "white",
    bottom: 0,
    top: 0,
    [`${theme.breakpoints.up('xs')} and (orientation: portrait)`]: {
      // width: "200%",
      // overflowX: "scroll",
    },
  },

  bg:{
    margin: 0,
    height: "100%",
    overflow: "hidden",
    width: "50%",
    marginTop: -100,
    left: 0,
    zIndex: 1,
    [`${theme.breakpoints.up('xs')} and (orientation: landscape)`]: {
      width: "70%",
      marginTop: 0,
    },
  },

  titolo:{
    color:"white",
    zIndex: 200,
    position: "absolute",
    bottom: 0,
    marginLeft: "auto",
    marginRight: "auto",
    textAlign: "center",
    [`${theme.breakpoints.up('xs')} and (orientation: landscape)`]: {
      top: "20vw",
      marginLeft: "50%",
      textAlign: "left",
    },
  },

  testoHome:{
    display: "none",
     [`${theme.breakpoints.up('xs')} and (orientation: portrait)`]: {
      height: "100%",
      display: "block",
      transform: "rotate(90deg)",
      color: "white",
      position: "absolute",
      textAlign: "left",
      right: 60,
      bottom: 5,
    },
  },

  socialAlto:{
    display: "none",
    [`${theme.breakpoints.up('xs')} and (orientation: landscape)`]: {
      display: "block",
    },
    right: 10,
    zIndex: 200,
    position: "absolute",
  },

  socialBasso:{
    display: "block",
    [`${theme.breakpoints.up('xs')} and (orientation: landscape)`]: {
      display: "none",
    },
    width: "100%",
    // backgroundColor: "white",
    position: "relative",
  },

  about:{
    position: "relative",
    minHeight: "100vh",
    overflowX: "scroll",
    overflowY: "hidden",
    width: "100%",
    [`${theme.breakpoints.up('xs')} and (orientation: portrait)`]: {
      width: "200%",
    },
  },

  testoAbout:{
    height: "100%",
    display: "block",
    transform: "rotate(-90deg)",
    color: "white",
    position: "absolute",
    textAlign: "left",
    left: 30,
    bottom: 0,
  },

  scrollRight:{
    display:"none",
    [`${theme.breakpoints.up('xs')} and (orientation: portrait)`]: {
      display:"block",
      position:"absolute",
      height: "100%",
      width: "80%",
    },
  },

  contenutoAbout:{
    height: "100%",
    backgroundColor: "transparent",
    color: "white",
    display: "table",
    [`${theme.breakpoints.up('xs')} and (orientation: portrait)`]: {
      position:"absolute",
      width: "50%",
      right: 0,
      backgroundColor: "transparent"
    },
  },

  listaAbout: {
    position: "relative",
    display: "table-cell",
    verticalAlign: "middle",
    left: 90,
    right: 0,
  }

});

function IndexPage() {
  const classes = useStyles();
  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const scrollToAbout = () => {
    aboutRef.current.scrollIntoView({ behavior: 'smooth' })
  };
  const scrollToHome = () => {
    homeRef.current.scrollIntoView({ behavior: 'smooth' })
  };
    return(
    <>
      <ThemeProvider theme={theme}>
        <SEO title="Home" />
          <div style={{height:"100%"}}>
            <div className={classes.copertina} ref={homeRef}>
              <div className={classes.socialAlto}>
                <SocialIcons />
              </div>
              <div className={classes.titolo}>
                <div>
                  <Typography display="inline" variant="h1">GIULIO</Typography>
                </div>
                <div style={{marginTop: "-15px"}}>
                  <Typography display="inline" variant="h2">VACCARI</Typography>
                </div>
              </div>
              <iframe title="bg" className={classes.bg} src='https://giuliovaccari.it/testsito/pointcloud.html' frameBorder="0" loading="lazy"/>
              <div className={classes.testoHome}>
                <IconButton aria-label="scrollLeft" className={classes.scrollRight} onClick={() => scrollToHome()}>
                  <KeyboardArrowRightIcon style={{fill:"white", transform: "rotate(90deg)"}}/>
                </IconButton>
                <Typography variant="h1" style={{fontSize: "26.5vh"}}>HOME</Typography>
              </div>
            </div>
          </div>
          <div className={classes.socialBasso}>
            <SocialIcons />
          </div>
          <div id="about" className={classes.about}>
              <div className={classes.testoAbout}>
                <Typography variant="h1" style={{fontSize: "26.5vh"}}>ABOUT</Typography>
              </div>
              <IconButton aria-label="scrollRight" className={classes.scrollRight} onClick={() => scrollToAbout()}>
                <KeyboardArrowRightIcon style={{fill:"white"}}/>
              </IconButton>
              <div id="contenutoAbout" ref={aboutRef} className={classes.contenutoAbout}>
                <ul className={classes.listaAbout}>
                  <li><Typography variant="body1" gutterBottom>Coffee</Typography></li>
                  <li><Typography variant="body1" gutterBottom>Coffee</Typography></li>
                  <li><Typography variant="body1" gutterBottom>Coffee</Typography></li>
                </ul> 
              </div>
          </div>
      </ThemeProvider>
    </>
  )
}

export default IndexPage
