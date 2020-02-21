import {withProgramOfficeAuthSync} from "../../components/routers/programOfficeAuth";
import ProgramOfficeLayout from "../../components/Layouts/ProgramOfficeLayout";
import ListStudentsForEligibility from "../../components/programOffice/ListStudentsForEligibility";
import {fetchStudentsForEligibility} from "../../utils/apiCalls/programOffice";

const Index = ({students}) => {
  return (
    <ProgramOfficeLayout>
      <ListStudentsForEligibility studentsList={students}/>
    </ProgramOfficeLayout>
  );
};

Index.getInitialProps = async () => {
  const students = await fetchStudentsForEligibility();
  return {students}
};

export default withProgramOfficeAuthSync(Index);