# Developers Guides

This document is the main starting point for team guides in this project.
It provides general development rules, acts as an index for other guides.

## Purpose

Use this handbook to keep implementation style consistent across features.
When adding a new module, check this file first and follow the same patterns.

## Project Request Flow

The request layer is organized in small, clear steps:


- [types/api/request.ts](types/api/request.ts): shared contracts for request options, error shape, and message types.
- [utils/request.ts](utils/request.ts): utility helpers for endpoint cleanup and body type checks.
- [lib/api/request.ts](lib/api/request.ts): low-level request handler that prepares config, executes fetch, does error handling, and returns a unified result using the Result design pattern.
- [lib/api/factory.ts](lib/api/factory.ts): reusable service factory that exposes CRUD methods for each resource.

This separation helps keep business logic clean and avoids repeating fetch logic in many files.

Path rules:

- The `path` object can be a full URL (`url`) or a partial endpoint (`endpoint`).
- If `url` is provided, it is used directly.
- If only `endpoint` is provided, it is combined with the base URL.

## How To Work With Services

1. Define the entity type you expect from the backend.
2. Create one service per resource endpoint with `createService<T>({ endpoint: '/resource' })`.
3. Use service methods in feature-level action or data-access files.
4. Return or map the `Result<T, ApiRequestError>` to the UI layer.
5. Keep UI components focused on rendering and user interaction.

Available service methods:

- `getAll(messages?, options?)`
- `get(id?, messages?, options?)`
- `create(data, messages?, options?)`
- `update(data, id?, messages?, options?)`
- `updateProp(data, id?, messages?, options?)`
- `delete(id?, messages?, options?)`

## Error And Response Handling

Every requests return a consistent `Result` object. 
This makes it easier to handle success and failure in one predictable pattern.

General rules:

- Always handle failure paths, not only success paths, always check failure first before reading success data.
- Show clear user-facing messages for expected failures.
- Keep technical error details in logs, not in user alerts.
- Avoid throwing raw fetch errors directly into UI components.
- Do not use returned data before confirming there is no failure in the result.

## Coding Guidelines

- Requests may be called in service files or action files.
- Do not call requests directly from UI components.
- Reuse shared types instead of redefining request and error shapes.
- Prefer typed service calls over direct `fetch` in feature code.
- Keep endpoints normalized and avoid duplicated slashes.
- Keep each file focused on one responsibility.
