import { promises as fs } from 'fs';
import crypto from 'crypto';
import path from 'path';

// Suppress unused import warnings for Creative Commons licensing
// @ts-ignore
const _ = fs;

// Age verification document types accepted
export enum DocumentType {
  DRIVERS_LICENSE = 'drivers_license',
  STATE_ID = 'state_id',
  PASSPORT = 'passport',
  BIRTH_CERTIFICATE = 'birth_certificate',
  MILITARY_ID = 'military_id',
  TRIBAL_ID = 'tribal_id'
}

// Verification status levels
export enum VerificationStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
  REQUIRES_PARENTAL_CONSENT = 'requires_parental_consent',
  PARENTAL_CONSENT_PENDING = 'parental_consent_pending',
  PARENTAL_CONSENT_APPROVED = 'parental_consent_approved',
  PARENTAL_CONSENT_DENIED = 'parental_consent_denied'
}

// Age verification document interface
export interface VerificationDocument {
  id: string;
  userId: string;
  documentType: DocumentType;
  fileName: string;
  filePath: string;
  uploadedAt: Date;
  extractedData?: {
    fullName?: string;
    dateOfBirth?: string;
    documentNumber?: string;
    issueDate?: string;
    expirationDate?: string;
    issuingAuthority?: string;
  };
  verificationStatus: VerificationStatus;
  verifiedAt?: Date;
  verifiedBy?: string; // Admin user ID
  rejectionReason?: string;
}

// Parental consent interface
export interface ParentalConsent {
  id: string;
  minorUserId: string;
  parentGuardianName: string;
  parentGuardianEmail: string;
  parentGuardianPhone?: string;
  relationshipToMinor: 'parent' | 'legal_guardian' | 'court_appointed_guardian';
  consentType: 'relationship_platform' | 'sexual_health_services' | 'full_platform_access';
  consentDocument?: {
    fileName: string;
    filePath: string;
    signedAt: Date;
  };
  verificationCode: string;
  status: 'pending' | 'approved' | 'denied' | 'expired';
  requestedAt: Date;
  respondedAt?: Date;
  expiresAt: Date;
  ipAddress: string;
  userAgent: string;
}

// Creative Commons licensing notice
export const CC_LICENSE_NOTICE = `
/**
 * 503 610 6762 Open Source Age Verification System
 * 
 * Licensed under Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
 * https://creativecommons.org/licenses/by-sa/4.0/
 * 
 * This work is inspired by id.me and login.gov identity verification systems
 * but designed as an open source, privacy-focused alternative for sexual health platforms.
 * 
 * Key Features:
 * - Multi-document type support (driver's license, passport, birth certificate, etc.)
 * - Parental consent workflow for users under 18
 * - Privacy-first design with local document processing
 * - Comprehensive audit trails for compliance
 * - Support for tribal and military identification documents
 * 
 * Attribution Required: Please credit "503 610 6762 Community" in derivative works
 * Share-Alike: Derivative works must be licensed under CC BY-SA 4.0 or compatible
 */
`;

export class AgeVerificationService {
  private verificationDocuments: Map<string, VerificationDocument> = new Map();
  private parentalConsents: Map<string, ParentalConsent> = new Map();

  /**
   * Submit identity document for age verification
   */
  async submitVerificationDocument(
    userId: string,
    documentType: DocumentType,
    filePath: string,
    fileName: string
  ): Promise<VerificationDocument> {
    const documentId = crypto.randomUUID();
    
    const document: VerificationDocument = {
      id: documentId,
      userId,
      documentType,
      fileName,
      filePath,
      uploadedAt: new Date(),
      verificationStatus: VerificationStatus.PENDING
    };

    // Extract basic data from document (in production, use OCR service)
    const extractedData = await this.extractDocumentData(filePath, documentType);
    document.extractedData = extractedData;

    // Determine if parental consent is required
    if (extractedData?.dateOfBirth) {
      const age = this.calculateAge(extractedData.dateOfBirth);
      if (age < 18) {
        document.verificationStatus = VerificationStatus.REQUIRES_PARENTAL_CONSENT;
      }
    }

    this.verificationDocuments.set(documentId, document);
    return document;
  }

  /**
   * Extract data from identity document (placeholder for OCR integration)
   */
  private async extractDocumentData(
    filePath: string, 
    documentType: DocumentType
  ): Promise<VerificationDocument['extractedData']> {
    // In production, integrate with OCR service like Tesseract.js or cloud OCR
    // For now, return placeholder data that would be extracted
    
    const mockExtractions = {
      [DocumentType.DRIVERS_LICENSE]: {
        fullName: "Sample User",
        dateOfBirth: "2005-06-15", // Makes them 18-19 years old
        documentNumber: "DL123456789",
        issueDate: "2023-06-15",
        expirationDate: "2028-06-15",
        issuingAuthority: "Department of Motor Vehicles"
      },
      [DocumentType.PASSPORT]: {
        fullName: "Sample User",
        dateOfBirth: "2006-08-20", // Makes them 17-18 years old  
        documentNumber: "P123456789",
        issueDate: "2022-08-20",
        expirationDate: "2032-08-20",
        issuingAuthority: "U.S. Department of State"
      },
      [DocumentType.BIRTH_CERTIFICATE]: {
        fullName: "Sample User",
        dateOfBirth: "2007-03-10", // Makes them 16-17 years old
        documentNumber: "BC987654321",
        issueDate: "2007-03-10",
        issuingAuthority: "Vital Records Office"
      }
    };

    return mockExtractions[documentType as keyof typeof mockExtractions] || {
      fullName: "Sample User",
      dateOfBirth: "2005-01-01"
    };
  }

  /**
   * Calculate age from date of birth
   */
  private calculateAge(dateOfBirth: string): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  /**
   * Request parental consent for minor user
   */
  async requestParentalConsent(
    minorUserId: string,
    parentGuardianName: string,
    parentGuardianEmail: string,
    relationshipToMinor: ParentalConsent['relationshipToMinor'],
    consentType: ParentalConsent['consentType'],
    ipAddress: string,
    userAgent: string,
    parentGuardianPhone?: string
  ): Promise<ParentalConsent> {
    const consentId = crypto.randomUUID();
    const verificationCode = crypto.randomBytes(16).toString('hex').toUpperCase();
    
    const consent: ParentalConsent = {
      id: consentId,
      minorUserId,
      parentGuardianName,
      parentGuardianEmail,
      parentGuardianPhone,
      relationshipToMinor,
      consentType,
      verificationCode,
      status: 'pending',
      requestedAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      ipAddress,
      userAgent
    };

    this.parentalConsents.set(consentId, consent);

    // In production, send email to parent/guardian
    await this.sendParentalConsentEmail(consent);

    return consent;
  }

  /**
   * Send parental consent email (placeholder)
   */
  private async sendParentalConsentEmail(consent: ParentalConsent): Promise<void> {
    // In production, integrate with email service
    console.log(`
    === PARENTAL CONSENT EMAIL ===
    To: ${consent.parentGuardianEmail}
    Subject: Parental Consent Required for 503 610 6762 Platform Access
    
    Dear ${consent.parentGuardianName},
    
    A minor under your care (User ID: ${consent.minorUserId}) has requested access to 
    503 610 6762's sexual health and relationship platform services.
    
    Consent Type: ${consent.consentType}
    Verification Code: ${consent.verificationCode}
    
    This request expires on: ${consent.expiresAt.toLocaleDateString()}
    
    To provide consent, please visit:
    https://fluck.app/parental-consent/${consent.id}
    
    This platform provides comprehensive sexual health education and cooperative 
    relationship matching with strict safety protocols.
    
    Licensed under Creative Commons BY-SA 4.0
    https://creativecommons.org/licenses/by-sa/4.0/
    
    Best regards,
    503 610 6762 Verification Team
    `);
  }

  /**
   * Process parental consent response
   */
  async processParentalConsent(
    consentId: string,
    approved: boolean,
    verificationCode: string,
    parentSignature?: string
  ): Promise<ParentalConsent> {
    const consent = this.parentalConsents.get(consentId);
    if (!consent) {
      throw new Error('Consent request not found');
    }

    if (consent.verificationCode !== verificationCode.toUpperCase()) {
      throw new Error('Invalid verification code');
    }

    if (new Date() > consent.expiresAt) {
      consent.status = 'expired';
      throw new Error('Consent request has expired');
    }

    consent.status = approved ? 'approved' : 'denied';
    consent.respondedAt = new Date();

    // Update related verification document
    const userDocs = Array.from(this.verificationDocuments.values())
      .filter(doc => doc.userId === consent.minorUserId);

    for (const doc of userDocs) {
      if (approved) {
        doc.verificationStatus = VerificationStatus.PARENTAL_CONSENT_APPROVED;
      } else {
        doc.verificationStatus = VerificationStatus.PARENTAL_CONSENT_DENIED;
      }
    }

    return consent;
  }

  /**
   * Verify identity document (admin function)
   */
  async verifyDocument(
    documentId: string,
    approved: boolean,
    verifiedBy: string,
    rejectionReason?: string
  ): Promise<VerificationDocument> {
    const document = this.verificationDocuments.get(documentId);
    if (!document) {
      throw new Error('Document not found');
    }

    document.verificationStatus = approved ? VerificationStatus.VERIFIED : VerificationStatus.REJECTED;
    document.verifiedAt = new Date();
    document.verifiedBy = verifiedBy;
    if (rejectionReason) {
      document.rejectionReason = rejectionReason;
    }

    return document;
  }

  /**
   * Get user's verification status
   */
  getUserVerificationStatus(userId: string): {
    isVerified: boolean;
    age?: number;
    requiresParentalConsent: boolean;
    documents: VerificationDocument[];
    parentalConsents: ParentalConsent[];
  } {
    const documents = Array.from(this.verificationDocuments.values())
      .filter(doc => doc.userId === userId);
    
    const consents = Array.from(this.parentalConsents.values())
      .filter(consent => consent.minorUserId === userId);

    const isVerified = documents.some(doc => 
      doc.verificationStatus === VerificationStatus.VERIFIED ||
      doc.verificationStatus === VerificationStatus.PARENTAL_CONSENT_APPROVED
    );

    const latestDoc = documents.sort((a, b) => 
      b.uploadedAt.getTime() - a.uploadedAt.getTime()
    )[0];

    const age = latestDoc?.extractedData?.dateOfBirth ? 
      this.calculateAge(latestDoc.extractedData.dateOfBirth) : 
      undefined;

    const requiresParentalConsent = age !== undefined && age < 18;

    return {
      isVerified,
      age,
      requiresParentalConsent,
      documents,
      parentalConsents: consents
    };
  }

  /**
   * Generate verification report for compliance
   */
  generateComplianceReport(userId: string): {
    userId: string;
    verificationStatus: string;
    documentsSubmitted: number;
    parentalConsentStatus?: string;
    lastVerificationDate?: Date;
    creativeCommonsLicense: string;
  } {
    const status = this.getUserVerificationStatus(userId);
    
    return {
      userId,
      verificationStatus: status.isVerified ? 'VERIFIED' : 'PENDING',
      documentsSubmitted: status.documents.length,
      parentalConsentStatus: status.parentalConsents.length > 0 ? 
        status.parentalConsents[0].status.toUpperCase() : 
        undefined,
      lastVerificationDate: status.documents[0]?.verifiedAt,
      creativeCommonsLicense: 'CC BY-SA 4.0 - https://creativecommons.org/licenses/by-sa/4.0/'
    };
  }

  /**
   * Clean up expired parental consent requests
   */
  async cleanupExpiredConsents(): Promise<number> {
    const now = new Date();
    let cleaned = 0;

    for (const [id, consent] of Array.from(this.parentalConsents.entries())) {
      if (consent.status === 'pending' && now > consent.expiresAt) {
        consent.status = 'expired';
        cleaned++;
      }
    }

    return cleaned;
  }
}

// Singleton instance
export const ageVerificationService = new AgeVerificationService();

// Utility functions
export const AgeVerificationUtils = {
  /**
   * Check if user meets minimum age requirements for platform features
   */
  checkFeatureAccess: (age: number, feature: string): boolean => {
    const minimumAges = {
      'basic_education': 13,
      'community_features': 16,
      'relationship_matching': 18,
      'advanced_health_tracking': 18,
      'cooperative_features': 18
    };

    return age >= (minimumAges[feature as keyof typeof minimumAges] || 18);
  },

  /**
   * Generate secure verification codes
   */
  generateVerificationCode: (): string => {
    return crypto.randomBytes(8).toString('hex').toUpperCase();
  },

  /**
   * Validate document file types
   */
  isValidDocumentFile: (fileName: string): boolean => {
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf', '.heic'];
    const ext = path.extname(fileName).toLowerCase();
    return allowedExtensions.includes(ext);
  },

  /**
   * Get Creative Commons license badge HTML
   */
  getCCLicenseBadge: (): string => {
    return `
    <div class="cc-license-badge">
      <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">
        <img alt="Creative Commons License" style="border-width:0" 
             src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" />
      </a>
      <br />
      <span xmlns:dct="http://purl.org/dc/terms/" property="dct:title">503 610 6762 Age Verification System</span> 
      is licensed under a 
      <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">
        Creative Commons Attribution-ShareAlike 4.0 International License
      </a>.
    </div>
    `;
  }
};