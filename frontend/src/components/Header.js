import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import HelpButton from '../components/HelpButton'
import IconButton from '@mui/material/IconButton';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import GitHubIcon from '@mui/icons-material/GitHub';

export default function Header() {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="link"
                            sx={{ mr: 2 }}
                        >
                            <AccountCircleIcon />
                        </IconButton>
                        AeroDict
                    </Typography>
                    <HelpButton
                        size="large"
                        edge="start"
                        color="inherit"
                        arialabel="link"
                        sx={{ mr: 2 }}

                    >
                    </HelpButton>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="github"
                        sx={{ mr: 2 }}
                        href="https://github.com/"
                    >
                        <GitHubIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
        </Box>
    );
}