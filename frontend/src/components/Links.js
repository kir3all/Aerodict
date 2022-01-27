import * as React from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container'
export default function Footer() {
    return <footer className='footer'>
        {/* <Container maxWidth='lg'> */}
        <Grid container spacing={1} justifyContent="center" alignItems="flex-start">
            <Grid item xs={6} sm={4}>
                <Box borderBottom={2}>Creator's Media</Box>
                <Box>
                    <Link href="https://github.com/yak152" color="inherit">
                        GitHub
                    </Link>
                </Box>
                <Box>
                    <Link href="https://t.me/yak152" color="inherit">
                        Telegram
                    </Link>
                </Box>
            </Grid>
        </Grid>
        {/* </Container> */}
    </footer >
}