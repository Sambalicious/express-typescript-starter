# Prisma Conventions

This project uses Prisma as the only data-access layer.

## Setup

1. Set DATABASE_URL in your environment.
2. Generate Prisma Client:

```bash
pnpm db:push
```

3. Open Prisma Studio when needed:

```bash
pnpm db:studio
```

## Model Layer Rules

- Keep direct Prisma calls in feature model files.
- Prefer function declarations and small focused model functions.
- Use select to return only required fields.
- Use take, skip, and orderBy for paginated endpoints.
- Keep route/controller files free from raw SQL.

## Query Patterns

Use explicit field selection for reads:

```ts
return database.userProfile.findMany({
  take: pageSize,
  skip: (page - 1) * pageSize,
  orderBy: { createdAt: "desc" },
  select: {
    id: true,
    email: true,
    name: true,
    createdAt: true,
    updatedAt: true,
  },
});
```

## Transactions

Use `database.$transaction` for multi-step writes that must succeed or fail together:

```ts
return database.$transaction(async (tx) => {
  const user = await tx.userProfile.create({ data: userData });
  await tx.auditLog.create({
    data: { userId: user.id, action: "USER_CREATED" },
  });

  return user;
});
```

## Raw SQL

- Prefer Prisma Client methods over raw SQL.
- If raw SQL is required, use `$queryRaw` or `$executeRaw`.
- Avoid `$queryRawUnsafe` and `$executeRawUnsafe` unless values are fully allowlisted and never user-controlled.

## Error Handling

Global error handling maps Prisma known request errors into API-safe responses:

- P2002 -> 409 UNIQUE_CONSTRAINT_VIOLATION
- P2003 -> 409 FOREIGN_KEY_CONSTRAINT_VIOLATION
- P2025 -> 404 RECORD_NOT_FOUND

Do not leak internal database errors to API clients.

## Testing Notes

- Integration tests require a running database.
- If tests fail with "Can't reach database server", start Postgres and re-run migrations.
- Use factories for realistic test records.
