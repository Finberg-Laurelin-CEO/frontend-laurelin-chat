# Beads Issue Tracker Usage Guide - Frontend

This project uses [Beads](https://github.com/steveyegge/beads) - a dependency-aware issue tracker designed for AI-assisted development workflows.

## Quick Setup

To use Beads in your development session:

```bash
# Add Beads to your PATH (run this in your shell)
export PATH="$PATH:/Users/Joe/go/bin"

# Or use the setup script
source ./setup-beads.sh
```

## Current Project Status

### Epic: Angular Frontend - Laurelin Chat Application
- **Main Epic**: `frontend-laurelin-chat-1` - Angular Frontend - Laurelin Chat Application
- **Status**: Open (P0 priority)

### Key Features Being Tracked

1. **Google OAuth Authentication** (`frontend-laurelin-chat-2`)
   - Secure user authentication with Google Sign-In
   - User profile management

2. **Real-time Chat Interface** (`frontend-laurelin-chat-3`)
   - Beautiful chat UI with message history
   - Real-time message updates

3. **AI Model Integration** (`frontend-laurelin-chat-4`)
   - Integration with OpenAI GPT and Google Gemini
   - Backend API communication

4. **A/B Testing Panel** (`frontend-laurelin-chat-5`)
   - Model comparison interface
   - User assignment display

5. **Session Management** (`frontend-laurelin-chat-6`)
   - Persistent chat sessions
   - Firestore backend integration

6. **Responsive Design & Styling** (`frontend-laurelin-chat-7`)
   - Modern, mobile-friendly design
   - Material Design components

## Common Commands

### View Issues
```bash
bd list                    # List all issues
bd list --status open      # List open issues only
bd list --priority 0       # List highest priority issues
bd ready                   # Show work ready to start (no blockers)
```

### Create Issues
```bash
bd create "Fix login bug"                    # Basic issue
bd create "Add feature" -p 0 -t feature      # High priority feature
bd create "Write tests" -d "Unit tests"      # With description
```

### Manage Dependencies
```bash
bd dep add issue-1 issue-2        # Add dependency (issue-2 blocks issue-1)
bd dep tree issue-1               # Show dependency tree
bd dep cycles                     # Detect circular dependencies
```

### Update Issues
```bash
bd update issue-1 --status in_progress
bd update issue-1 --priority 1
bd update issue-1 --assignee developer
```

### Close Issues
```bash
bd close issue-1
bd close issue-1 --reason "Fixed in PR #42"
```

## Development Workflow

1. **Check Ready Work**: `bd ready` - Shows issues with no blockers
2. **Claim Work**: Update issue status to `in_progress`
3. **Track Progress**: Update descriptions, add comments
4. **Close When Done**: Close issues with completion reason

## Git Integration

Beads automatically syncs with git:
- Issues are exported to `.beads/issues.jsonl` after changes
- Import happens automatically when pulling from git
- No manual export/import needed for normal workflow

## Database Location

- **Local Database**: `.beads/frontend-laurelin-chat.db`
- **JSONL Export**: `.beads/issues.jsonl` (for git sync)
- **Auto-discovery**: Beads finds the database automatically

## Agent-Friendly Features

- **JSON Output**: Use `--json` flag for programmatic access
- **Dependency Awareness**: Prevents duplicate work
- **Ready Work**: Shows unblocked tasks perfect for AI agents
- **Structured Data**: All data stored in SQLite for queries

## Frontend-Specific Notes

This is an Angular 20.3.5 application with:
- TypeScript for type safety
- Component-based architecture
- Service-based business logic
- Material Design styling
- Google OAuth integration

## Troubleshooting

### Command Not Found
```bash
# Make sure Go bin is in PATH
export PATH="$PATH:/Users/Joe/go/bin"
which bd
```

### Database Issues
```bash
# Check database location
bd list --json | head -1

# Reinitialize if needed (DESTROYS DATA!)
rm -rf .beads/
bd init
```

### Git Conflicts
```bash
# Resolve conflicts in .beads/issues.jsonl
# Then sync to database
bd import -i .beads/issues.jsonl
```

## Resources

- [Beads GitHub Repository](https://github.com/steveyegge/beads)
- [Beads Documentation](https://github.com/steveyegge/beads/blob/main/README.md)
- [Agent Integration Guide](https://github.com/steveyegge/beads/blob/main/AGENTS.md)

## Current Project Statistics

Run `bd stats` to see current project metrics including:
- Total issues created
- Issues by status
- Issues by priority
- Dependency relationships
