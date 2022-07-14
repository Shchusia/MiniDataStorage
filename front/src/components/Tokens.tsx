import React from 'react'
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {getAccessToken, getFullProject} from "../store/reducers/globalReducer";
import {getProject} from "../store/middlewares/projects";
import {getHeaders} from "../utils/utils";
import {Token} from "../types/apiTypes";
import TableTokens from "./TableTokens";
import DialogNewToken from "./DialogNewToken";

export interface TokenProps {
    projectId: number
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const TabPanel = (props: TabPanelProps) => {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{p: 3}}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const a11yProps = (index: number) => {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const splitTokensByType = (tokens: Token[] | undefined): Token[][] => {
    if (tokens === undefined) {
        return [[], []]
    }
    const readTokens: Token[] = []
    const writeTokens: Token[] = []
    for (const token of tokens) {
        if (token.isWrite) {
            writeTokens.push(token)
        } else {
            readTokens.push(token)
        }
    }
    return [readTokens, writeTokens]
}


const Tokens = (props: TokenProps) => {
    const [t,] = useTranslation('translation');

    const [value, setValue] = React.useState(0);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    const project = useSelector(getFullProject(props.projectId))
    const dispatcher: Function = useDispatch();
    const at = useSelector(getAccessToken)


    React.useEffect(() => {
        if (project === undefined) {
            dispatcher(getProject({data: {projectId: props.projectId}, headers: getHeaders(at as string)}))
        }
    }, [])
    const [readTokens, writeTokens] = splitTokensByType(project?.tokens)
    return <React.Fragment>
        {/*tokens {props.projectId}*/}
        {/*{}*/}
        <Box sx={{width: '100%'}}>
            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label={t("Write Tokens")} {...a11yProps(0)} />
                    <Tab label={t("Read Tokens")} {...a11yProps(1)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <DialogNewToken projectId={props.projectId} isWrite={true}/><br/>
                <TableTokens projectId={props.projectId} tokens={writeTokens} isWriteTokens/>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <DialogNewToken projectId={props.projectId} isWrite={false}/><br/>
                <TableTokens  projectId={props.projectId} tokens={readTokens}/>
            </TabPanel>
        </Box>

    </React.Fragment>
}

export default Tokens