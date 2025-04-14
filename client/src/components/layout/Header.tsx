import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';

export interface HeaderProps {
  drawerWidth: number;
  onMenuClick: () => void;
  open?: boolean; // Added to support other versions of MainLayout
  handleDrawerToggle?: () => void; // Added to support other versions of MainLayout
}

const Header: React.FC<HeaderProps> = ({ 
  drawerWidth, 
  onMenuClick,
  handleDrawerToggle, // Added to support other versions of MainLayout
}) => {
  // Use handleDrawerToggle if provided, otherwise use onMenuClick
  const handleMenuClick = handleDrawerToggle || onMenuClick;

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleMenuClick}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Wondrlab Cross-Sell
        </Typography>
        <Box>
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;