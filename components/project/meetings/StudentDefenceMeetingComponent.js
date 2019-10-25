import React from 'react';
import {useListItemStyles} from "../../../src/material-styles/listItemStyles";
import {useTableStyles} from "../../../src/material-styles/tableStyles";
import {Table, TableBody, TableCell, TableHead, TableRow, Tooltip} from "@material-ui/core";
import moment from "moment";

const StudentDefenceMeetingComponent = ({docs}) => {
    const emptyStyles = useListItemStyles();
    const tableClasses = useTableStyles();
    return (
        <div>
            <div className={tableClasses.tableWrapper}>
                <Table  size='small'>
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">SrNo.</TableCell>
                            <TableCell align="left">Title</TableCell>
                            <TableCell align="left">Date</TableCell>
                            <TableCell align="left">Venue</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody >
                        {
                            !docs || docs.length === 0?
                                <TableRow >
                                    <TableCell colSpan={4}>
                                        <div className={emptyStyles.emptyListContainer}>
                                            <div className={emptyStyles.emptyList}>
                                                No Meetings Found
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>:
                                docs.filter(f => f.status !== 'Waiting for Initial Approval' || f.status !== 'Approved for Meeting').map((doc,index) => (
                                    <TableRow  key={index} className={tableClasses.tableRow} >
                                        <TableCell align="left" >{index+1}</TableCell>
                                        <TableCell align="left" >{doc.title}</TableCell>
                                        <TableCell align="left" >{moment(doc.meetingDate).format('MM/DD/YY, h:mm A')}</TableCell>
                                        <TableCell >{doc.venue}</TableCell>
                                    </TableRow>
                                ))
                        }
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default StudentDefenceMeetingComponent;