import React from "react"
import { useRef } from 'react'; 

import { createMuiTheme, ThemeProvider, makeStyles } from '@material-ui/core/styles';

import Link from '@material-ui/core/Link';
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
      overflow: "hidden",
    },
  },

  bg:{
    margin: 0,
    height: "100%",
    overflow: "hidden",
    width: "100%",
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
    marginLeft: "5px",
    marginRight: "auto",
    textAlign: "center",
    overflow: "hidden",
    [`${theme.breakpoints.up('xs')} and (orientation: landscape)`]: {
      top: "20vw",
      marginLeft: "50%",
      textAlign: "left",
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
    position: "relative",
  },

  about:{
    position: "relative",
    minHeight: "100vh",
    overflow: "hidden",
    width: "100%",
    [`${theme.breakpoints.up('xs')} and (orientation: portrait)`]: {
      overflowX: "scroll"
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
      overflow: "hidden",
      height: "100%",
      width: "80%",
    },
  },

  contenutoAbout:{
    height: "100%",
    backgroundColor: "transparent",
    color: "white",
    display: "table",
    position:"absolute",
    width: "100%",
    [`${theme.breakpoints.up('xs')} and (orientation: portrait)`]: {
      width: "200%",
      overflowX: "scroll"
    },
  },

  listaAbout: {
    position: "relative",
    display: "table-cell",
    verticalAlign: "middle",
    margin: "0 auto",
    width: "70%",
    right: 0,
    [`${theme.breakpoints.up('xs')} and (orientation: portrait)`]: {
      width: "40%",
      paddingRight: "5%"
    },
  }

});

function IndexPage() {
  const classes = useStyles();
  const aboutRef = useRef(null);
  const scrollToAbout = () => {
    aboutRef.current.scrollIntoView({ behavior: 'smooth' })
  };
    return(
    <>
      <ThemeProvider theme={theme}>
        <SEO title="Home" />
          <div style={{height:"100%"}}>
            <div className={classes.copertina}>
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
              <iframe title="bg" className={classes.bg} src='https://giuliovv.github.io/testsito/pointcloud.html' frameBorder="0" loading="lazy"/>
            </div>
          </div>
          <div className={classes.socialBasso}>
            <SocialIcons />
          </div>
          <div id="about" className={classes.about}>
            <div id="contenutoAbout" className={classes.contenutoAbout}>
              <div className={classes.testoAbout}>
                <Typography variant="h1" style={{fontSize: "26.5vh"}}>ABOUT</Typography>
              </div>
              <IconButton aria-label="scrollRight" className={classes.scrollRight} onClick={() => scrollToAbout()}>
                <KeyboardArrowRightIcon style={{fill:"white"}}/>
              </IconButton>
              <ul className={classes.listaAbout} ref={aboutRef}>
                <li><Typography variant="body1" gutterBottom>Born 20.01.1998</Typography></li>
                <li><Typography variant="body1" gutterBottom>Marostica - Milano</Typography></li>
                <li><Typography variant="body1" gutterBottom>Automation Engineering @Politecnico di Milano 2017-2020</Typography></li>
                <li><Typography variant="body1" gutterBottom> MSc Automation Engineering @Politecnico di Milano 2020-2022</Typography></li>
                <li><Typography variant="body1" gutterBottom> Runner-up NASA Space Apps Challenge 2018, Founder <Link color="primary" href="www.airhive.it">Airhive</Link></Typography></li>
                <li><Typography variant="body1" gutterBottom> President and Founder <Link color="primary" href="https://www.aeapolimi.it">AEA</Link></Typography></li>
              </ul> 
            </div>
          </div>
      </ThemeProvider>
    </>
  )
}

export default IndexPage
