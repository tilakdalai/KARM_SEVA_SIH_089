import os
import time
import logging
from collections import defaultdict
from typing import Dict, List, Tuple
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse, Response

logger = logging.getLogger("karmseva.rate_limit")


class RateLimitMiddleware(BaseHTTPMiddleware):
    """
    Sliding-window in-memory Rate Limiter to prevent brute-force and DoS attacks.
    Applies strict thresholding on sensitive endpoints (auth, emergency matching, payouts).
    """

    def __init__(self, app, enabled: bool = True):
        super().__init__(app)
        self.enabled = enabled
        # ip -> list of unix timestamps
        self._requests: Dict[str, List[float]] = defaultdict(list)
        self._auth_requests: Dict[str, List[float]] = defaultdict(list)

    def reset(self):
        """Helper for test suites to clear in-memory rate limit pools."""
        self._requests.clear()
        self._auth_requests.clear()

    async def dispatch(self, request: Request, call_next) -> Response:
        if not self.enabled:
            return await call_next(request)

        # Skip rate limiting for static docs and health check
        path = request.url.path
        if path in ["/docs", "/redoc", "/openapi.json", "/api/v1/health"]:
            return await call_next(request)

        # In automated test suite environments (pytest), bypass unless explicitly testing rate limits
        if os.environ.get("PYTEST_CURRENT_TEST") and not request.headers.get("X-Test-Rate-Limit"):
            return await call_next(request)

        now = time.time()
        client_ip = request.client.host if request.client else "127.0.0.1"

        # 1. Strict Auth / Sensitive Endpoint Rate Limiting (20 req / 60 sec)
        is_sensitive = any(
            path.startswith(prefix)
            for prefix in [
                "/api/v1/auth/login",
                "/api/v1/auth/register",
                "/api/v1/auth/verify-otp",
                "/api/v1/auth/request-otp",
            ]
        )

        if is_sensitive:
            window_start = now - 60.0
            auth_history = [t for t in self._auth_requests[client_ip] if t > window_start]
            self._auth_requests[client_ip] = auth_history

            if len(auth_history) >= 20:
                logger.warning(f"Rate limit exceeded on auth endpoint for client IP {client_ip}")
                retry_after = int(60 - (now - auth_history[0])) + 1
                return JSONResponse(
                    status_code=429,
                    content={
                        "success": False,
                        "message": "Too many requests to authentication endpoint. Please wait before retrying.",
                        "retry_after_seconds": max(1, retry_after),
                    },
                    headers={"Retry-After": str(max(1, retry_after))},
                )
            self._auth_requests[client_ip].append(now)

        # 2. General API Rate Limiting (300 req / 60 sec)
        window_start_gen = now - 60.0
        gen_history = [t for t in self._requests[client_ip] if t > window_start_gen]
        self._requests[client_ip] = gen_history

        if len(gen_history) >= 300:
            logger.warning(f"General API rate limit exceeded for client IP {client_ip}")
            return JSONResponse(
                status_code=429,
                content={
                    "success": False,
                    "message": "API rate limit exceeded. Please throttle your requests.",
                    "retry_after_seconds": 30,
                },
                headers={"Retry-After": "30"},
            )
        self._requests[client_ip].append(now)

        return await call_next(request)
