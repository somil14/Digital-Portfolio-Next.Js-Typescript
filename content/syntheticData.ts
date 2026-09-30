/**
 * Everything in this file is invented for the demos. None of it describes a
 * real system, client or vulnerability. Anything rendered from here is
 * labelled "simulated" or "illustrative recreation · synthetic data".
 */
import type {
  HttpMethod,
  SyntheticDiffRow,
  SyntheticEndpoint,
  SyntheticFinding,
  SyntheticRemediation,
  SyntheticRequest,
} from "./types";

type Route = readonly [HttpMethod, string];

interface ClusterSeed {
  cluster: string;
  documented: readonly Route[];
  shadow: readonly Route[];
}

/** Standard CRUD + sub-resource routes for a documented resource. */
function resource(base: string, subs: readonly string[]): Route[] {
  const routes: Route[] = [
    ["GET", base],
    ["POST", base],
    ["GET", `${base}/{id}`],
    ["PATCH", `${base}/{id}`],
    ["DELETE", `${base}/{id}`],
  ];
  for (const sub of subs) {
    routes.push(["GET", `${base}/{id}/${sub}`]);
    routes.push(["POST", `${base}/{id}/${sub}`]);
  }
  return routes;
}

const seeds: readonly ClusterSeed[] = [
  {
    cluster: "/auth",
    documented: [
      ["POST", "/v1/auth/login"],
      ["POST", "/v1/auth/logout"],
      ["POST", "/v1/auth/refresh"],
      ["POST", "/v1/auth/register"],
      ["POST", "/v1/auth/verify-email"],
      ["POST", "/v1/auth/password/forgot"],
      ["POST", "/v1/auth/password/reset"],
      ["GET", "/v1/auth/session"],
      ["GET", "/v1/auth/mfa"],
      ["POST", "/v1/auth/mfa/enroll"],
      ["POST", "/v1/auth/mfa/verify"],
      ["DELETE", "/v1/auth/mfa"],
    ],
    shadow: [["POST", "/v1/auth/impersonate"]],
  },
  {
    cluster: "/users",
    documented: [
      ...resource("/v1/users", ["roles", "sessions", "api-keys"]),
      ["GET", "/v1/users/me"],
      ["PATCH", "/v1/users/me"],
      ["GET", "/v1/users/me/preferences"],
      ["PUT", "/v1/users/me/preferences"],
      ["GET", "/v1/users/search"],
      ["POST", "/v1/users/invite"],
      ["DELETE", "/v1/users/{id}/sessions/{sessionId}"],
      ["DELETE", "/v1/users/{id}/api-keys/{keyId}"],
    ],
    shadow: [["GET", "/v1/users/{id}/raw"]],
  },
  {
    cluster: "/orders",
    documented: [
      ...resource("/v1/orders", ["items", "notes", "refunds", "shipments"]),
      ["GET", "/v1/orders/search"],
      ["POST", "/v1/orders/{id}/cancel"],
      ["POST", "/v1/orders/{id}/confirm"],
      ["GET", "/v1/orders/{id}/timeline"],
      ["GET", "/v1/orders/{id}/invoice"],
      ["PATCH", "/v1/orders/{id}/items/{itemId}"],
      ["DELETE", "/v1/orders/{id}/items/{itemId}"],
    ],
    shadow: [["POST", "/v1/orders/bulk-import"]],
  },
  {
    cluster: "/reports",
    documented: [
      ...resource("/v1/reports", ["runs", "shares"]),
      ["GET", "/v1/reports/templates"],
      ["GET", "/v1/reports/templates/{id}"],
      ["POST", "/v1/reports/{id}/schedule"],
      ["DELETE", "/v1/reports/{id}/schedule"],
      ["GET", "/v1/reports/{id}/runs/{runId}"],
      ["GET", "/v1/reports/{id}/download"],
      ["GET", "/v1/reports/usage"],
    ],
    shadow: [["GET", "/v1/reports/{id}/download.csv"]],
  },
  {
    cluster: "/billing",
    documented: [
      ...resource("/v1/billing/invoices", ["lines", "payments"]),
      ["GET", "/v1/billing/plan"],
      ["PUT", "/v1/billing/plan"],
      ["GET", "/v1/billing/usage"],
      ["GET", "/v1/billing/payment-methods"],
      ["POST", "/v1/billing/payment-methods"],
      ["DELETE", "/v1/billing/payment-methods/{id}"],
      ["GET", "/v1/billing/invoices/{id}/pdf"],
      ["POST", "/v1/billing/invoices/{id}/void"],
      ["GET", "/v1/billing/credits"],
    ],
    shadow: [["POST", "/v1/billing/adjust"]],
  },
  {
    cluster: "/internal",
    documented: [
      ["GET", "/internal/health"],
      ["GET", "/internal/ready"],
      ["GET", "/internal/version"],
      ["GET", "/internal/metrics"],
    ],
    shadow: [
      ["GET", "/internal/v0/export"],
      ["GET", "/internal/debug/config"],
      ["POST", "/internal/cache/flush"],
    ],
  },
];

export const endpoints: SyntheticEndpoint[] = seeds.flatMap((seed) => {
  const build = (routes: readonly Route[], documented: boolean) =>
    routes.map(([method, path]): SyntheticEndpoint => ({
      id: `${method} ${path}`,
      cluster: seed.cluster,
      method,
      path,
      documented,
    }));
  return [...build(seed.documented, true), ...build(seed.shadow, false)];
});

export const clusters = seeds.map((seed) => seed.cluster);

/** The hero readout is computed from the data so it always matches the scene. */
export const endpointStats = {
  total: endpoints.length,
  documented: endpoints.filter((endpoint) => endpoint.documented).length,
  shadow: endpoints.filter((endpoint) => !endpoint.documented).length,
};

/** Lines for the hero request ticker. */
export const requestLog: SyntheticRequest[] = [
  {
    method: "GET",
    path: "/v1/orders",
    status: 200,
    latencyMs: 18,
    inSpec: true,
  },
  {
    method: "POST",
    path: "/v1/auth/refresh",
    status: 200,
    latencyMs: 9,
    inSpec: true,
  },
  {
    method: "GET",
    path: "/internal/v0/export",
    status: 200,
    latencyMs: 31,
    inSpec: false,
  },
  {
    method: "GET",
    path: "/v1/users/me",
    status: 200,
    latencyMs: 12,
    inSpec: true,
  },
  {
    method: "PATCH",
    path: "/v1/orders/{id}",
    status: 200,
    latencyMs: 27,
    inSpec: true,
  },
  {
    method: "POST",
    path: "/v1/billing/adjust",
    status: 200,
    latencyMs: 44,
    inSpec: false,
  },
  {
    method: "GET",
    path: "/v1/reports/{id}/runs",
    status: 200,
    latencyMs: 22,
    inSpec: true,
  },
  {
    method: "POST",
    path: "/v1/auth/login",
    status: 401,
    latencyMs: 14,
    inSpec: true,
  },
  {
    method: "GET",
    path: "/v1/users/{id}/raw",
    status: 200,
    latencyMs: 36,
    inSpec: false,
  },
  {
    method: "DELETE",
    path: "/v1/orders/{id}/items/{itemId}",
    status: 204,
    latencyMs: 16,
    inSpec: true,
  },
];

/**
 * Findings for the triage step. IDs are deliberately not CVE-shaped. CWE
 * entries are real, public weakness classes.
 */
export const findings: SyntheticFinding[] = [
  {
    id: "SYN-0001",
    severity: "critical",
    title: "Export endpoint returns data without authentication",
    cwe: {
      id: "CWE-306",
      name: "Missing Authentication for Critical Function",
    },
    endpoint: "GET /internal/v0/export",
    evidence: "200 OK with no Authorization header · 1.2 MB response",
  },
  {
    id: "SYN-0002",
    severity: "high",
    title: "Order readable by changing the ID in the path",
    cwe: {
      id: "CWE-639",
      name: "Authorization Bypass Through User-Controlled Key",
    },
    endpoint: "GET /v1/orders/{id}",
    evidence: "User A token · order owned by user B · 200 OK",
  },
  {
    id: "SYN-0003",
    severity: "high",
    title: "Raw user record exposes internal fields",
    cwe: {
      id: "CWE-200",
      name: "Exposure of Sensitive Information to an Unauthorized Actor",
    },
    endpoint: "GET /v1/users/{id}/raw",
    evidence: "Response includes password_hash and mfa_secret keys",
  },
  {
    id: "SYN-0004",
    severity: "medium",
    title: "Login accepts unlimited attempts",
    cwe: {
      id: "CWE-307",
      name: "Improper Restriction of Excessive Authentication Attempts",
    },
    endpoint: "POST /v1/auth/login",
    evidence: "500 requests in 60 s from one client · no 429 returned",
  },
  {
    id: "SYN-0005",
    severity: "medium",
    title: "Bulk import has no size limit",
    cwe: {
      id: "CWE-770",
      name: "Allocation of Resources Without Limits or Throttling",
    },
    endpoint: "POST /v1/orders/bulk-import",
    evidence: "48 MB body accepted · worker memory climbed until restart",
  },
  {
    id: "SYN-0006",
    severity: "low",
    title: "Debug config endpoint reachable in production",
    cwe: { id: "CWE-489", name: "Active Debug Code" },
    endpoint: "GET /internal/debug/config",
    evidence: "200 OK · lists feature flags and upstream hostnames",
  },
];

/** Spec-vs-observed rows for the diff step. */
export const specDiff: SyntheticDiffRow[] = [
  { spec: "GET /v1/orders", observed: "GET /v1/orders", state: "match" },
  {
    spec: "GET /v1/orders/{id}",
    observed: "GET /v1/orders/{id}",
    state: "match",
  },
  {
    spec: "PATCH /v1/orders/{id}",
    observed: "PUT /v1/orders/{id}",
    state: "drift",
    note: "method changed",
  },
  {
    spec: "POST /v1/auth/refresh",
    observed: "POST /v1/auth/refresh",
    state: "match",
  },
  {
    spec: "GET /v1/users/search",
    observed: "GET /v1/users/search?include=roles",
    state: "drift",
    note: "parameter added",
  },
  { spec: null, observed: "GET /internal/v0/export", state: "shadow" },
  { spec: "GET /v1/users/me", observed: "GET /v1/users/me", state: "match" },
  { spec: null, observed: "POST /v1/billing/adjust", state: "shadow" },
];

/** Pre-written text the remediation step "streams". Not a live model call. */
export const remediation: SyntheticRemediation = {
  findingId: "SYN-0001",
  summary:
    "GET /internal/v0/export returns a full data export to any caller. The route is not in the OpenAPI spec, so it was never covered by the auth middleware that protects documented routes.",
  steps: [
    "Put the route behind the same authentication middleware as the documented API, or remove it if nothing depends on it.",
    "Restrict it to a service role and log every call.",
    "Add the route to the OpenAPI spec so future drift checks cover it.",
    "Re-run the capture and confirm an unauthenticated request now returns 401.",
  ],
  priority: "P0 · fix before the next release",
};

/** Simulated timings for the pipeline cache toggle. */
export const pipelineLatency = { hitMs: 4, missMs: 48 };
