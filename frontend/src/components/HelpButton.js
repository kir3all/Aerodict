import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import HelpIcon from '@mui/icons-material/Help';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const BootstrapDialogTitle = (props) => {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
};

BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
};

export default function CustomizedDialogs() {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <IconButton variant="outlined" onClick={handleClickOpen} size="large"
                edge="start"
                color="inherit"
                arialabel="link"
                sx={{ mr: 2 }}
            >
                <HelpIcon />
            </IconButton>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Что такое AeroDict?
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    <Typography gutterBottom>
                        АэроДикт - это веб-приложение, основной целью которого является популяризация космических наук в игровой форме.
                        Обучение осуществляется путём угадывания  фактов о некоторых космических явлениях, событиях и т.д. [Верю/Не верю]
                        Приложение разработано на JavaScript-библиотеке от Meta "React.js" с использованием набора Google-компонентов "MaterialUI".
                        Серверная часть Аэродикта построена на Python-веб фреймворке Flask, а работа с данными - на SQLite.
                    </Typography>
                    <Typography gutterBottom>
                        © 2022 AeroDict - Simple way to start exploring space!
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose}>
                        All right!
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </div>
    );
}