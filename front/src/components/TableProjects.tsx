import React from 'react'
import {useDispatch, useSelector} from "react-redux";
import {getAccessToken, getProjects, getRefreshToken} from "../store/reducers/globalReducer";
import {useNavigate} from "react-router";
import {styled, useTheme} from '@mui/material/styles';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import {
    Collapse,
    Paper,
    Table,
    TableBody,
    TableContainer,
    TableFooter,
    TableHead,
    TablePagination,
    TableRow,
} from "@mui/material";
import TableCell, {tableCellClasses} from '@mui/material/TableCell';
import {TinyProject, TinyProjects} from "../types/apiTypes";
import Button from "@mui/material/Button";
import {useTranslation} from "react-i18next";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {routes} from "../configs/routes";
import Tokens from "./Tokens";
import {getHeaders} from "../utils/utils";
import {deleteProject, restoreProject} from "../store/apiFunctions/projectMiddleware";

interface TablePaginationActionsProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (
        event: React.MouseEvent<HTMLButtonElement>,
        newPage: number,
    ) => void;
}

export const TablePaginationActions = (props: TablePaginationActionsProps) => {
    const theme = useTheme();
    const {count, page, rowsPerPage, onPageChange} = props;

    const handleFirstPageButtonClick = (
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{flexShrink: 0, ml: 2.5}}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon/> : <FirstPageIcon/>}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowRight/> : <KeyboardArrowLeft/>}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft/> : <KeyboardArrowRight/>}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon/> : <LastPageIcon/>}
            </IconButton>
        </Box>
    );
}

const sortProjects = (projects: TinyProjects): TinyProject[] => {
    console.log(projects)
    const actual = Object.values(projects).filter(element => {
        return element.isDeleted === false
    });
    const deleted = Object.values(projects).filter(element => {
        return element.isDeleted !== false
    });
    actual.sort((a: TinyProject, b: TinyProject) => {
        if (a.projectId < b.projectId) return -1
        if (a.projectId > b.projectId) return 1
        return 0
    })
    deleted.sort((a: TinyProject, b: TinyProject) => {
        if (a.projectId < b.projectId) return -1
        if (a.projectId > b.projectId) return 1
        return 0
    })
    const result = actual.concat(deleted)
    return result
}
export const StyledTableCell = styled(TableCell)(({theme}) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.info.contrastText,
        // color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 15,
    },
}));

export const StyledTableRow = styled(TableRow)(({theme}) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));


const TableRowSuperCustom = (row: TinyProject) => {
    const [t,] = useTranslation('translation');

    const navigator = useNavigate()
    const [open, setOpen] = React.useState(false);
    const dispatcher: Function = useDispatch();
    const at = useSelector(getAccessToken)
    const rt = useSelector(getRefreshToken)

    const clickDeleteRestore = () => {
        if (row.isDeleted) {

            dispatcher(restoreProject({
                    data: {
                        headers: getHeaders(at as string),
                        optional: {projectId: row.projectId}
                    },
                    accessToken: at as string,
                    refreshToken: rt as string
                }
            ))
        } else {
            dispatcher(deleteProject({
                    data: {
                        headers: getHeaders(at as string),
                        optional: {projectId: row.projectId}
                    },
                    accessToken: at as string,
                    refreshToken: rt as string
                }
            ))
        }
    }

    return (
        <React.Fragment>
            <StyledTableRow sx={{'& > *': {borderBottom: 'unset'}}}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row" align="left">
                    <Button
                        onClick={() => {
                            navigator(`${routes.project}/${row.projectId}`)
                        }}>
                        {row.projectTitle}
                    </Button>
                </TableCell>
                <TableCell align="right">
                    {row.projectManager}
                </TableCell>
                <TableCell align="right">
                    <Button variant="contained" color={row.isDeleted ? "warning" : "error"}
                            onClick={clickDeleteRestore}>
                        {row.isDeleted ? t("Restore") : t("Delete")}
                    </Button>
                </TableCell>
            </StyledTableRow>
            <StyledTableRow>
                <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{margin: 1}}>
                            <Tokens projectId={row.projectId}/>
                        </Box>
                    </Collapse>
                </TableCell>
            </StyledTableRow>
        </React.Fragment>
    )

}

const TableProjects = () => {
    const listProjects: TinyProject[] = sortProjects(useSelector(getProjects))
    const [t,] = useTranslation('translation');

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - listProjects.length) : 0;

    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    return (
        <TableContainer component={Paper}>
            <Table aria-label="custom pagination table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell></StyledTableCell>
                        <StyledTableCell align="left">{t("Title Project")}</StyledTableCell>
                        <StyledTableCell align="right">{t("Project Manager")}</StyledTableCell>
                        <StyledTableCell align="right">{t("Actions")}</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(rowsPerPage > 0
                            ? listProjects.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            : listProjects
                    ).map((row, index) => (
                        <TableRowSuperCustom {...row} key={`${row.projectTitle}_${row.projectId}_${index}`}/>
                    ))}
                    {emptyRows > 0 && (
                        <TableRow style={{height: 53 * emptyRows}}>
                            <TableCell colSpan={8}/>
                        </TableRow>
                    )}
                </TableBody>
                {listProjects.length > 5 ? (
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, {label: t('All'), value: -1}]}
                                colSpan={4}
                                count={listProjects.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                SelectProps={{
                                    inputProps: {
                                        'aria-label': t('rows per page'),
                                    },
                                    native: true,
                                }}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                ActionsComponent={TablePaginationActions}
                            />
                        </TableRow>
                    </TableFooter>) : (<></>)}
            </Table>
        </TableContainer>
    )
}

export default TableProjects;