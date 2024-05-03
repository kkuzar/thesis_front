import React, {useState, useEffect} from 'react';
import {listAll, ref, getDownloadURL} from 'firebase/storage';
import {storage} from '../firebase';
import {Box, CircularProgress, List} from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ListItemText from "@mui/material/ListItemText";
import {useAuthState} from 'react-firebase-hooks/auth';
import {auth} from '../firebase';


const StorageFilesList = () => {
    // const [files, setFiles] = useState([]);
    // const [loading, setLoading] = useState(true);

    const [files, setFiles] = useState<string[]>([]);
    const [user, loading, error] = useAuthState(auth);

    useEffect(() => {
        if (user) {
            const listFiles = async () => {
                const userFolderRef = ref(storage, `uploads/${user.uid}`);
                try {
                    const result = await listAll(userFolderRef);
                    const fileUrls = await Promise.all(result.items.map(item => `File: ${item.fullPath}`));
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
                                <ListItemButton key={index}>
                                    {url.split('/').pop()}
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