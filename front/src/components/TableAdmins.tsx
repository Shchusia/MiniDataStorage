import React from 'react'
import {AdminData} from "../types/apiTypes";
import {useTranslation} from "react-i18next";
import Typography from '@mui/material/Typography';
import {
    Paper,
    Table,
    TableBody,
    TableContainer,
    TableFooter,
    TableHead,
    TablePagination,
    TableRow
} from "@mui/material";
import TableCell from "@mui/material/TableCell";
import {StyledTableCell, StyledTableRow, TablePaginationActions} from "./TableProjects";
import Button from "@mui/material/Button";
import {useDispatch, useSelector} from "react-redux";
import {getAccessToken, getRefreshToken} from "../store/reducers/globalReducer";
import {getHeaders} from "../utils/utils";
import {deleteAdmin, restoreAdmin} from "../store/apiFunctions/adminMiddleware";

export interface TableadminsProps {
    admins: AdminData[]
}

const TableAdmins = (props: TableadminsProps) => {
    const [t,] = useTranslation('translation');
    const [page, setPage] = React.useState(0);

    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - props.admins.length) : 0;
    const dispatcher: Function = useDispatch();
    const at = useSelector(getAccessToken)
    const rt = useSelector(getRefreshToken)


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
    const clickDeleteRestoreAdmin = (adminId: number, isDeleted: boolean) => {
        if (isDeleted) {
            dispatcher(restoreAdmin({
                data: {
                    optional: {adminId: adminId},
                    headers: getHeaders(at as string)
                },
                accessToken: at as string,
                refreshToken: at as string,
            }))
        } else {
            dispatcher(deleteAdmin({
                data: {
                    optional: {adminId: adminId},
                    headers: getHeaders(at as string)
                }, accessToken: at as string,
                refreshToken: at as string,
            }))
        }
        // dispatcher(deleteToken({
        //     optional: {
        //         tokenId: tokenId,
        //         projectId: props.projectId
        //     },
        //     headers: getHeaders(at as string)
        // }))

    }

    if (props.admins.length === 0) {
        return <Typography variant="h5" gutterBottom component="div">
            {t("Empty list admins")}
        </Typography>
    }


    return (<React.Fragment>
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 500}} aria-label="custom pagination table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align="left">{t("Admin Name")}</StyledTableCell>
                            <StyledTableCell align="right">{t("Email")}</StyledTableCell>
                            <StyledTableCell align="right">{t("Actions")}</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(rowsPerPage > 0
                                ? props.admins.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : props.admins
                        ).map((row, index) => (
                            <StyledTableRow key={`${row.adminId}_${index}`}>
                                <TableCell component="th" scope="row">
                                    {row.adminName}

                                </TableCell>
                                <TableCell align="right">
                                    {row.adminEmail}
                                </TableCell>
                                <TableCell align="right">
                                    <Button
                                        variant="contained"
                                        color={row.isDeleted ? "warning" : "error"}
                                        onClick={() => {
                                            clickDeleteRestoreAdmin(row.adminId, row.isDeleted)
                                        }}>
                                        {row.isDeleted ? t("Restore") : t("Delete")}
                                    </Button>
                                </TableCell>

                            </StyledTableRow>
                        ))}
                        {emptyRows > 0 && (
                            <TableRow style={{height: 53 * emptyRows}}>
                                <TableCell colSpan={8}/>
                            </TableRow>
                        )}
                    </TableBody>
                    {props.admins.length > 5 ? (
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25, {label: t('All'), value: -1}]}
                                    colSpan={4}
                                    count={props.admins.length}
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
        </React.Fragment>
    )
}

export default TableAdmins;