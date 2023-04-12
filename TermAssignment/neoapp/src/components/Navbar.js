import { AppBar, Toolbar, Typography } from '@mui/material';
import { blue } from '@mui/material/colors';

//https://mui.com/api/app-bar/
function Navbar() {
  return (
    <AppBar position="static" sx={{ bgcolor: blue[500] }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Neo
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar