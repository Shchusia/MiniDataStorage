import React from 'react'
import {Token} from "../types/apiTypes";
import {useTranslation} from "react-i18next";
import Typography from '@mui/material/Typography';
import {
    IconButton,
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
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import copy from "clipboard-copy";
import {useDispatch, useSelector} from "react-redux";
import {getHeaders} from "../utils/utils";
import {getAccessToken, getRefreshToken} from "../store/reducers/globalReducer";
import {deleteToken} from "../store/apiFunctions/tokenMiddleware";

export interface TableTokensProps {
    tokens: Token[]
    isWriteTokens?: boolean
    projectId: number
}

const TableTokens = (props: TableTokensProps) => {
    const [t,] = useTranslation('translation');
    const [page, setPage] = React.useState(0);

    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - props.tokens.length) : 0;
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
    const clickDeleteToken = (tokenId: number) => {
        dispatcher(deleteToken({
                data: {
                    optional: {
                        tokenId: tokenId,
                        projectId: props.projectId
                    },
                    headers: getHeaders(at as string)
                },
                accessToken: at as string,
                refreshToken: rt as string,
            }
        ))

    }


    if (props.tokens.length === 0) {
        return <Typography component={"span"} variant={"body2"}>
            {t("No tokens of this type")}
        </Typography>
    }
    return (<React.Fragment>
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 500}} aria-label="custom pagination table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align="left">{t("Token")}</StyledTableCell>
                            <StyledTableCell align="right">{t("Expired")}</StyledTableCell>
                            <StyledTableCell align="right">{t("Actions")}</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(rowsPerPage > 0
                                ? props.tokens.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : props.tokens
                        ).map((row, index) => (
                            <StyledTableRow key={`${row.accessTokenId}_${index}`}>
                                <TableCell component="th" scope="row">
                                    {row.accessToken}
                                    <IconButton
                                        color="primary"
                                        aria-label="Copy token"
                                        component="label"
                                        onClick={() => {
                                            copy(row.accessToken)
                                        }}
                                    >
                                        <ContentCopyIcon/>
                                    </IconButton>
                                </TableCell>
                                <TableCell align="right">
                                    {row.expired ? row.expired.toString() : "---"}
                                </TableCell>
                                <TableCell align="right">
                                    <Button
                                        color="error"
                                        onClick={() => {
                                            clickDeleteToken(row.accessTokenId)
                                        }}>
                                        {t("Delete")}
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
                    {props.tokens.length > 5 ? (
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25, {label: t('All'), value: -1}]}
                                    colSpan={4}
                                    count={props.tokens.length}
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

export default TableTokens;