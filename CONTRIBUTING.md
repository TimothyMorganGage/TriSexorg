# Contributing to ⚧️ TriSex.org

Thank you for your interest in contributing to ⚧️ TriSex.org! This project is dedicated to creating an inclusive, comprehensive sexual health platform that serves diverse communities.

## 🌟 Our Mission

TriSex.org is committed to:
- **Reproductive Justice**: Empowering users with personalized protection solutions
- **2SLGBTIQA+ Inclusivity**: Specialized support for diverse sexual orientations and gender identities
- **Open Source Ethics**: All verification systems licensed under Creative Commons BY-SA 4.0
- **Community Cooperation**: Cooperative financial models and community-driven development

## 🤝 How to Contribute

### Code Contributions

1. **Fork the Repository**
   ```bash
   git clone https://github.com/[username]/trisex.git
   cd trisex
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Your Changes**
   - Follow our TypeScript coding standards
   - Ensure accessibility compliance
   - Add tests for new functionality
   - Update documentation as needed

4. **Test Your Changes**
   ```bash
   npm test
   npm run dev  # Verify functionality
   ```

5. **Submit a Pull Request**
   - Provide clear description of changes
   - Reference any related issues
   - Ensure CI checks pass

### Areas We Need Help

- **Accessibility Improvements**: ASL/BSL integration, braille support
- **Internationalization**: Multi-language support
- **Security Audits**: Age verification and genealogical systems
- **Documentation**: User guides, API documentation
- **Testing**: Unit tests, integration tests, accessibility testing
- **Design**: Inclusive UI/UX improvements

## 📋 Development Guidelines

### Code Style
- Use TypeScript throughout
- Follow existing naming conventions
- Include JSDoc comments for functions
- Use Prettier for formatting
- Follow React best practices

### Commit Messages
```
feat: add genealogical verification system
fix: resolve age verification null checks
docs: update API documentation
test: add unit tests for STI tracking
style: improve accessibility contrast ratios
```

### File Organization
```
client/src/
├── components/        # Reusable UI components
├── pages/            # Application pages
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
└── types/            # TypeScript type definitions

server/
├── routes.ts         # API endpoints
├── storage.ts        # Data persistence
├── ageVerification.ts # Identity verification
└── genealogy.ts      # Relationship verification
```

## 🔒 Security Guidelines

### Age Verification System
- All verification logic must be auditable
- Document processing must remain local
- Parental consent workflows require encryption
- Maintain audit trails for compliance

### Data Privacy
- Minimize data collection
- Implement data retention policies
- Secure file upload handling
- Regular security audits

### Genealogical Verification
- Wright's coefficient calculations must be mathematically sound
- GEDCOM parsing must be robust
- Relationship verification must be accurate within 8 degrees

## 🌍 Community Standards

### Inclusive Language
- Use gender-neutral terminology
- Respect diverse identities and orientations
- Avoid assumptions about relationships or family structures
- Follow 2SLGBTIQA+ inclusive practices

### Cultural Sensitivity
- Consider diverse cultural backgrounds
- Respect different approaches to sexual health
- Acknowledge historical trauma and systemic barriers
- Center marginalized voices in design decisions

## 📜 Licensing

All contributions must be compatible with Creative Commons BY-SA 4.0:

- **Attribution**: Credit original creators
- **ShareAlike**: Derivatives must use same license
- **Open Source**: No proprietary restrictions
- **Commercial Use**: Permitted with proper attribution

## 🐛 Bug Reports

When reporting bugs, please include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details (browser, OS, etc.)
- Screenshots if applicable

## 💡 Feature Requests

For new features:
- Describe the problem you're solving
- Explain how it aligns with our mission
- Consider accessibility implications
- Suggest implementation approach
- Think about community impact

## 🧪 Testing

We use:
- **Unit Tests**: Jest for component testing
- **Integration Tests**: API endpoint testing
- **Accessibility Tests**: axe-core integration
- **Security Tests**: OWASP compliance
- **Performance Tests**: Load testing for verification systems

## 📞 Getting Help

- **GitHub Issues**: Technical questions and bug reports
- **Discussions**: Community conversations and feature ideas
- **Security Issues**: Email security@trisex.org (private disclosure)
- **Accessibility**: accessibility@trisex.org for a11y improvements

## 🎯 Current Priorities

1. **Age Verification Enhancement**: Improve OCR accuracy and document support
2. **Genealogical System**: Optimize Wright's coefficient calculations
3. **Accessibility**: Complete WCAG 2.1 AA compliance
4. **Testing Coverage**: Increase test coverage to 90%+
5. **Documentation**: Complete API and user documentation

## 📈 Recognition

Contributors will be recognized:
- **GitHub Contributors**: Listed in repository
- **Major Features**: Credited in release notes
- **Community Leadership**: Special recognition
- **Long-term Commitment**: Core team invitation

---

Thank you for helping build a more inclusive and comprehensive sexual health platform! 🌟