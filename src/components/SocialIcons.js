import React from "react"

import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';

import LinkedInIcon from '@material-ui/icons/LinkedIn';
import GitHubIcon from '@material-ui/icons/GitHub';
import TwitterIcon from '@material-ui/icons/Twitter';

function SocialIcons() {
      return(
        <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            >
                <Grid item>
                    <IconButton href="https://www.linkedin.com/in/giuliovaccari/" aria-label="linkedin">
                        <LinkedInIcon style={{fill:"white"}}/>
                    </IconButton>
                </Grid>
                <Grid item>
                    <IconButton href="https://www.github.com/giuliovv/" aria-label="github">
                        <GitHubIcon style={{fill:"white"}}/>
                    </IconButton>
                </Grid>
                <Grid item>
                    <IconButton href="https://twitter.com/GiulioVaccari" aria-label="twitter">
                        <TwitterIcon style={{fill:"white"}}/>
                    </IconButton>
                </Grid>
        </Grid>
    )
  }
  
  export default SocialIcons