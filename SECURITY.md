# Security Policy

## Supported Versions

We provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

The TriSex.org team takes security seriously. We appreciate your efforts to responsibly disclose your findings.

### How to Report

**For security vulnerabilities, please do NOT use GitHub issues.**

Instead, please report security vulnerabilities by emailing security@trisex.org

Include the following information:
- Type of issue (e.g. buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit the issue

### Response Timeline

- **24 hours**: Acknowledgment of your report
- **72 hours**: Initial assessment and severity classification
- **7 days**: Detailed response with our evaluation and planned actions
- **30 days**: Resolution or clear timeline for fix

### Security Measures

#### Age Verification System
- Local OCR processing to protect document privacy
- Secure file upload with format validation
- Encrypted document storage with automatic deletion
- Audit trails for all verification attempts
- Parental consent workflows with cryptographic signatures

#### Genealogical Verification
- Mathematical verification using Wright's coefficient
- Secure GEDCOM file processing
- Privacy-focused relationship calculations
- No permanent storage of family tree data

#### Data Protection
- Session-based authentication with secure cookies
- PostgreSQL with parameterized queries
- Input validation and sanitization
- Rate limiting on sensitive endpoints
- HTTPS enforcement in production

#### File Upload Security
- 10MB file size limits
- MIME type validation
- Virus scanning integration
- Secure temporary storage
- Automatic cleanup processes

### Responsible Disclosure

We are committed to working with security researchers to verify, reproduce, and respond to legitimate reported vulnerabilities. We will:

1. Acknowledge your report within 24 hours
2. Provide an estimated timeline for addressing the vulnerability
3. Notify you when the vulnerability is fixed
4. Publicly acknowledge your responsible disclosure (if desired)

### Security Features

#### Creative Commons Compliance
- All security systems licensed under CC BY-SA 4.0
- Open source security auditing
- Transparent verification processes
- Community-driven security improvements

#### Privacy by Design
- Local document processing
- Minimal data collection
- Data retention policies
- User consent management
- Right to deletion compliance

### Out of Scope

The following are considered out of scope for our security program:
- Theoretical vulnerabilities without actual impact
- Social engineering attacks against our users
- Physical security issues
- Denial of service attacks
- Issues in third-party services we don't control

### Safe Harbor

We consider security research conducted under this policy to be:
- Authorized in accordance with the Computer Fraud and Abuse Act (CFAA)
- Authorized in accordance with relevant similar laws
- Exempt from the Digital Millennium Copyright Act (DMCA)
- Protected from legal action by TriSex.org

We will not pursue civil action or initiate a complaint to law enforcement for accidental, good faith security research.

### Recognition

We believe in recognizing the valuable contributions of security researchers. With your permission, we will:
- Publicly acknowledge your contribution
- Include your name in our security acknowledgments
- Provide a letter of recommendation for your research

Thank you for helping keep TriSex.org and our users safe!