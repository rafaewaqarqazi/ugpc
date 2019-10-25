import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";
import moment from "moment";
import {useListItemStyles} from "../../../src/material-styles/listItemStyles";
import {useTableStyles} from "../../../src/material-styles/tableStyles";

const StudentEvaluationMeetingsComponent = ({internal,external}) => {
    const emptyStyles = useListItemStyles();
    const tableClasses = useTableStyles();
    return (
        <div>
            <div className={tableClasses.tableWrapper}>
                <Table  size='small'>
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Purpose</TableCell>
                            <TableCell align="left">Date</TableCell>
                            <TableCell align="left">Venue</TableCell>
                            <TableCell align="left">Examiner</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody >
                        {
                            !internal && !external ?
                                <TableRow >
                                    <TableCell colSpan={4}>
                                        <div className={emptyStyles.emptyListContainer}>
                                            <div className={emptyStyles.emptyList}>
                                                No Meetings Found
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>:
                                <div>
                                    {
                                        internal &&
                                        <TableRow className={tableClasses.tableRow} >
                                            <TableCell align="left" >Internal</TableCell>
                                            <TableCell align="left" >{moment(internal.date).format('MM/DD/YY, h:mm A')}</TableCell>
                                            <TableCell >{internal.venue}</TableCell>
                                            <TableCell >{internal.examiner.name}</TableCell>
                                        </TableRow>
                                    }
                                    {
                                        external &&
                                        <TableRow className={tableClasses.tableRow} >
                                            <TableCell align="left" >External</TableCell>
                                            <TableCell align="left" >{external.date && moment(external.date).format('MM/DD/YY, h:mm A')}</TableCell>
                                            <TableCell >{external.venue && external.venue}</TableCell>
                                            <TableCell >{external.examiner.name}</TableCell>
                                        </TableRow>
                                    }

                                </div>
                        }
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default StudentEvaluationMeetingsComponent;