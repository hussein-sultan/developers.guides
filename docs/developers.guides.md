<h1 style='color:orange'>  Developers Guides </h1>


## Main Sections

- [Api-Structure Guides](#api-structure-guides)
- [CustomDialog Guides](#customdialog-guides)
- [CustomAlert Guides](#customalert-guides)
- [CustomForm Guides](#customform-guides)

This document is the main starting point for team guides in this project.
It provides general development rules, acts as an index for other guides.

## Purpose

Use this handbook to keep implementation style consistent across features.
When adding a new module, check this file first and follow the same patterns.

<a id="api-structure-guides"></a>
<h2 style="color:green; margin-top:32px; margin-bottom:18px;">Api-Structure Guides</h2>

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

Edge case examples:

1. Full URL should bypass base URL

```ts
const usersService = createService<User>({
  url: 'https://api.partner.com/v1/users'
})
```

1. Endpoint with leading slash is normalized

```ts
const usersService = createService<User>({ endpoint: '/users' })
// normalizeEndpoint removes leading slashes before base URL is applied
```

1. Body that is already BodyInit is not JSON-stringified

```ts
const formData = new FormData()
formData.append('file', file)

await apiRequest<{ ok: boolean }>(
  { endpoint: '/upload' },
  {},
  { method: 'POST', body: formData }
)
```

1. Optional id in `get` and `update` methods

```ts
// Prefer getAll() when you do not have an id
await usersService.getAll({}, {})

// Use get(id) only when id exists
await usersService.get('123', {}, {})
```

1. HTTP failure must be checked before using data

```ts
const result = await usersService.get('123', { failure: 'Cannot load user' })

if (!result.success) {
  console.error(result.error)
  return
}

console.log(result.data)
```

1. Network/runtime errors are returned as failure Result

```ts
const result = await usersService.get('123', {})

if (!result.success) {
  // Includes message and error info from catch block
  console.error(result.error.message)
}
```

## How To Work With Services

1. Define the entity type you expect from the backend.
2. Create one service per resource with `createService<T>({ endpoint: '/resource' })`
   or with a full URL like `createService<T>({ url: 'https://api.example.com/resource' })`.
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

<a id="customdialog-guides"></a>
<h2 style="color:green; margin-top:32px; margin-bottom:18px;">CustomDialog Guides</h2>

Reference component: [components/customs/CustomDialog.tsx](components/customs/CustomDialog.tsx)

Related files:

- [types/customs.ts](types/customs.ts): defines `CustomDialogProps` contract.

CustomDialog supports two usage styles:

- Controlled mode: pass `open` and `setOpen` from parent state.
- Internal mode: do not pass `open` and `setOpen`; the dialog manages itself.

Required props:

- `trigger`: the element used to open the dialog.
- `children`: the dialog body content.

Optional props:

- `title`: dialog title.
- `actions`: footer action buttons.
- `open` and `setOpen`: for controlled state.

Usage rules:

- Use controlled mode when parent logic needs full control of dialog state.
- Use internal mode for simple and local dialogs.
- Keep dialog body focused and move side effects to action handlers.
- Keep destructive actions explicit in `actions` with clear labels.

Edge case examples:

1. Controlled mode should always use parent state

```tsx
const [open, setOpen] = useState(false)

<CustomDialog
  open={open}
  setOpen={setOpen}
  trigger={<button type="button">Open</button>}
>
  Controlled dialog content
</CustomDialog>
```

1. Internal mode should not pass `open` or `setOpen`

```tsx
<CustomDialog trigger={<button type="button">Open</button>}>
  Internal dialog content
</CustomDialog>
```

1. Trigger is required

```tsx
// Do not render CustomDialog without trigger.
// The trigger element is the entry point to open the dialog.
```

1. Optional `actions` should be used only when needed

```tsx
<CustomDialog
  trigger={<button type="button">Open</button>}
  actions={<button type="button">Save</button>}
>
  Content with footer actions
</CustomDialog>
```

1. Parent close flow in controlled mode

```tsx
const [open, setOpen] = useState(false)

function handleDeleteSuccess() {
  setOpen(false)
}
```

<a id="customalert-guides"></a>
<h2 style="color:green; margin-top:32px; margin-bottom:18px;">CustomAlert Guides</h2>

Reference component: [components/customs/CustomAlert.tsx](components/customs/CustomAlert.tsx)

Related files:

- [hooks/useAlert.ts](hooks/useAlert.ts): controls open/close state and auto-open behavior.
- [types/customs.ts](types/customs.ts): defines `CustomAlertProps` contract.

CustomAlert is a reusable Snackbar + Alert wrapper for user feedback.

Display modes:

- Auto mode: pass `message` without `trigger`; it opens automatically when message changes.
- Trigger mode: pass `trigger`; it opens when the trigger is clicked.

Important props:

- `severity`: required level (`success`, `error`, `warning`, `info`).
- `message`: alert content.
- `duration`: auto-hide timeout (default is 6000 ms).
- `variant` and `icon`: visual customization.

Usage rules:

- Match `severity` to the action result.
- Keep messages short and clear for users.
- Use trigger mode for manual actions, and auto mode for async outcomes.
- Do not expose raw technical errors directly in the alert text.
- If you need to trigger notifications inside a class or a plain function (outside React component/hook context), do not use CustomAlert directly; use a toast solution instead.

Edge case examples:

1. Auto mode for async success/failure result

```tsx
<CustomAlert
  severity="success"
  message={saveResult.success ? 'Saved successfully' : 'Failed to save'}
/>
```

1. Trigger mode for manual alert opening

```tsx
<CustomAlert
  severity="info"
  message="Preview only"
  trigger={<button type="button">Show info</button>}
/>
```

1. No message means no visible alert in auto mode

```tsx
<CustomAlert severity="info" message={undefined} />
```

1. Non-UI contexts should use toast

```ts
class UserService {
  save() {
    // CustomAlert cannot be triggered here directly.
    // Use a toast utility/event bus that is app-wide.
    toast.error('Save failed')
  }
}
```

<a id="customform-guides"></a>
<h2 style="color:green; margin-top:32px; margin-bottom:18px;">CustomForm Guides</h2>

Reference component: [components/customs/CustomForm.tsx](components/customs/CustomForm.tsx)

Related files:

- [providers/CustomFormProvider.tsx](providers/CustomFormProvider.tsx): provides form context and renders the `<form>` element.
- [types/customs.ts](types/customs.ts): defines `CustomFormProps` and `CustomFormProviderProps`.

CustomForm builds typed form state using react-hook-form and supports schema or custom resolver validation.

Validation strategy:

- If `resolver` is passed, it is used first.
- If `resolver` is not passed and `schema` exists, `yupResolver(schema)` is used.

Important props:

- `onSubmit`: required submit handler.
- `children`: form fields/content.
- `defaultValues`: initial form values.
- `schema` or `resolver`: validation configuration.
- `config`: additional useForm options.
- `formId`: optional id for external submit triggers.

Usage rules:

- Use one clear validation strategy per form.
- Keep field rendering inside `children`.
- Keep side effects in `onSubmit` or action handlers, not in field components.
- Reuse shared form types from [types/customs.ts](types/customs.ts).

Edge case examples:

1. Resolver takes priority over schema

```tsx
<CustomForm<UserForm>
  schema={userSchema}
  resolver={customResolver}
  onSubmit={handleSubmit}
>
  {children}
</CustomForm>
```

1. No schema and no resolver still works (basic form state only)

```tsx
<CustomForm<UserForm> onSubmit={handleSubmit}>
  {children}
</CustomForm>
```

1. External submit button using `formId`

```tsx
<CustomForm<UserForm> formId="user-form" onSubmit={handleSubmit}>
  {children}
</CustomForm>

<button type="submit" form="user-form">Save</button>
```

1. `defaultValues` should match the form type shape

```tsx
type UserForm = { name: string; age: number }

<CustomForm<UserForm>
  defaultValues={{ name: '', age: 0 }}
  onSubmit={handleSubmit}
>
  {children}
</CustomForm>
```

1. Async submit with failure guard

```tsx
const onSubmit: SubmitHandler<UserForm> = async (values) => {
  const result = await userService.create(values, { failure: 'Create failed' })
  if (!result.success) return
  // success flow only
}
```
