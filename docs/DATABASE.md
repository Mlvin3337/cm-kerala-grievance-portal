# Database Documentation

## 1. Overview

The CM Kerala Grievance Portal uses a MySQL-compatible relational database hosted on TiDB Cloud.

**Database name:** `cm_kerala_grievance`

The database stores user accounts, departments, grievances, assignments, attachments, grievance history, citizen feedback, and contact enquiries.

## 2. Database Tables

The database contains eight main tables.

| Table | Purpose |
|---|---|
| `users` | Stores citizen, department officer, and administrative user accounts. |
| `departments` | Stores department information. |
| `grievances` | Stores grievances submitted by citizens and their associated details. |
| `attachments` | Stores metadata and references for files attached to grievances. |
| `grievance_history` | Maintains grievance status and activity history. |
| `department_assignments` | Maintains department and officer assignment information for grievances. |
| `citizen_feedback` | Stores feedback submitted by citizens. |
| `contact_enquiries` | Stores enquiries submitted through the contact section. |

## 3. Conceptual Database Relationships

The database is organized around the following relationships:

- A citizen can submit multiple grievances.
- A grievance can have associated attachments.
- A grievance can have multiple history records as it progresses.
- Grievances can be assigned to departments and officers.
- Departments can be associated with multiple grievances.
- Citizens can submit feedback related to their grievance experience.

The exact foreign-key constraints and column definitions should be verified against the deployed database schema.

## 4. Database Configuration

The backend connects to TiDB Cloud using the MySQL-compatible database driver.

Configuration is managed through environment variables:

| Variable | Description |
|---|---|
| `DB_HOST` | Database host |
| `DB_USER` | Database username |
| `DB_PASSWORD` | Database password |
| `DB_NAME` | Database name |
| `DB_PORT` | Database port |
| `DB_SSL` | Enables SSL connection |
| `DB_SSL_CA` | SSL certificate content |

Sensitive database credentials must never be committed to GitHub.

## 5. Useful SQL Commands

Show all database tables:

```sql
SHOW TABLES;
```

View a table structure:

```sql
DESCRIBE users;
```

View all records:

```sql
SELECT * FROM grievances;
```

Count records in a table:

```sql
SELECT COUNT(*) FROM grievances;
```

Inspect table creation statements:

```sql
SHOW CREATE TABLE grievances;
```

## 6. Database Backup

Create a database backup using `mysqldump`:

```bash
mysqldump -u root -p --databases cm_kerala_grievance --routines --triggers --events --single-transaction > database_backup.sql
```

For production, use the appropriate TiDB connection details and credentials.

Database backups should be stored securely and excluded from version control.

## 7. Data Security

- Store database credentials in environment variables.
- Use SSL for remote database connections.
- Restrict database access to authorized services.
- Use parameterized queries to reduce SQL injection risks.
- Avoid exposing sensitive user information through API responses.
- Maintain regular database backups.

## 8. Hosting

The production database is hosted on **TiDB Cloud** and accessed by the Express backend deployed on Render.

The React frontend does not connect directly to the database. All database operations are performed through backend API endpoints.