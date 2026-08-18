import express from 'express';

const router = express.Router();

export const GRIEVANCE_OFFICER = {
  name: 'Aman Verma',
  designation: 'Grievance & Redressal Officer (IT Rules 2021 Compliance)',
  email: 'grievance@driveit.in',
  complianceEmail: 'compliance@driveit.in',
  officeAddress: 'DriveIT Technologies India Pvt. Ltd., Level 4, Platina Tower, MG Road, Pune, Maharashtra 411001, India',
  workingHours: 'Monday to Friday, 09:30 AM - 06:30 PM IST',
  acknowledgementTime: 'Within 24 hours',
  resolutionTime: 'Within 15 days'
};

router.get('/grievance-officer', (req, res) => {
  res.json({
    success: true,
    data: GRIEVANCE_OFFICER
  });
});

router.get('/compliance-summary', (req, res) => {
  res.json({
    success: true,
    frameworks: [
      {
        law: 'Digital Personal Data Protection (DPDP) Act 2023',
        status: 'COMPLIANT',
        features: ['Explicit purpose-based consent', 'Data minimization', 'Right to erasure and access', 'No third-party PII selling']
      },
      {
        law: 'Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021',
        status: 'COMPLIANT',
        features: ['Designated Grievance Officer', '24-hour acknowledgement SLA', 'Automated abuse reporting']
      },
      {
        law: 'Motor Vehicles (Amendment) Act & Non-Commercial Carpooling Norms',
        status: 'COMPLIANT',
        features: ['Cost-sharing principle (Toll + EV Energy cost)', 'Zero commercial taxi profit surge', 'Max 3 departures daily velocity limit']
      }
    ]
  });
});

export default router;
