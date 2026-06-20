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
    let currentPerson: Person | null = null;

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      const parts = trimmed.split(' ');
      const level = parseInt(parts[0]);
      const tag = parts[1];
      const value = parts.slice(2).join(' ');

      if (level === 0 && tag.startsWith('@') && parts[2] === 'INDI') {
        // New individual record
        const id = tag.slice(1, -1); // Remove @ symbols
        currentPerson = { id, name: '' };
        people[id] = currentPerson;
      } else if (currentPerson && level === 1) {
        switch (tag) {
          case 'NAME':
            currentPerson.name = value.replace(/\//g, ''); // Remove GEDCOM name markers
            break;
          case 'BIRT':
            // Birth date will be on next line typically
            break;
          case 'FAMC': // Family as child
            const familyId = value.slice(1, -1);
            // Link to parents (would need family records processing)
            break;
        }
      }
    }

    return {
      people,
      rootPerson: rootPersonId
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