import { LinearProgress, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    position: 'fixed',
    height: '100vh',
    width: '100vw',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  barContainer: {
    width: '100%',
  },
});

export default function LoadingBar() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.barContainer}>
        <LinearProgress />
      </div>
    </div>
  );
}
