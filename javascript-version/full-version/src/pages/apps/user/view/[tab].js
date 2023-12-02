// ** Third Party Imports
import axios from 'axios'

// ** Components Imports
import UserViewPage from 'src/views/apps/user/view/UserViewPage' 

// ** Page Structure
// UserViewPage <= UserViewLeft (Profile on the left) +  
//                 UserViewRight <= UserViewOverview (<= PatientRecordList + PatientRecord)

const UserView = ({ tab, invoiceData, patientData }) => {
  return <UserViewPage tab={tab} invoiceData={invoiceData} patientData={patientData}/>
}

export const getStaticPaths = () => {
  return {
    paths: [
      { params: { tab: `records-list` } },
      { params: { tab: 'create-record' } },
      { params: { tab: 'billing-plan' } },
      { params: { tab: 'notification' } },
      { params: { tab: 'connection' } }
    ],
    fallback: false
  }
}

export const getStaticProps = async ({ params }) => {
  let invoiceData = null;
  let patientData = null;
  
  try {
      const resInvoice = await axios.get('/apps/invoice/invoices');
      invoiceData = resInvoice.data?.allData || null;
      console.log('resInvoice:', resInvoice.data?.invoiceAllData);

  } catch (error) {
      console.error('Error fetching invoice data: ', error);
  }
  
  try {
      const resPatient = await axios.get('/apps/patient/patients');
      patientData = resPatient.data?.patientAllData || null;
      // console.log('Patient:', resPatient );
      // console.log('resPatient:', resPatient.data?.allData);


  } catch (error) {
      console.error('Error fetching patient data: ', error);
  }
  
  return {
      props: {
        invoiceData,
        patientData,
        tab: params?.tab
        }
  }
}

export default UserView
