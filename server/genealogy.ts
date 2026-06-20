import { promises as fs } from 'fs';
import path from 'path';

// Relationship degree calculation types
export interface Person {
  id: string;
  name: string;
  birthYear?: number;
  parents?: string[]; // Array of parent IDs
  children?: string[]; // Array of child IDs
}

export interface FamilyTree {
  people: Record<string, Person>;
  rootPerson: string; // The person who uploaded the tree
}

export interface RelationshipResult {
  isRelated: boolean;
  degree: number | null; // Degrees of separation (e.g., 4 for 3rd cousins)
  relationship: string | null; // Human-readable relationship
  commonAncestor: string | null; // ID of most recent common ancestor
  coefficient: number; // Wright's coefficient of relationship
}

export class GenealogyService {
  private familyTrees: Map<string, FamilyTree> = new Map();

  /**
   * Parse GEDCOM file and extract family tree data
   */
  async parseGEDCOM(filePath: string, userId: string): Promise<FamilyTree> {
    try {
      const gedcomContent = await fs.readFile(filePath, 'utf-8');
      const tree = this.parseGEDCOMContent(gedcomContent, userId);
      this.familyTrees.set(userId, tree);
      return tree;
    } catch (error) {
      throw new Error(`Failed to parse GEDCOM file: ${error}`);
    }
  }

  /**
   * Parse GEDCOM content into family tree structure
   */
  private parseGEDCOMContent(content: string, rootPersonId: string): FamilyTree {
    const lines = content.split('\n');
    const people: Record<string, Person> = {};

    // Family (FAM) records hold the actual parent/child links in GEDCOM.
    interface RawFamily { husband?: string; wife?: string; children: string[]; }
    const families: Record<string, RawFamily> = {};

    let currentPerson: Person | null = null;
    let currentFamilyId: string | null = null;
    let firstIndiId: string | null = null;
    let inBirth = false;

    const stripPointer = (value: string): string =>
      value.startsWith('@') && value.endsWith('@') ? value.slice(1, -1) : value;

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      const parts = trimmed.split(/\s+/);
      const level = parseInt(parts[0], 10);
      if (Number.isNaN(level)) continue;
      const tag = parts[1];
      const value = parts.slice(2).join(' ');

      if (level === 0) {
        // A new top-level record closes any record we were reading.
        currentPerson = null;
        currentFamilyId = null;
        inBirth = false;

        if (tag?.startsWith('@') && parts[2] === 'INDI') {
          const id = stripPointer(tag);
          currentPerson = { id, name: '', parents: [], children: [] };
          people[id] = currentPerson;
          if (!firstIndiId) firstIndiId = id;
        } else if (tag?.startsWith('@') && parts[2] === 'FAM') {
          const id = stripPointer(tag);
          currentFamilyId = id;
          families[id] = { children: [] };
        }
        continue;
      }

      if (currentPerson) {
        if (level === 1) {
          inBirth = false;
          switch (tag) {
            case 'NAME':
              currentPerson.name = value.replace(/\//g, '').trim(); // Remove GEDCOM name markers
              break;
            case 'BIRT':
              inBirth = true; // The DATE arrives on the next (level 2) line
              break;
          }
        } else if (level === 2 && tag === 'DATE' && inBirth) {
          const yearMatch = value.match(/(\d{4})/);
          if (yearMatch) currentPerson.birthYear = parseInt(yearMatch[1], 10);
        }
      } else if (currentFamilyId && level === 1) {
        const fam = families[currentFamilyId];
        switch (tag) {
          case 'HUSB':
            fam.husband = stripPointer(value);
            break;
          case 'WIFE':
            fam.wife = stripPointer(value);
            break;
          case 'CHIL':
            fam.children.push(stripPointer(value));
            break;
        }
      }
    }

    // Resolve parent/child links from the family records.
    for (const fam of Object.values(families)) {
      const parents = [fam.husband, fam.wife].filter((p): p is string => !!p);
      for (const childId of fam.children) {
        const child = people[childId];
        if (!child) continue;
        child.parents = child.parents ?? [];
        for (const parentId of parents) {
          if (!child.parents.includes(parentId)) child.parents.push(parentId);
          const parent = people[parentId];
          if (parent) {
            parent.children = parent.children ?? [];
            if (!parent.children.includes(childId)) parent.children.push(childId);
          }
        }
      }
    }

    return {
      people,
      // The home person (the uploader) is the first individual in the file;
      // ancestor walks start here. Fall back to the supplied id if absent.
      rootPerson: firstIndiId ?? rootPersonId,
    };
  }

  /**
   * Calculate relationship between two people
   */
  calculateRelationship(userId1: string, userId2: string): RelationshipResult {
    const tree1 = this.familyTrees.get(userId1);
    const tree2 = this.familyTrees.get(userId2);

    if (!tree1 || !tree2) {
      return {
        isRelated: false,
        degree: null,
        relationship: null,
        commonAncestor: null,
        coefficient: 0
      };
    }

    // Find common ancestors
    const ancestors1 = this.getAllAncestors(tree1, tree1.rootPerson);
    const ancestors2 = this.getAllAncestors(tree2, tree2.rootPerson);

    // Find most recent common ancestor
    let commonAncestor: string | null = null;
    let minDistance = Infinity;

    for (const [ancestor1, distance1] of Array.from(ancestors1)) {
      for (const [ancestor2, distance2] of Array.from(ancestors2)) {
        if (this.isLikelyMatch(tree1.people[ancestor1], tree2.people[ancestor2])) {
          const totalDistance = distance1 + distance2;
          if (totalDistance < minDistance) {
            minDistance = totalDistance;
            commonAncestor = ancestor1;
          }
        }
      }
    }

    if (!commonAncestor || minDistance === Infinity) {
      return {
        isRelated: false,
        degree: null,
        relationship: null,
        commonAncestor: null,
        coefficient: 0
      };
    }

    // Calculate relationship degree and coefficient
    const degree = Math.floor(minDistance / 2);
    const coefficient = Math.pow(0.5, minDistance);
    const relationship = this.degreeToRelationshipName(degree);

    return {
      isRelated: true,
      degree,
      relationship,
      commonAncestor,
      coefficient
    };
  }

  /**
   * Get all ancestors up to 5 generations (covers 3rd cousins)
   */
  private getAllAncestors(tree: FamilyTree, personId: string, maxGenerations: number = 5): Map<string, number> {
    const ancestors = new Map<string, number>();
    const visited = new Set<string>();
    const queue: [string, number][] = [[personId, 0]];

    while (queue.length > 0) {
      const [currentId, generation] = queue.shift()!;
      
      if (visited.has(currentId) || generation > maxGenerations) {
        continue;
      }

      visited.add(currentId);
      if (generation > 0) {
        ancestors.set(currentId, generation);
      }

      const person = tree.people[currentId];
      if (person?.parents) {
        for (const parentId of person.parents) {
          queue.push([parentId, generation + 1]);
        }
      }
    }

    return ancestors;
  }

  /**
   * Check if two people from different trees are likely the same person
   */
  private isLikelyMatch(person1: Person, person2: Person): boolean {
    if (!person1 || !person2) return false;

    // Simple name matching (could be enhanced with fuzzy matching)
    const name1 = person1.name.toLowerCase().trim();
    const name2 = person2.name.toLowerCase().trim();
    
    if (name1 === name2) return true;

    // Check birth year if available (within 2 years tolerance)
    if (person1.birthYear && person2.birthYear) {
      return Math.abs(person1.birthYear - person2.birthYear) <= 2;
    }

    return false;
  }

  /**
   * Convert relationship degree to human-readable name
   */
  private degreeToRelationshipName(degree: number): string {
    const relationships = [
      "Parent/Child",
      "Grandparent/Grandchild", 
      "1st cousin",
      "2nd cousin",
      "3rd cousin",
      "4th cousin",
      "5th cousin",
      "6th cousin",
      "7th cousin",
      "8th cousin"
    ];

    return relationships[degree] || `${degree}th cousin`;
  }

  /**
   * Check if relationship violates the 3rd-cousin rule
   */
  isRelationshipAllowed(userId1: string, userId2: string): boolean {
    const result = this.calculateRelationship(userId1, userId2);

    // In this model, cousin number = degree - 1 (degree 4 == 3rd cousin).
    // Allow if not related or the relationship is 3rd cousin or more distant.
    return !result.isRelated || (result.degree !== null && result.degree >= 4);
  }

  /**
   * Get blocked matches for a user based on genealogy
   */
  getBlockedMatches(userId: string, potentialMatches: string[]): string[] {
    const blocked: string[] = [];

    for (const matchId of potentialMatches) {
      if (!this.isRelationshipAllowed(userId, matchId)) {
        blocked.push(matchId);
      }
    }

    return blocked;
  }

  /**
   * Store family tree verification status
   */
  async setVerificationStatus(userId: string, status: 'pending' | 'verified' | 'rejected'): Promise<void> {
    // In a real implementation, this would update the database
    // For now, we'll just track in memory
    console.log(`User ${userId} verification status: ${status}`);
  }

  /**
   * Calculate relationship coefficient (Wright's coefficient)
   */
  static calculateCoefficient(generationsToCommonAncestor: number): number {
    return Math.pow(0.5, generationsToCommonAncestor * 2);
  }

  /**
   * Validate GEDCOM file format
   */
  static isValidGEDCOM(content: string): boolean {
    const lines = content.split('\n');
    
    // Check for GEDCOM header
    if (!lines.some(line => line.includes('GEDCOM') || line.includes('HEAD'))) {
      return false;
    }

    // Check for individual records
    if (!lines.some(line => line.includes('INDI'))) {
      return false;
    }

    return true;
  }
}

// Singleton instance
export const genealogyService = new GenealogyService();

// Utility functions for relationship calculations
export const RelationshipUtils = {
  /**
   * Calculate if two people would be closer than 3rd cousins
   */
  isWithinThirdCousinLimit: (generationDistance: number): boolean => {
    // 3rd cousins share great-great-grandparents (8 steps total);
    // anything closer than that is within the blocked limit.
    return generationDistance < 8;
  },

  /**
   * Convert coefficient to percentage
   */
  coefficientToPercentage: (coefficient: number): number => {
    return coefficient * 100;
  },

  /**
   * Get relationship description with generation details
   */
  getDetailedRelationship: (degree: number): string => {
    if (degree === 0) return "Same person";
    if (degree === 1) return "Parent/Child relationship";
    if (degree === 2) return "Grandparent/Grandchild relationship";
    
    const cousinDegree = degree - 1;
    if (cousinDegree === 1) return "1st cousins (share grandparents)";
    if (cousinDegree === 3) return "3rd cousins (share great-great-grandparents)";
    
    return `${cousinDegree}th cousins`;
  }
};