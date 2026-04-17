export interface FilingInput {
  formType: string;
  entityName: string;
  taxYear?: number;
  jurisdiction?: string;
  stablecoin?: string; // "$BAD" | "$TRISEXORG" | "$BAD + $TRISEXORG"
  data: Record<string, any>;
}

function coinLabel(input: FilingInput): string {
  return input.stablecoin || "$BAD";
}

export interface GeneratedFiling {
  documentBody: string;
  payload: string;
  agencyUrl: string;
  formNumber: string;
  filingMethod: string;
}

const HEADER = (title: string, formNumber: string) => `================================================================
  ${title}
  Form: ${formNumber}
  Generated: ${new Date().toISOString()}
  Prepared by: TriSex.org Filing Preparation System
================================================================

THIS IS A FILING-PREPARATION PACKET. IT IS NOT A SUBMISSION.
Review every field, complete missing items, sign where required,
and submit to the agency listed at the bottom of this document.
TriSex.org does not file on your behalf.

----------------------------------------------------------------
`;

const FOOTER = (agency: string, url: string, method: string) => `
----------------------------------------------------------------
SUBMISSION INSTRUCTIONS
----------------------------------------------------------------
Agency:          ${agency}
Official portal: ${url}
Method:          ${method}

After you submit, return to TriSex.org > Filing Preparation
and update the status of this document. Enter the confirmation
number / IRS Determination Letter / FinCEN MSB Registration ID
issued by the agency so your $BAD cooperative records reflect
real-world status, not internal placeholders.

This packet was prepared from the data you provided. Verify all
amounts, EINs, addresses, and signatures BEFORE submitting.
================================================================`;

function form1024(input: FilingInput): GeneratedFiling {
  const d = input.data;
  const body = HEADER("Application for Recognition of Exemption Under Section 501(a)", "IRS Form 1024") + `
PART I — IDENTIFICATION OF APPLICANT
1.  Full name of organization:           ${input.entityName}
2.  c/o name (if applicable):            ${d.coName || "[REQUIRED — leave blank if none]"}
3.  Mailing address:                     ${d.address || "[REQUIRED]"}
4.  City, State, ZIP:                    ${d.cityStateZip || "[REQUIRED]"}
5.  Country:                             ${d.country || "United States"}
6.  Employer Identification Number:      ${d.ein || "[REQUIRED — obtain free at IRS.gov/EIN before filing]"}
7.  Month accounting period ends:        ${d.fiscalYearEnd || "December"}
8.  Person to contact (name):            ${d.contactName || "[REQUIRED]"}
9.  Contact telephone number:            ${d.contactPhone || "[REQUIRED]"}
10. Date organization was formed:        ${d.formationDate || "[REQUIRED]"}
11. State of incorporation/formation:    ${d.formationState || "[REQUIRED]"}

PART II — ORGANIZATIONAL STRUCTURE
12. Type of organization (check one):
    [${d.entityType === "corporation" ? "X" : " "}] Corporation (attach Articles of Incorporation)
    [${d.entityType === "llc" ? "X" : " "}] Limited Liability Company
    [${d.entityType === "trust" ? "X" : " "}] Trust (attach Trust Agreement)
    [${d.entityType === "association" ? "X" : " "}] Unincorporated Association

PART III — REQUESTED EXEMPTION
13. Section under which exemption is requested:
    ${d.exemptSection || "501(c)(12) — Benevolent Life Insurance / Mutual / Cooperative Telephone Companies / Like Organizations"}

    Cooperative justification (required for 501(c)(12)):
    ${d.coopJustification || `${input.entityName} is operated as a member-owned cooperative providing
    mutual benefit to its members. At least 85% of income is collected from
    members for the sole purpose of meeting losses and expenses. The
    cooperative does not distribute net earnings except as patronage
    dividends issued in proportion to member participation.`}

PART IV — NARRATIVE DESCRIPTION OF ACTIVITIES
14. Past, present, and planned activities:
${d.activitiesNarrative || "[REQUIRED — describe in detail what your cooperative does, who it serves, sources of revenue, and how surplus is distributed back to members.]"}

PART V — FINANCIAL DATA
                                         Current Year     Prior Year
15. Gross receipts from members:         $${d.memberReceipts || "0"}    $${d.priorMemberReceipts || "0"}
16. Gross receipts from non-members:     $${d.nonMemberReceipts || "0"}    $${d.priorNonMemberReceipts || "0"}
17. Total expenses:                      $${d.totalExpenses || "0"}    $${d.priorExpenses || "0"}
18. Member-source income percentage:     ${d.memberPercent || "[CALCULATE — must be ≥ 85% for 501(c)(12)]"}%

PART VI — SIGNATURE
Under penalties of perjury, I declare that I have examined this
application, including the accompanying schedules and statements,
and to the best of my knowledge it is true, correct, and complete.

Signature: _________________________________  Date: ____________
Print name: ${d.signerName || "[REQUIRED]"}
Title:      ${d.signerTitle || "[REQUIRED]"}

REQUIRED ATTACHMENTS CHECKLIST
[ ] Articles of Incorporation / Organizing Document (certified copy)
[ ] Bylaws (signed and dated)
[ ] Detailed narrative of activities (Part IV expansion)
[ ] Financial statements for 4 prior years (or projections if newer)
[ ] Conflict of interest policy
[ ] User fee payment voucher (Form 8718) — current fee at IRS.gov/Form1024
` + FOOTER(
    "Internal Revenue Service — Exempt Organizations",
    "https://www.irs.gov/forms-pubs/about-form-1024",
    "Mail completed form + attachments + Form 8718 user fee to:\n                 Internal Revenue Service\n                 P.O. Box 12192\n                 Covington, KY 41012-0192"
  );
  return {
    documentBody: body,
    payload: JSON.stringify(d),
    agencyUrl: "https://www.irs.gov/forms-pubs/about-form-1024",
    formNumber: "IRS Form 1024",
    filingMethod: "Mail",
  };
}

function form1099Div(input: FilingInput): GeneratedFiling {
  const d = input.data;
  const body = HEADER("Dividends and Distributions — Patronage Dividend Reporting", "IRS Form 1099-DIV") + `
PAYER INFORMATION (your cooperative)
Name:                 ${input.entityName}
Address:              ${d.payerAddress || "[REQUIRED]"}
City/State/ZIP:       ${d.payerCityStateZip || "[REQUIRED]"}
Telephone:            ${d.payerPhone || "[REQUIRED]"}
Payer's TIN (EIN):    ${d.payerEin || "[REQUIRED]"}

RECIPIENT INFORMATION (the member receiving the dividend)
Name:                 ${d.recipientName || "[REQUIRED]"}
Address:              ${d.recipientAddress || "[REQUIRED]"}
City/State/ZIP:       ${d.recipientCityStateZip || "[REQUIRED]"}
Recipient's TIN (SSN or EIN):  ${d.recipientTin || "[REQUIRED — collect via Form W-9 before issuing]"}
Account number:       ${d.accountNumber || "[Optional — your member ID]"}

FOR TAX YEAR: ${input.taxYear || new Date().getFullYear() - 1}

----------------------------------------------------------------
BOX 1a  Total ordinary dividends:                $${d.box1a || "0.00"}
BOX 1b  Qualified dividends:                     $${d.box1b || "0.00"}
BOX 2a  Total capital gain distributions:        $${d.box2a || "0.00"}
BOX 2b  Unrecap. Sec. 1250 gain:                 $${d.box2b || "0.00"}
BOX 3   Nondividend distributions:               $${d.box3 || "0.00"}
BOX 4   Federal income tax withheld:             $${d.box4 || "0.00"}
BOX 5   Section 199A dividends:                  $${d.box5 || "0.00"}
BOX 7   Foreign tax paid:                        $${d.box7 || "0.00"}
BOX 11  FATCA filing requirement: [${d.fatca ? "X" : " "}]
BOX 12  Exempt-interest dividends:               $${d.box12 || "0.00"}
----------------------------------------------------------------

PATRONAGE DIVIDEND NOTE (cooperatives only)
Patronage dividends paid to members in proportion to their
business with the cooperative are reported on Form 1099-PATR,
NOT Form 1099-DIV. Use this 1099-DIV only for non-patronage
distributions or when your cooperative elected corporate tax
treatment for the distributing class of stock.

If you intended to report patronage dividends, regenerate this
filing as a 1099-PATR packet instead.

CERTIFICATION
I certify under penalties of perjury that the amounts above were
actually paid to the recipient during ${input.taxYear || "the tax year"}, that the
recipient TIN was collected via valid Form W-9, and that backup
withholding was applied where required.

Signature: _________________________________  Date: ____________
Print name: ${d.signerName || "[REQUIRED]"}
Title:      ${d.signerTitle || "[REQUIRED]"}
` + FOOTER(
    "Internal Revenue Service",
    "https://www.irs.gov/forms-pubs/about-form-1099-div",
    "E-file via IRS FIRE system (https://fire.irs.gov) — required if filing 10+\n                 returns. Otherwise mail Copy A + Form 1096 transmittal.\n                 Recipient Copy B must be furnished by January 31."
  );
  return {
    documentBody: body,
    payload: JSON.stringify(d),
    agencyUrl: "https://www.irs.gov/forms-pubs/about-form-1099-div",
    formNumber: "IRS Form 1099-DIV",
    filingMethod: "E-file via FIRE or mail",
  };
}

function fincen107(input: FilingInput): GeneratedFiling {
  const d = input.data;
  const body = HEADER("Registration of Money Services Business", "FinCEN Form 107") + `
SECTION A — TYPE OF FILING
[${d.filingType === "initial" ? "X" : " "}] Initial registration
[${d.filingType === "renewal" ? "X" : " "}] Renewal (every 2 years)
[${d.filingType === "reregistration" ? "X" : " "}] Re-registration after change in ownership/control

SECTION B — REGISTRANT INFORMATION
1.  Legal name of registrant:            ${input.entityName}
2.  DBA / trade name(s):                 ${d.dba || "None"}
3.  Employer Identification Number:      ${d.ein || "[REQUIRED]"}
4.  Date of incorporation/formation:     ${d.formationDate || "[REQUIRED]"}
5.  State of formation:                  ${d.formationState || "[REQUIRED]"}
6.  Principal place of business:         ${d.principalAddress || "[REQUIRED]"}
7.  Mailing address (if different):      ${d.mailingAddress || "Same as above"}

SECTION C — MSB ACTIVITIES (check all that apply)
[${d.actCurrencyDealer ? "X" : " "}] Currency dealer or exchanger
[${d.actCheckCasher ? "X" : " "}] Check casher
[${d.actMoneyTransmitter ? "X" : " "}] Money transmitter  ← required for ${coinLabel(input)} stablecoin issuance/redemption
[${d.actMoneyOrder ? "X" : " "}] Issuer / seller / redeemer of money orders
[${d.actTravelersCheck ? "X" : " "}] Issuer / seller / redeemer of traveler's checks
[${d.actStoredValue ? "X" : " "}] Provider / seller of prepaid access (stored value)
[${d.actVirtualCurrency ? "X" : " "}] Convertible virtual currency administrator/exchanger

SECTION D — STATES OF OPERATION
List every state where the MSB conducts business. State licensing
is REQUIRED in addition to FinCEN registration in most states.

States: ${d.statesOfOperation || "[REQUIRED — list all states]"}

SECTION E — ESTIMATED TRANSACTION VOLUME
Gross transaction amount (12 mos):       $${d.grossVolume || "[REQUIRED]"}
Number of transactions (12 mos):         ${d.txnCount || "[REQUIRED]"}
Number of branches:                      ${d.branchCount || "0"}
Number of agents:                        ${d.agentCount || "0"}

SECTION F — OWNERSHIP & CONTROL
List each person who owns 10%+ of the registrant or otherwise
controls it. (Attach FinCEN Form 107 Continuation Page as needed.)

Owner 1:
  Name:               ${d.owner1Name || "[REQUIRED]"}
  Title:              ${d.owner1Title || "[REQUIRED]"}
  SSN/ITIN:           ${d.owner1Ssn || "[REQUIRED]"}
  Date of birth:      ${d.owner1Dob || "[REQUIRED]"}
  Address:            ${d.owner1Address || "[REQUIRED]"}
  Ownership %:        ${d.owner1Pct || "[REQUIRED]"}

SECTION G — AML COMPLIANCE PROGRAM (31 CFR 1022.210)
[${d.amlPolicy ? "X" : " "}] Written AML policies and procedures in place
[${d.amlOfficer ? "X" : " "}] Designated AML compliance officer: ${d.amlOfficerName || "[REQUIRED]"}
[${d.amlTraining ? "X" : " "}] Ongoing employee training program
[${d.amlAudit ? "X" : " "}] Independent review (audit) scheduled
[${d.ctrFiling ? "X" : " "}] CTR filing process for transactions > $10,000
[${d.sarFiling ? "X" : " "}] SAR filing process for suspicious activity

SECTION H — CERTIFICATION
I certify under penalty of perjury that the information above is
true, accurate, and complete and that I am authorized to file this
registration on behalf of the registrant.

Signature: _________________________________  Date: ____________
Print name: ${d.signerName || "[REQUIRED]"}
Title:      ${d.signerTitle || "[REQUIRED]"}
` + FOOTER(
    "Financial Crimes Enforcement Network (FinCEN)",
    "https://www.fincen.gov/money-services-business-msb-registration",
    "E-file ONLY through the BSA E-Filing System:\n                 https://bsaefiling.fincen.treas.gov\n                 Paper filings are no longer accepted.\n                 Initial registration is due within 180 days of starting MSB activity."
  );
  return {
    documentBody: body,
    payload: JSON.stringify(d),
    agencyUrl: "https://www.fincen.gov/money-services-business-msb-registration",
    formNumber: "FinCEN Form 107",
    filingMethod: "BSA E-Filing System",
  };
}

function stateMtl(input: FilingInput): GeneratedFiling {
  const d = input.data;
  const state = input.jurisdiction || d.state || "[REQUIRED — name the state]";
  const body = HEADER(`State Money Transmitter License Application Packet — ${state}`, `${state} MTL Application`) + `
APPLICANT
Legal name:                 ${input.entityName}
DBA:                        ${d.dba || "None"}
EIN:                        ${d.ein || "[REQUIRED]"}
NMLS ID (if any):           ${d.nmlsId || "[Recommended — register at https://nationwidelicensingsystem.org]"}
FinCEN MSB Registration #:  ${d.fincenMsbId || "[REQUIRED — must register with FinCEN first]"}

PRINCIPAL OFFICE
Street:                     ${d.principalAddress || "[REQUIRED]"}
City/State/ZIP:             ${d.principalCityStateZip || "[REQUIRED]"}
Phone:                      ${d.principalPhone || "[REQUIRED]"}

PROPOSED ACTIVITIES IN ${state.toUpperCase()}
Description:                ${d.activityDescription || `Issuance, transmission, and redemption of ${coinLabel(input)} stablecoin(s) to and on behalf of cooperative members residing in or transacting from ${state}.`}
Estimated annual volume:    $${d.estimatedVolume || "[REQUIRED]"}
Number of expected agents:  ${d.agentCount || "0"}
Customer-funds custody:     ${d.custodyModel || "[REQUIRED — describe segregated trust account, surety, or qualified custodian]"}

REQUIRED CORPORATE DOCUMENTS (attach all)
[ ] Certificate of Good Standing from state of formation (≤ 60 days old)
[ ] Certified Articles of Incorporation/Organization
[ ] Current Bylaws or Operating Agreement
[ ] Organizational chart showing all parents, subsidiaries, affiliates
[ ] Audited financial statements (most recent 2 fiscal years)
[ ] Most recent interim financial statement (≤ 90 days old)
[ ] Pro-forma 3-year financial projections
[ ] Surety bond ($${d.bondAmount || "[State minimum — typically $50,000–$1,000,000]"})
[ ] AML/BSA compliance program (full written policy)
[ ] Cybersecurity policy
[ ] Business continuity / disaster recovery plan

KEY INDIVIDUALS — fingerprint cards & background checks REQUIRED
List each director, executive officer, and 10%+ beneficial owner.

1. Name:        ${d.keyPerson1Name || "[REQUIRED]"}
   Title:       ${d.keyPerson1Title || "[REQUIRED]"}
   SSN:         ${d.keyPerson1Ssn || "[REQUIRED — submit via NMLS, not on this form]"}
   Address:     ${d.keyPerson1Address || "[REQUIRED]"}
   FBI fingerprints submitted: [${d.keyPerson1Prints ? "X" : " "}]
   Credit report authorization: [${d.keyPerson1Credit ? "X" : " "}]

FEES (verify current amounts on the state regulator's website)
Application fee:            $${d.appFee || "[REQUIRED — state-specific]"}
Investigation fee:          $${d.invFee || "[REQUIRED — state-specific]"}
NMLS processing fee:        $100 (typical)
First-year license fee:     $${d.licenseFee || "[REQUIRED]"}

CERTIFICATION & SIGNATURE
I certify that the statements made in this application and in all
attachments are true, accurate, and complete to the best of my
knowledge, and that I have authority to bind ${input.entityName}.

Signature: _________________________________  Date: ____________
Print name: ${d.signerName || "[REQUIRED]"}
Title:      ${d.signerTitle || "[REQUIRED]"}
Notary acknowledgment required in most states.
` + FOOTER(
    `${state} Department of Financial Institutions / Financial Regulation`,
    "https://nationwidelicensingsystem.org",
    `Submit through NMLS (Nationwide Multistate Licensing System).\n                 Some states require a parallel paper packet — confirm with\n                 the ${state} regulator before relying on NMLS alone.\n                 Money transmission without a license is a criminal offense\n                 in nearly every state.\n                 NOTE: A separate MTL packet may be required per stablecoin\n                 issued (${coinLabel(input)}); confirm with state counsel.`
  );
  return {
    documentBody: body,
    payload: JSON.stringify(d),
    agencyUrl: "https://nationwidelicensingsystem.org",
    formNumber: `${state} MTL Application`,
    filingMethod: "NMLS + state regulator",
  };
}

export function generateFiling(input: FilingInput): GeneratedFiling {
  switch (input.formType) {
    case "1024":
      return form1024(input);
    case "1099-DIV":
      return form1099Div(input);
    case "FinCEN-107":
      return fincen107(input);
    case "State-MTL":
      return stateMtl(input);
    default:
      throw new Error(`Unknown form type: ${input.formType}`);
  }
}

export const SUPPORTED_FORMS = [
  {
    id: "1024",
    name: "IRS Form 1024 — 501(a) Tax-Exempt Application",
    description: "Apply for federal tax-exempt status as a 501(c)(12) cooperative for the $BAD cooperative entity itself.",
    agency: "Internal Revenue Service",
    method: "Mail",
    estimatedTime: "3-12 months for IRS determination",
  },
  {
    id: "1099-DIV",
    name: "IRS Form 1099-DIV — Dividend & Patronage Reporting",
    description: "Report dividend distributions paid to $BAD cooperative members for the prior tax year. Use 1099-PATR for true patronage dividends.",
    agency: "Internal Revenue Service",
    method: "E-file via FIRE (10+) or mail",
    estimatedTime: "Recipient copy due Jan 31; IRS copy by Feb 28 (paper) / Mar 31 (e-file)",
  },
  {
    id: "FinCEN-107",
    name: "FinCEN Form 107 — Money Services Business Registration",
    description: "Required federal registration for issuing, transmitting, or exchanging the $BAD stablecoin. Must be filed within 180 days of starting MSB activity and renewed every 2 years.",
    agency: "FinCEN (Treasury)",
    method: "BSA E-Filing System",
    estimatedTime: "Acknowledgment within 1-2 weeks",
  },
  {
    id: "State-MTL",
    name: "State Money Transmitter License Packet",
    description: "Per-state MTL application packet. Money transmission without a state license is a criminal offense in nearly every state. Generate one packet per state of operation.",
    agency: "State financial regulator (via NMLS)",
    method: "NMLS",
    estimatedTime: "6-18 months per state",
  },
];
