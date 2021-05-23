import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {Typography,makeStyles} from '@material-ui/core'

const useStyles = makeStyles(theme =>({
    dialog:{
        position:'absolute',
        width : '400px',
    },
    dialogTitle:{
        textAlign:'center',
        color : 'yellow',
    },
    dialogContent:{
        textAlign:'center'
    },
    dialogAction:{
        position:'center',
        textAlign:'center'
    },

}));
export default function ConfirmDialog( props ) {
    const close = () =>{
        setConfirmDialog({ ...confirmDialog,
            isOpen:false
        })
    }
const {confirmDialog,setConfirmDialog} = props;
const classes = useStyles()
    return (
        <Dialog open={confirmDialog.isOpen} 
        classes={{paper:classes.dialog}} 
        onClose={close}
        >
            <DialogTitle className={classes.dialogTitle}>
            <Typography variant="h3">
                    {confirmDialog.title}
                </Typography>
            </DialogTitle>

            <DialogContent className={classes.dialogContent}>
                
                <Typography variant="subtitle2">
                    {confirmDialog.subTitle}
                </Typography>
            </DialogContent>

            <DialogActions className={classes.dialogAction}>
                <Button onClick={close} color="primary" autoFocus>
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    )
}
