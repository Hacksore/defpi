import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
  root: {
   background: 'rgba(0, 0, 0, 0)'
  },
  button: {
    display: 'block',
    backkground: '#000'
  },
  typography: {
    padding: theme.spacing(2),
  },
}));

export default function SimplePopover(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <Button aria-describedby={id} variant="contained" onClick={handleClick}>
        DEV
      </Button>
      <Popover
        classes={{
          paper: classes.root
        }}
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Button    
          variant="contained"
          color="primary"
          fullWidth={true}
          className={classes.button}>Change Channel
        </Button>
        <Button           
          variant="contained"
          color="primary"
          fullWidth={true}
          className={classes.button}
          onClick={props.fetchData}
        >
          SCAN
        </Button>
        <Button           
          variant="contained"
          color="primary"
          fullWidth={true}
          className={classes.button}
          onClick={handleClose}
        >
          Cancel
        </Button>
      </Popover>
    </div>
  );
}
