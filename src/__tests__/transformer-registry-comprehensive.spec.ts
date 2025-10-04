import { TransformerRegistry } from '../registries/transformer.registry';

describe('TransformerRegistry Comprehensive Coverage', () => {
  describe('getTransformerMetadata', () => {
    it('should return metadata for valid case style', () => {
      const metadata = TransformerRegistry.getTransformerMetadata('camelCase');
      expect(metadata).toBeDefined();
      expect(metadata?.caseStyle).toBe('camelCase');
      expect(metadata?.class).toBeDefined();
    });

    it('should return undefined for invalid case style', () => {
      const metadata = TransformerRegistry.getTransformerMetadata('invalid_case');
      expect(metadata).toBeUndefined();
    });
  });

  describe('getAllTransformerMetadata', () => {
    it('should return all transformer metadata', () => {
      const allMetadata = TransformerRegistry.getAllTransformerMetadata();
      expect(allMetadata).toHaveLength(4);
      expect(allMetadata.map((m) => m.caseStyle)).toEqual([
        'camelCase',
        'snake_case',
        'PascalCase',
        'kebab-case',
      ]);
    });

    it('should return a copy of the metadata array', () => {
      const allMetadata1 = TransformerRegistry.getAllTransformerMetadata();
      const allMetadata2 = TransformerRegistry.getAllTransformerMetadata();
      expect(allMetadata1).not.toBe(allMetadata2); // Different array instances
      expect(allMetadata1).toEqual(allMetadata2); // Same content
    });
  });

  describe('getStats', () => {
    it('should return correct statistics', () => {
      const stats = TransformerRegistry.getStats();
      expect(stats.totalTransformers).toBe(4);
      expect(stats.supportedStyles).toHaveLength(4);
      expect(stats.supportedStyles).toContain('camelCase');
      expect(stats.supportedStyles).toContain('snake_case');
      expect(stats.supportedStyles).toContain('PascalCase');
      expect(stats.supportedStyles).toContain('kebab-case');
    });

    it('should return consistent statistics across multiple calls', () => {
      const stats1 = TransformerRegistry.getStats();
      const stats2 = TransformerRegistry.getStats();
      expect(stats1).toEqual(stats2);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string case style', () => {
      expect(TransformerRegistry.isSupported('')).toBe(false);
      expect(TransformerRegistry.getTransformerClass('')).toBeUndefined();
      expect(TransformerRegistry.getTransformerMetadata('')).toBeUndefined();
    });

    it('should handle null/undefined case style', () => {
      expect(TransformerRegistry.isSupported(null as any)).toBe(false);
      expect(TransformerRegistry.getTransformerClass(null as any)).toBeUndefined();
      expect(TransformerRegistry.getTransformerMetadata(null as any)).toBeUndefined();
    });

    it('should handle case sensitivity', () => {
      expect(TransformerRegistry.isSupported('CAMELCASE')).toBe(false);
      expect(TransformerRegistry.isSupported('CamelCase')).toBe(false);
      expect(TransformerRegistry.isSupported('camelcase')).toBe(false);
    });
  });

  describe('Integration Tests', () => {
    it('should work with all available case styles', () => {
      const availableStyles = TransformerRegistry.getAvailableCaseStyles();

      availableStyles.forEach((style) => {
        expect(TransformerRegistry.isSupported(style)).toBe(true);

        const TransformerClass = TransformerRegistry.getTransformerClass(style);
        expect(TransformerClass).toBeDefined();

        if (TransformerClass) {
          const instance = new TransformerClass();
          expect(instance.getCaseStyle()).toBe(style);
        }
      });
    });

    it('should provide consistent metadata across all methods', () => {
      const availableStyles = TransformerRegistry.getAvailableCaseStyles();
      const allMetadata = TransformerRegistry.getAllTransformerMetadata();

      expect(availableStyles).toHaveLength(allMetadata.length);

      availableStyles.forEach((style) => {
        const metadata = TransformerRegistry.getTransformerMetadata(style);
        expect(metadata).toBeDefined();
        expect(metadata?.caseStyle).toBe(style);
      });
    });
  });
});
