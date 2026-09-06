# Dashboard routes

Role homes (middleware + `requireRole`):

| Role | Path |
|---|---|
| `admin` | `/admin` |
| `staff` | `/staff` |
| `hr` | `/hr` |
| `office_assistant` | `/office` |
| `candidate` | `/candidate` |

Agents and employer companies are **not** Auth users — staff enter them.

RLS in Postgres is the security boundary; these pages are UX guards.
