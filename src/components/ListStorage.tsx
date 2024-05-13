import React, {useState, useEffect, useContext} from 'react';
import {listAll, ref, getDownloadURL} from 'firebase/storage';
import {storage} from '../firebase';
import {Box, CircularProgress, List} from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ListItemText from "@mui/material/ListItemText";
import {useAuthState} from 'react-firebase-hooks/auth';
import {auth} from '../firebase';
import {DataContext} from "../contexts/ModelData";



// @ts-ignore
const StorageFilesList = ({onSendLink}) => {
    // const [files, setFiles] = useState([]);
    // const [loading, setLoading] = useState(true);

    const [files, setFiles] = useState<string[]>([]);
    const [user, loading, error] = useAuthState(auth);

    const updateLink = (link:String) => {
        console.log("send from list:", link)
        onSendLink(link)
    }

    useEffect(() => {
        if (user) {
            const listFiles = async () => {
                const userFolderRef = ref(storage, `glb/${user.uid}`);
                try {
                    const result = await listAll(userFolderRef);
                    const fileUrls = await Promise.all(result.items.map(item => `${item.fullPath}`));
                    setFiles(fileUrls);
                } catch (error) {
                    console.error("Error listing files:", error);
                    setFiles([]);
                }
            };

            listFiles();
        }
    }, [user]);

    if (loading) {

        return (
            // @ts-ignore
            <Box sx={{display: 'flex'}}>
                <CircularProgress/>
            </Box>
        );
    }
    if (error) {
        // @ts-ignore
        return (
            <Box sx={{display: 'flex'}}>
                error
            </Box>
        );
    }

    return (
        <React.Fragment>
            <List component="nav">
                {
                    files.length > 0 ? (
                        <>
                            {files.map((url, index) => (
                                <ListItemButton key={index} onClick={()=> updateLink(url)} >
                                    <ListItemText primary={url.split('/').pop()} />
                                </ListItemButton>
                            ))}
                        </>
                    ) : (
                        <p>No remote files</p>
                    )
                }

            </List>
        </React.Fragment>
    )

};

export default StorageFilesList;
