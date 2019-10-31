import React from 'react';
import { Page, Text, View, Document, StyleSheet,Image} from '@react-pdf/renderer';
import moment from 'moment';
// Create styles
const styles = StyleSheet.create({
    body:{
      padding:'30 50',
        fontFamily:'Times-Roman',
        textAlign:'justify',
        whiteSpace:'normal',
        textJustify:'inter-word',
        fontSize:12,
        lineHeight:1.6
    },
    header: {
      display:'flex',
        flexDirection:'row',
        alignItems:'center',
        border:'1px solid #000',
        padding:5
    },
    logo:{
        width:60,
        height:60
    },
    headerTitle:{
       padding:0,
        textAlign:'center',

    },
    divider:{
        backgroundColor:'#000',
        height:'1px',
        marginBottom:10
    },
    NoDate:{
        display:'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'space-between',
        marginBottom:10
    },

    subject:{
        display:'flex',
        flexDirection:'row',
        marginBottom:10
    },
    subjectText:{
        textDecoration:'underline',
        fontFamily:'Times-Bold',
        textTransform:'uppercase',
    },
    listDot:{
        backgroundColor:'#000',
        height:'5px',
        width:'5px',
        borderRadius:50,
        marginRight:15
    },
    listItem:{
        display:'flex',
        flexDirection:'row',
        alignItems:'center'
    },
    list:{
        margin:20
    },
    chairman:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'flex-end',
        padding:'40 40 10 0'
    },
    listArrow:{
        height:7,
        width:7,
        marginRight:10
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: 'grey',
    }
});

const ApprovalLetter = ({title,date,students,supervisor,chairmanName}) => (
    <Document >
        <Page size="A4" style={styles.body} >
            <View style={styles.header}>
                <Image src='/static/images/avatar/iiui-logo.jpg' style={styles.logo}/>
                <View style={styles.headerTitle}>
                    <Text>INTERNATIONAL ISLAMIC UNIVERSITY, ISLAMABAD</Text>
                    <Text>FACULTY OF BASIC AND APPLIED SCIENCES</Text>
                    <Text>DEPARTMENT OF COMPUTER SCIENCE & SOFTWARE ENGINEERING</Text>
                </View>
            </View>
            <View style={styles.divider}/>
            <View style={styles.NoDate}>
                <Text >{`No.IIU/FBAS/DCS&SE/${(new Date().getFullYear())}-`}</Text>
                <Text >{`Date: ${moment(date).format('DD-MM-YYYY')}`}</Text>
            </View>
            <View style={styles.subject}>
                <Text >Subject: </Text>
                <View style={{flexGrow:1,marginLeft:10}}>
                    <Text style={styles.subjectText}>Allocation of Provisional Supervision letter for bsse project,</Text>
                    <Text>{`"${title}"`}</Text>
                </View>
            </View>
            <View >
                <Text style={{textIndent:50}} > The Department has allocated project titled above to
                    <Text style={{ fontFamily: 'Times-Bold'}} > {students.map((student,index) => `${index === 1? ' and':''} Mr. ${student.name} Registration No: ${student.student_details.regNo}`)}.
                        {` ${supervisor.name}, ${supervisor.supervisor_details.position},`}
                    </Text>
                    <Text> Department of Computer Science & Software Engineering, Faculty of Basic & Applied Sciences, International Islamic University, Islamabad,
                        will supervise the project. The work should be completed withing one semester.
                        <Text style={{fontFamily:'Times-Italic'}}> If the project is not completed within
                            prescribed period, then you have to re-register in the next semester with only registration fee. Students failing to
                            complete project even in the additional duration will have to pay full fee for subsequent semester that will include
                            the project fee plus the registration fee.
                        </Text>
                    </Text>
                </Text>
                <Text style={{textIndent:50}} >
                    Weekly progress report duly signed by the supervisor must also be submitted to the Program Coordinator. Project presentation
                    within the concerned SIG after every three weeks is mandatory. Project will be evaluated as per the following criteria
                </Text>
            </View>
            <View style={styles.list}>
                <View style={styles.listItem}>
                    <View style={styles.listDot}/>
                    <Text>Scope</Text>
                </View>
                <View style={styles.listItem}>
                    <View style={styles.listDot}/>
                    <Text>Project utility</Text>
                </View>
                <View style={styles.listItem}>
                    <View style={styles.listDot}/>
                    <Text>Innovation</Text>
                </View>
                <View style={styles.listItem}>
                    <View style={styles.listDot}/>
                    <Text>Selection of appropriate technology</Text>
                </View>
                <View style={styles.listItem}>
                    <View style={styles.listDot}/>
                    <Text>Approach/ Implementation</Text>
                </View>
                <View style={styles.listItem}>
                    <View style={styles.listDot}/>
                    <Text>Report write-up</Text>
                </View>
                <View style={styles.listItem}>
                    <View style={styles.listDot}/>
                    <Text>Demo/ Presentation</Text>
                </View>
            </View>
            <View>
                <Text style={{textIndent:50}}>The student must submit the copies of the project report within three months after the Viva Voce exam;
                    otherwise whole process will be done again
                </Text>
            </View>
            <View style={styles.chairman}>
                <View style={{display:'flex', flexDirection:'column',alignItems:'center',justifyContent: 'center'}}>
                    <Text style={{fontFamily:'Times-Bold'}}>{`(${chairmanName})`}</Text>
                    <Text>Chairman, DCS&SE, FBAS, IIUI</Text>
                </View>
            </View>
            <Text>CC To:</Text>
            <View style={styles.list}>
                <View style={styles.listItem}>
                    <Image src='/static/images/avatar/right-arrow.jpg' style={styles.listArrow}/>
                    <Text>Supervisor of the Student</Text>
                </View>
                <View style={styles.listItem}>
                    <Image src='/static/images/avatar/right-arrow.jpg' style={styles.listArrow}/>
                    <Text>Student Concerned</Text>
                </View>
                <View style={styles.listItem}>
                    <Image src='/static/images/avatar/right-arrow.jpg' style={styles.listArrow}/>
                    <Text>Program office</Text>
                </View>
            </View>
            <Text style={styles.footer} fixed>Science Block, Sector H-10, Islamabad. Phone +92 51 9257951 Email: HDCS@iiu.edu.pk</Text>

        </Page>
    </Document>
);

export default ApprovalLetter;