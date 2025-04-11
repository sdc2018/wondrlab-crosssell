import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box
} from '@mui/material';
import {
  Menu as MenuIcon
} from '@mui/icons-material';

interface AppHeaderProps {
  open: boolean;
  toggleDrawer: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ open, toggleDrawer }) => {
  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        transition: (theme) => theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="toggle drawer"
          onClick={toggleDrawer}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Wondrlab Cross-Sell Opportunity Management
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;
