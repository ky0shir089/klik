# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Use pnpm. `pnpm-lock.yaml` is present.

- `pnpm install` — install dependencies
- `pnpm dev` — run Next.js dev server at `http://localhost:3000`
- `pnpm build` — build production app
- `pnpm start` — run production server after build
- `pnpm lint` — run ESLint
- `pnpm exec tsc --noEmit` — run TypeScript check using `tsconfig.json`

No test runner or `test` script is configured, and no project test files exist under `src/` at time of writing. Single-test command does not exist until a test runner is added.

## Architecture

This is a Next.js App Router finance/admin app for Klik Lelang.

- `src/app/(auth)` contains auth pages and server actions for login, forgot/reset password, and change password.
- `src/app/(dashboard)` contains authenticated business modules: `setup-aplikasi`, `accounting`, `finance`, `klik`, `workflow`, and `report`.
- Route segments usually keep route-specific `page.tsx`, `action.ts`, `columns.tsx`, and `_components/*` together.
- `src/data/*` contains server-only read/query wrappers around backend API endpoints. These functions usually call `axiosInstance.get(...)`, pass `page`, `size`, `search`, and return parsed API data or `parseAxiosError(...)` results.
- Route-local `action.ts` files contain mutations and file operations. They validate with Zod schemas from `src/lib/formSchema.ts`, call backend API through `axiosInstance`, and return backend response objects.
- Shared UI lives in `src/components` and `src/components/ui`. Components follow shadcn/Radix style with Tailwind CSS v4 tokens in `src/app/globals.css`; `cn()` in `src/lib/utils.ts` combines `clsx` and `tailwind-merge`.
- Path alias `@/*` maps to `./src/*`.

## Auth and API flow

- Runtime env is validated in `src/lib/env.ts`: `API_URL`, `KLIK_API_TOKEN`, and `NEXT_PUBLIC_BASE_URL` are required.
- `src/lib/axios.ts` creates server-only Axios client with `baseURL: env.API_URL`, JSON defaults, 30s timeout, and `Authorization: Bearer <access_token>` from session cookie.
- Login action stores `user` and `access_token` as httpOnly cookies until end of day.
- Dashboard layout reads `getSessionUser()`, redirects missing sessions to `/login`, fetches navigation, and uses `redirectIfUnauthorized(...)` for expired sessions.
- `parseAxiosError(...)` converts HTTP 401/403/404 into marker objects (`isUnauthorized`, `isForbidden`, `isNotFound`). Server components should call `redirectIfUnauthorized(...)`; client actions/forms should use `useExpiredSessionRedirect()`.
- `/logout` clears session cookies then redirects to `/login`; `/api/logout` clears cookies and returns JSON.

## Page/data patterns

- List pages are server components that read `searchParams`, call `src/data/*` functions, handle unauthorized/forbidden results, then render `DataTable` with `columns` and API pagination metadata.
- `SearchBox` writes debounced `q` query params and resets `page` to `1`.
- `DataTable` uses TanStack React Table with manual pagination backed by `page` and `size` query params.
- Forms are client components using `react-hook-form`, `zodResolver`, schemas from `src/lib/formSchema.ts`, `useTransition`, and `sonner` toasts.
- File upload mutations build `FormData` and set `Content-Type: multipart/form-data` on the Axios request.
- File download actions commonly request `arraybuffer`, wrap response data in `File`, and client components pass result to `useAuthenticatedFileDownload()`.

## Next.js/config notes

- `next.config.ts` enables React Compiler, sets `allowedDevOrigins: ["192.168.77.251"]`, allows selected remote image hosts, and sets Server Actions body limit to `2mb`.
- ESLint uses `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript` via flat config.
- TypeScript is strict, uses `moduleResolution: "bundler"`, `jsx: "react-jsx"`, and includes Next-generated types.
