# Contributing to Women Safety Index

Thank you for considering contributing to the Women Safety Index project! This document provides guidelines and instructions for contributing.

## 🌟 Ways to Contribute

### 1. Add More Cities
Help us expand coverage to more Indian cities!

**What we need:**
- City name and state
- Safety scores (0-100 scale)
  - Overall safety score
  - Lighting score
  - Public transport score
  - Crowd management score
  - Women review score
- Budget level (Low/Medium/High)
- Popular activities
- GPS coordinates
- Safety alerts
- Pros and cons

**How to contribute:**
1. Research the city thoroughly
2. Add to `/data/cities-expanded.ts`
3. Submit a pull request

### 2. Improve Safety Data
Update existing city data with:
- Recent safety incidents
- New infrastructure (metro, lighting)
- Updated police station counts
- Current safety initiatives

### 3. Report Bugs
Found a bug? Help us fix it!

**Before reporting:**
- Check if it's already reported
- Try to reproduce it
- Note your environment (browser, OS)

**Create an issue with:**
- Clear title
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Browser console errors

### 4. Suggest Features
Have ideas for improvement?

**Good feature requests include:**
- Clear problem statement
- Proposed solution
- Use cases
- Mockups (if UI change)

### 5. Improve Documentation
Help others use the platform!
- Fix typos
- Clarify confusing sections
- Add examples
- Translate to other languages

### 6. Code Contributions
Improve the codebase!
- Bug fixes
- Performance optimizations
- New features
- Test coverage
- Accessibility improvements

## 🚀 Getting Started

### Development Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/women-safety-index.git
   cd women-safety-index
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Make your changes**
   - Write clean, readable code
   - Follow existing patterns
   - Add comments for complex logic

6. **Test thoroughly**
   - Test on multiple browsers
   - Test mobile responsive
   - Test dark/light modes
   - Test with and without Supabase

7. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

8. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

9. **Create Pull Request**
   - Describe what you changed
   - Reference any related issues
   - Add screenshots if UI change

## 📝 Code Style Guidelines

### TypeScript
```typescript
// ✅ Good
interface City {
  id: number;
  name: string;
}

const fetchCities = async (): Promise<City[]> => {
  // Implementation
};

// ❌ Avoid
const getCities = () => {
  // No type annotations
};
```

### React Components
```typescript
// ✅ Good - Named exports, typed props
interface CityCardProps {
  city: City;
  onSelect?: (city: City) => void;
}

export function CityCard({ city, onSelect }: CityCardProps) {
  // Implementation
}

// ❌ Avoid - Default exports, no types
export default function CityCard(props) {
  // Implementation
}
```

### Naming Conventions
- **Components**: PascalCase (`CityCard.tsx`)
- **Hooks**: camelCase with `use` prefix (`useCities.ts`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_CITIES`)
- **Types/Interfaces**: PascalCase (`City`, `CityCardProps`)

### File Organization
```
components/
├── CityCard.tsx          # Component
├── Dashboard.tsx         # Page component
└── ui/                   # Reusable UI components
    └── button.tsx

lib/
├── supabase.ts          # Backend operations
├── use-cities.ts        # Data hooks
└── utils.ts             # Utility functions

data/
└── cities-expanded.ts   # Data files
```

## 🧪 Testing

### Manual Testing Checklist
Before submitting PR, verify:

- [ ] Code runs without errors
- [ ] No console warnings
- [ ] Works in Chrome, Firefox, Safari
- [ ] Mobile responsive
- [ ] Dark mode works
- [ ] All links work
- [ ] Forms validate properly
- [ ] Search/filter/sort works
- [ ] Comparison works
- [ ] Map displays correctly

### Future: Automated Tests
We're planning to add:
- Unit tests (Jest)
- Component tests (React Testing Library)
- E2E tests (Playwright)

## 🎨 Design Guidelines

### UI/UX Principles
1. **Clean and Minimal**: Avoid clutter
2. **Accessibility First**: WCAG 2.1 AA compliance
3. **Mobile-First**: Design for small screens first
4. **Consistent**: Follow existing patterns
5. **Performant**: Optimize images and code

### Color Palette
```css
/* Primary */
--purple-600: #9333ea;
--pink-600: #ec4899;

/* Safety Indicators */
--green-500: #10b981;  /* Safe */
--yellow-500: #f59e0b; /* Moderate */
--red-500: #ef4444;    /* Unsafe */

/* Neutrals */
--gray-50: #f9fafb;
--gray-900: #111827;
```

### Typography
- Use system font stack
- Maintain existing font sizes
- Don't override default typography unless necessary

## 📋 Pull Request Guidelines

### PR Title Format
```
<type>: <description>

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Formatting changes
- refactor: Code restructuring
- test: Adding tests
- chore: Maintenance tasks
```

### PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Changes Made
- Change 1
- Change 2

## Testing Done
- [ ] Manual testing
- [ ] Browser compatibility
- [ ] Mobile testing

## Screenshots (if applicable)
[Add screenshots]

## Related Issues
Closes #123
```

### PR Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings/errors
- [ ] Tested thoroughly
- [ ] Mobile responsive
- [ ] Dark mode works

## 🔒 Security Contributions

### Reporting Vulnerabilities
**DO NOT** create public issues for security vulnerabilities!

Instead:
1. Email: security@womensafetyindex.com
2. Include:
   - Vulnerability description
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### Security Guidelines
- Never commit API keys or secrets
- Use environment variables
- Follow RLS best practices
- Validate all user inputs
- Sanitize data before database operations

## 🌍 Adding New Cities

### Data Requirements
```typescript
{
  id: number;              // Unique ID
  city: string;            // City name
  state: string;           // State name
  safetyScore: number;     // 0-100 (overall)
  lightingScore: number;   // 0-100
  publicTransportScore: number; // 0-100
  crowdScore: number;      // 0-100
  womenReviewScore: number; // 0-100
  budgetLevel: 'Low' | 'Medium' | 'High';
  activities: string[];    // At least 3
  coordinates: {
    lat: number;          // Latitude
    lng: number;          // Longitude
  };
  alerts: string[];       // At least 2
  pros: string[];         // At least 3
  cons: string[];         // At least 2
}
```

### Data Sources
Use reliable sources:
- Government reports
- NGO statistics
- News articles (reputable)
- Academic studies
- Community surveys

**Cite sources** in PR description!

### Data Validation
- Scores must be 0-100
- Coordinates must be accurate
- Budget level must reflect reality
- Activities must be popular/available
- Alerts must be current (within 6 months)

## 📚 Documentation Contributions

### What to Document
- New features
- API changes
- Configuration options
- Setup steps
- Troubleshooting tips
- Best practices

### Documentation Style
- Clear and concise
- Use examples
- Include code snippets
- Add screenshots
- Write for beginners

## 🎯 Priority Areas

### High Priority
1. Adding more cities (target: 100+)
2. Improving safety scores accuracy
3. Mobile app development
4. Admin dashboard

### Medium Priority
1. User authentication
2. Advanced analytics
3. Email notifications
4. Export functionality

### Low Priority
1. Social sharing
2. Dark mode refinements
3. Performance optimizations
4. Additional languages

## 🏆 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Given credit in documentation

Top contributors may be invited to join the core team!

## 📞 Communication

### Channels
- **GitHub Issues**: Bug reports, feature requests
- **GitHub Discussions**: General questions, ideas
- **Pull Requests**: Code review, feedback
- **Email**: contact@womensafetyindex.com

### Response Times
- Issues: Within 48 hours
- PRs: Within 1 week
- Security issues: Within 24 hours

## ❓ Questions?

Not sure about something? Ask!
- Open a discussion
- Comment on an issue
- Send an email

We're here to help! 💜

---

Thank you for contributing to making travel safer for women! 🛡️
